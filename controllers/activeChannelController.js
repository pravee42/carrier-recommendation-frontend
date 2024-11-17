const {default: axios} = require('axios');
const activeChannel = require('../models/activeChannel');
const level2A = require('../models/Level2A');
const MCQ = require('../models/mcq');
const User = require('../models/User');


const SATHISH_API = process.env.SATHISH_API_KEY

const SetActiveChannel = async (req, res) => {
  try {
    const {userId, device, level, round} = req.body;

    if (!userId || !device) {
      return res.status(400).json({message: 'userId and device are required.'});
    }

    const getAssigned = await activeChannel.findOne({
      userId: userId,
      device: device,
      status: {$in: ['assigned', 'started']},
    });

    if (!getAssigned) {
      return res.status(404).json({message: 'No active channel found.'});
    }

    const activechannel = await activeChannel.findOneAndUpdate(
      {device: device},
      {
        userId: userId,
        lastConnectedTime: new Date(),
        status: 'started',
      },
      {new: true, upsert: true},
    );

    if (level === 1) {
      try {
        const data = await MCQ.findOne({}, {'questions.correctAnswer': 0});
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({message: error.message});
      }
    } else if (level === 2) {
      if (round === 'A') {
        const UserData = await User.findById(userId);
        const nameOfWorkingLine = UserData.nameOfWorkingLine;
        try {
          const questionsData = await level2A.findOne(
            {workingLine: nameOfWorkingLine},
            {questions: 1, timeToComplete: 1},
          );

          if (!questionsData) {
            return res
              .status(404)
              .json({message: 'No questions found for this type'});
          }

          const questions = questionsData.questions.map(q => ({
            questionId: q._id,
            questionImage: q.questionImage,
          }));

          const allAnswers = questionsData.questions.map(q => q.correctAnswer);

          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

          return res.status(200).json({
            questions,
            shuffledAnswers,
            level: 2,
            timeToComplete,
            nameOfWorkingLine,
            round: 'A'
          });

          // return res.status(200).json(data);
        } catch (error) {
          return res.status(500).json({message: error.message});
        }
      } else if (round === 'B') {
        const start = await axios.get(
          `${SATHISH_API}/0/start_game?userId=${userId}`,
        );
        return res
          .status(200)
          .send({video: '${SATHISH_API}/0/video_feed'}); // Add 'return'
      } else if (round === 'C') {
        const start = await axios.get(
          `${SATHISH_API}/1/start_game?userId=${userId}`,
        );
        return res
          .status(200)
          .send({video: '${SATHISH_API}/1/video_feed'}); // Add 'return'
      } else if (round === 'D') {
        const start = await axios.get(
          `${SATHISH_API}/2/start_game?userId=${userId}`,
        );
        return res
          .status(200)
          .send({video: '${SATHISH_API}/2/video_feed'}); // Add 'return'
      }
    }

    // If no specific level or round matched, respond with the active channel data
    return res.status(200).json(activechannel); // Add 'return'
  } catch (error) {
    console.error('Error in SetActiveChannel:', error);
    return res.status(500).json({message: error.message}); // Add 'return'
  }
};

module.exports = {SetActiveChannel};
