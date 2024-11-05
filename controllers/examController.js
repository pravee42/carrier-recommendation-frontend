const Exam = require('../models/Exam');
const activeChannel = require('../models/activeChannel');
const Settings = require('../models/Settings');

// Socket.IO instance (passed from the main server file)
let io;
const initSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

const createMCQSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { level1PassPercent: req.body.level1PassPercent },
      { upsert: true, new: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExamResult = async (req, res) => {
  const { userId, level, round, timeTaken, mistakes, status } = req.body;

  try {
    // Only apply the round progression check if level is 2 or higher
    if (level >= 2) {
      const roundOrder = ['A', 'B', 'C'];
      const currentRoundIndex = roundOrder.indexOf(round);
      
      if (currentRoundIndex > 0) {
        const previousRound = roundOrder[currentRoundIndex - 1];
        
        const previousExam = await Exam.findOne({
          userId,
          level,
          round: previousRound,
          status: 'pass'
        });

        if (!previousExam) {
          return res.status(400).json({
            message: `You must pass round ${previousRound} before attempting round ${round} at level ${level}.`
          });
        }
      }
    }

    // Check if an entry already exists for the same user, level, and round
    const existingExamResult = await Exam.findOne({ userId, level, round });

    let examResult;
    if (existingExamResult) {
      // If the record exists, increment the attempts and update the other fields
      existingExamResult.attempts += 1;
      existingExamResult.timeTaken = timeTaken;
      existingExamResult.mistakes = mistakes;
      existingExamResult.status = status;

      examResult = await existingExamResult.save();
    } else {
      // If no existing record, create a new exam result
      examResult = await new Exam({
        userId,
        level,
        round,
        attempts: 1,
        timeTaken,
        mistakes,
        status,
      }).save();
    }

    // Find the device name for the user
    const userDevice = await activeChannel.findOne({ userId });
    if (!userDevice) {
      return res.status(404).json({ message: 'Device not found for the user.' });
    }
    const deviceName = userDevice.deviceName;

    // Emit the message to the specific device's channel
    io.to(deviceName).emit('examUpdate', {
      message: `Exam result updated for userId ${userId}`,
      data: examResult
    });

    res.status(existingExamResult ? 200 : 201).json(examResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




module.exports = { createMCQSettings, createExamResult, initSocket };
