const User = require('../models/User');
const path = require('path');
const pdf = require('html-pdf');
const level2 = require('../models/Level2');
const {default: axios} = require('axios');
const activeChannel = require('../models/activeChannel');
const Exam = require('../models/Exam');
const {emitMessage} = require('../utils/socketSetup');
const {sendMailToTrainer} = require('../utils/mail');
const Level2Games = require('../models/level2Games');
const {generateUserScheduleHtml} = require('../utils/generateUserScheduleHtml');
const Settings = require('../models/Settings');

function getNextFiveDaysExcludingSunday() {
  const days = [];
  let currentDate = new Date();

  while (days.length < 5) {
    if (currentDate.getDay() !== 0) {
      days.push(new Date(currentDate).toISOString().slice(0, 10));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
}

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const settings = await Settings.findOne();
    if (!settings || !settings.trainerEmail) {
      return res
        .status(500)
        .json({message: 'Trainer email not found in settings'});
    }

    const traineeEmail = settings.trainerEmail;
    const traineeName = user.name;

    // Generate PDF
    const pdfFilePath = path.join('userTimeTables', `${user._id}.pdf`);
    const nextFiveDays = getNextFiveDaysExcludingSunday();
    const htmlContent = generateUserScheduleHtml(
      nextFiveDays[0],
      nextFiveDays[1],
      nextFiveDays[2],
      nextFiveDays[3],
      nextFiveDays[4],
      nextFiveDays[5],
    );

    pdf.create(htmlContent, {}).toFile(pdfFilePath, err => {
      if (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({message: 'Error generating PDF'});
      } else {
        const userResponse = user.toObject();
        delete userResponse.fingerprint;

        sendMailToTrainer(traineeEmail, user._id, traineeName);

        try {
          const res = axios.post('http://127.0.0.1:5000/print', {
            file: `${user._id}.pdf`,
          });
        } catch (err) {
          console.log('error', err.message);
          res.status(500).json({
            message: 'Error Printing Pdf',
            user: userResponse,
            pdfUrl: `${req.protocol}://${req.get('host')}/userTimeTables/${
              user._id
            }.pdf`,
          });
        }

        res.status(201).json({
          user: userResponse,
          pdfUrl: `${req.protocol}://${req.get('host')}/userTimeTables/${
            user._id
          }.pdf`,
        });
      }
    });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

const validateUser = async (req, res) => {
  try {
    const {contact, fingerPrintHash} = req.body;

    // Find the user by contact
    let user = await User.findOne({mobileNo: contact});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const matchPayload = {
      Template1: fingerPrintHash,
      Template2: user.fingerprint,
    };

    const response = await axios.post(
      `${"http://127.0.0.1:5000"}/match`,
      matchPayload,
    );
    const data = response.data.MatchingScore > 100;

    const lastUserExam = await Exam.find({userId: user._id, status: 'pass'});
    const lastData = lastUserExam[lastUserExam.length - 1];

    // Fetch devices dynamically from Level2Games
    const level2Games = await Level2Games.find({});
    const deviceMapping = level2Games?.reduce((acc, game) => {
      acc[game.modelName] = acc[game.modelName] || [];
      acc[game.modelName].push(game.device);
      return acc;
    }, {});

    let nextSession = {};
    let deviceToUpdate = null;

    // Determine the user's next session based on last exam results
    if (lastUserExam.length === 0) {
      nextSession = {
        level: 1,
        model: `A`,
        round: 'A',
        device: deviceMapping['A'][0],
      };
      deviceToUpdate = `A_${deviceMapping['A'][0]}`;
    } else if (lastData.level === 1) {
      nextSession = {
        level: 2,
        round: 'A',
        listiner: `A`,
        device: `${deviceMapping['A'][0]}`,
      };
      deviceToUpdate = `A_${deviceMapping['A'][0]}`;
    } else if (lastData.level === 2) {
      const currentRound = lastData.round || 'A';
      const rounds = ['A', 'B', 'C', 'D'];
      const currentIndex = rounds.indexOf(currentRound);

      if (currentIndex < rounds.length - 1) {
        nextSession = {
          level: 2,
          round: rounds[currentIndex + 1],
          device: `${deviceMapping[rounds[currentIndex + 1]][0]}`,
          listiner: `${rounds[currentIndex + 1]}`,
        };

        deviceToUpdate = `${rounds[currentIndex + 1]}_${
          deviceMapping[rounds[currentIndex + 1]][0]
        }`;
      } else {
        nextSession = {};
        deviceToUpdate = deviceMapping[3][0];
      }
    }

    // Update user with nextSession
    user = await User.findOneAndUpdate(
      {_id: user._id},
      {$set: {nextSession: nextSession}},
      {new: true},
    );

    // console.log(user)

    const getActiveDevice = await activeChannel.findOne({
      device: deviceToUpdate,

    });

    if (!getActiveDevice) {
      await activeChannel.findOneAndUpdate(
        {device: deviceToUpdate},
        {
          userId: user._id,
          lastConnectedTime: new Date(),
          status: 'assigned',
        },
        {new: true, upsert: true},
      );
    }

    // Update active channel
    if (deviceToUpdate && getActiveDevice?.status === 'ended') {
      await activeChannel.findOneAndUpdate(
        {device: deviceToUpdate},
        {
          userId: user._id,
          lastConnectedTime: new Date(),
          status: 'assigned',
        },
        {new: true, upsert: true},
      );
    }

    if (data) {
      // Convert to plain object and remove sensitive data
      const userResponse = user.toObject();
      delete userResponse.fingerprint;

      // Ensure nextSession is included in response
      userResponse.nextSession = nextSession;

      if (userResponse.nextSession.level === 1) {
        userResponse.attendMCQ = true;
      } else if (
        userResponse.nextSession.level === 2 &&
        userResponse.nextSession.round === 'A'
      ) {
        userResponse.attendWriting = true;
      }

      // console.log(userResponse.nextSession.round)

      const tutorial = await level2?.findOne({
        round: userResponse.nextSession.round,
      });

      userResponse.nextSession.tutorialVideo = tutorial?.tutorialVideo;
      userResponse.nextSession.tutorialImages = tutorial?.tutorialImages;

      if (deviceToUpdate) {
        emitMessage(deviceToUpdate, userResponse);
      }

      if (
        user._id === getActiveDevice.userId &&
        getActiveDevice?.status !== 'ended'
      ) {
        return res.status(500).json({
          message: 'Authentication successful',
          error: 'Queue is Full! Please Come Back Later',
          userData: userResponse,
        });
      }

      return res.status(200).json({
        message: 'Authentication successful',
        userData: userResponse,
      });
    } else {
      return res.status(401).json({
        message: 'Invalid authentication',
      });
    }
  } catch (err) {
    console.error('Error validating user:', err.message);
    return res.status(500).json({message: 'Internal Server Error'});
  }
};

const getUser = async (req, res) => {
  const {userId, cc} = req?.query
  if(cc) {
    try {
      const data = await User.findOne({cc_no: cc}).select('-fingerprint');
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
  else {
    if(userId) {
      try {
        const data = await User.findOne({_id: userId}).select('-fingerprint');
    
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({message: error.message});
      }
    }
    else {
      try {
        const data = await User.find({}).select('-fingerprint');
    
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({message: error.message});
      }
    }
  }
}


module.exports = {createUser, validateUser, getUser};
