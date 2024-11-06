const { default: axios } = require('axios');
const activeChannel = require('../models/activeChannel');
const level2A = require('../models/Level2A');
const MCQ = require('../models/mcq');
const User = require('../models/User');

const SetActiveChannel = async (req, res) => {
  try {
    const { userId, device, level, round } = req.body;

    // Validate request body
    if (!userId || !device) {
      return res.status(400).json({ message: 'userId and device are required.' });
    }

    const getAssigned = await activeChannel.findOne({
      userId: userId,
      device: device,
      status: { $in: ['assigned', 'started'] },
    });

    if (!getAssigned) {
      return res.status(404).json({ message: 'No active channel found.' });
    }

    // Update or create the active channel
    const activechannel = await activeChannel.findOneAndUpdate(
      { device: device },
      {
        userId: userId,
        lastConnectedTime: new Date(),
        status: 'started',
      },
      { new: true, upsert: true }
    );

    if (level === 1) {
      try {
        const data = await MCQ.findOne({}, { 'questions.correctAnswer': 0 });
        return res.status(200).json(data); // Add 'return' to prevent further execution
      } catch (error) {
        return res.status(500).json({ message: error.message }); // Add 'return'
      }
    } else if (level === 2) {
      if (round === 'A') {
        const UserData = await User.findById(userId);
        const nameOfWorkingLine = UserData.nameOfWorkingLine;
        try {
          const data = await level2A.find(
            { workingLine: nameOfWorkingLine },
            { 'questions.correctAnswer': 0 }
          );
          return res.status(200).json(data); // Add 'return'
        } catch (error) {
          return res.status(500).json({ message: error.message }); // Add 'return'
        }
      } else if (round === 'B') {
        const start = await axios.get(`http://192.168.0.113:8790/0/start_game?userId=${userId}`);
        return res.status(200).send({ video: 'http://192.168.0.113:8790/0/video_feed' }); // Add 'return'
      } else if (round === 'C') {
        const start = await axios.get(`http://192.168.0.113:8790/1/start_game?userId=${userId}`);
        return res.status(200).send({ video: 'http://192.168.0.113:8790/1/video_feed' }); // Add 'return'
      } else if (round === 'D') {
        const start = await axios.get(`http://192.168.0.113:8790/2/start_game?userId=${userId}`);
        return res.status(200).send({ video: 'http://192.168.0.113:8790/2/video_feed' }); // Add 'return'
      }
    }

    // If no specific level or round matched, respond with the active channel data
    return res.status(200).json(activechannel); // Add 'return'
  } catch (error) {
    console.error('Error in SetActiveChannel:', error);
    return res.status(500).json({ message: error.message }); // Add 'return'
  }
};

module.exports = { SetActiveChannel };
