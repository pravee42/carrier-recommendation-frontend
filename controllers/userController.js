const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const {default: axios} = require('axios');
const activeChannel = require('../models/activeChannel');
const Exam = require('../models/Exam');
const Level2Games = require('../models/level2Games');

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const DOJ = dayjs(user.DOJ);
    const schedules = [];
    for (let i = 1; i <= 3; i++) {
      let scheduleDate = DOJ.add(i, 'day');
      if (scheduleDate.day() === 0) {
        scheduleDate = scheduleDate.add(1, 'day');
      }
      const schedule = await new Schedule({
        userId: user._id,
        scheduleDate,
      }).save();
      schedules.push(schedule);
    }

    // Generate PDF
    const pdfFilePath = path.join('userTimeTables', `${user._id}.pdf`);
    const htmlContent = `
      <h1>User Time Table</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${schedules
            .map(
              schedule => `
            <tr>
              <td>${schedule.scheduleDate.toISOString().slice(0, 10)}</td>
              <td>08:30 - 12:30</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `;

    pdf.create(htmlContent, {}).toFile(pdfFilePath, err => {
      if (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({message: 'Error generating PDF'});
      } else {
        res.status(201).json({
          user,
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
    const user = await User.findOne({mobileNo: contact});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const matchPayload = {
      Template1: fingerPrintHash,
      Template2: user.fingerprint,
    };

    const response = await axios.post(
      'http://192.168.0.109:5000/match',
      matchPayload,
    );
    const data = response.data.MatchingScore > 100;

    const lastUserExam = await Exam.find({userId: user._id});
    const lastData = lastUserExam[lastUserExam.length - 1];

    // Fetch devices dynamically from Level2Games
    const level2Games = await Level2Games.find({});
    const deviceMapping = level2Games.reduce((acc, game) => {
      acc[game.modelName] = acc[game.modelName] || [];
      acc[game.modelName].push(game.device);
      return acc;
    }, {});
    console.log(deviceMapping, lastData)
    // Determine the user's next session based on last exam results
    if (lastUserExam.length === 0) {
      user['nextSession'] = 'level 1';
      await activeChannel.findOneAndUpdate(
        {device: deviceMapping['A'][0]}, // Get first device for level 1
        {
          userId: user._id,
          lastConnectedTime: new Date(),
          status: 'assigned',
        },
        {new: true, upsert: true},
      );
    } else if (lastData.level === 1) {
      user.nextSession = 'level 2 round A';
      await activeChannel.findOneAndUpdate(
        {device: deviceMapping['A'][0]}, // Get first device for level 2
        {
          userId: user._id,
          lastConnectedTime: new Date(),
          status: 'assigned',
        },
        {new: true, upsert: true},
      );
    } else if (lastData.level === 2) {
      const currentRound = lastData.round || 'A'; // Default to round A if not specified
      const rounds = ['A', 'B', 'C', 'D'];
      const currentIndex = rounds.indexOf(currentRound);

      console.log("Current Index: " + currentIndex)

      // Check if the next round exists
      if (currentIndex < rounds.length - 1) {
        user.nextSession = `level 2 round ${rounds[currentIndex + 1]}`;
        console.log("---> ", deviceMapping[rounds[currentIndex+1]][0], "dfkdf");
        try {
          await activeChannel.findOneAndUpdate(
            {device: deviceMapping[rounds[currentIndex+1]][0]}, // Get device for next round
            {
              userId: user._id,
              lastConnectedTime: new Date(),
              status: 'assigned',
            },
            {new: true, upsert: true},
          );
        } catch (err) {
          console.log("dfdfdf", err);
        }
      } else {
        user.nextSession = 'level 3'; // Move to the next level if all rounds completed
        await activeChannel.findOneAndUpdate(
          {device: deviceMapping[3][0]}, // Get first device for level 3
          {
            userId: user._id,
            lastConnectedTime: new Date(),
            status: 'assigned',
          },
          {new: true, upsert: true},
        );
      }
    }

    // Save the updated user object
    await user.save();

    if (data) {
      return res.status(200).json({
        message: 'Authentication successful',
        userData: user,
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

module.exports = {createUser, validateUser};
