const Exam = require('../models/Exam');
const activeChannel = require('../models/activeChannel');
const Settings = require('../models/Settings');
const {emitMessage} = require('../utils/socketSetup');

const createMCQSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      {level1PassPercent: req.body.level1PassPercent},
      {upsert: true, new: true},
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const createExamResult = async (req, res) => {
  const {userId, level, round, timeTaken, mistakes, status} = req.body;

  console.log(req.body);

  try {
    if (level >= 2) {
      const roundOrder = ['B', 'C', 'D'];
      const currentRoundIndex = roundOrder.indexOf(round);

      if (currentRoundIndex > 0) {
        const previousRound = roundOrder[currentRoundIndex - 1];

        const previousExam = await Exam.findOne({
          userId,
          level,
          round: previousRound,
          status: 'pass',
        });

        if (!previousExam) {
          return res.status(400).json({
            message: `You must pass round ${previousRound} before attempting round ${round} at level ${level}.`,
          });
        }
      }
    }

    const userAttempts = await Exam.find({userId, level, round}).sort({
      createdAt: 1,
    });

    let examResult;
    if (userAttempts.length >= 5) {
      const oldestAttempt = userAttempts[userAttempts.length - 1];
      oldestAttempt.timeTaken = timeTaken;
      oldestAttempt.mistakes = mistakes;
      oldestAttempt.status = status ? 'pass' : 'fail';
      oldestAttempt.scorePercentage = status ? 100 : 0;
      oldestAttempt.attempts += 1;

      examResult = await oldestAttempt.save();
    } else {
      examResult = await new Exam({
        userId,
        level,
        round,
        attempts: 1,
        timeTaken,
        mistakes,
        status: status ? 'pass' : 'fail',
        scorePercentage: status ? 100 : 0,
      }).save();
    }

    try {
      const deviceToUpdate = await activeChannel
        .find({
          userId,
          status: 'started',
        })
        .sort({lastConnectedTime: -1})
        .limit(1);

      if (deviceToUpdate?.[0]) {
        emitMessage(deviceToUpdate[0].device, examResult);
      } else {
        console.log('no device to update has been added');
      }
    } catch (error) {
      console.log(error.message, 'error emitting');
    }

    await activeChannel.findOneAndUpdate(
      {device: deviceToUpdate?.[0]?.device},
      {
        userId: userId,
        status: 'ended',
      },
      {new: true, upsert: true},
    );

    res.status(userAttempts.length >= 5 ? 200 : 201).json(examResult);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

module.exports = {createMCQSettings, createExamResult};
