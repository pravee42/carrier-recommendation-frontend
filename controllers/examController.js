const Exam = require('../models/Exam');
const activeChannel = require('../models/activeChannel');
const Settings = require('../models/Settings');

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

  console.log(req.body)

  console.log("dsnkjfnkjfnkjfndjkfjksfnkjnfjsnfkjsdnf")

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
          status: 'pass',
        });

        if (!previousExam) {
          return res.status(400).json({
            message: `You must pass round ${previousRound} before attempting round ${round} at level ${level}.`,
          });
        }
      }
    }

    // Find all attempts for the same user, level, and round
    const userAttempts = await Exam.find({userId, level, round}).sort({
      createdAt: 1,
    });

    let examResult;
    if (userAttempts.length >= 5) {
      // If there are 5 attempts, overwrite the oldest attempt (first item in sorted list)
      const oldestAttempt = userAttempts[userAttempts.length-1];
      oldestAttempt.timeTaken = timeTaken;
      oldestAttempt.mistakes = mistakes;
      oldestAttempt.status = status;
      oldestAttempt.attempts += 1; // Increment the attempts count

      examResult = await oldestAttempt.save();
    } else {
      // If less than 5 attempts, create a new exam result
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

    const deviceToUpdate = await activeChannel.find({userId})

    if (deviceToUpdate) {
      emitMessage(deviceToUpdate.device, examResult);
    }

    await activeChannel.findOneAndUpdate(
      {device: deviceToUpdate},
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
