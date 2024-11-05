const level2Games = require('../models/level2Games');
const level2A = require('../models/Level2A');
const activeChannel = require('../models/activeChannel');

const Getlevel2GamesController = async (req, res) => {
  try {
    const data = await level2Games.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


const addLevel2Models = async (req, res) => {
  try {
    const {modelName, device} = req.body;

    const level2Game = await level2Games.findOneAndUpdate(
      { modelName },
      { $set: { modelName, device } },
      { upsert: true, new: true },
    );

    res.status(200).json(level2Game);
  }
  catch (error) {
    console.log(error)
  }
}

// Controller to add or update MCQ questions
const addLevel2AQuestionsController = async (req, res) => {
  try {
    const {questions, passPercentage, timeToComplete} = req.body;

    const mcq = await level2A.findOneAndUpdate(
      {},
      {
        $set: {
          questions,
          passPercentage,
          timeToComplete,
        },
      },
      {upsert: true, new: true},
    );

    res.status(200).json(mcq);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const submitLevel2AResultController = async (req, res) => {
  try {
    const {userId, device, answers} = req.body;

    // Fetch last connection time from activeChannel
    const activeChannel1 = await activeChannel.findOne({userId, device});
    if (!activeChannel1)
      return res.status(404).json({message: 'Active channel not found'});

    const mcq = await level2A.findOne();
    if (!mcq) return res.status(404).json({message: 'MCQ not found'});

    const currentTime = new Date();
    const timeTaken = (currentTime - activeChannel1.lastConnectedTime) / 1000; // in seconds

    if (timeTaken > mcq.timeToComplete) {
      return res.status(400).json({message: 'Time limit exceeded'});
    }

    const correctAnswers = mcq.questions.filter(
      q => answers[q._id] === q.correctAnswer,
    ).length;
    const scorePercentage = (correctAnswers / mcq.questions.length) * 100;
    const passed = scorePercentage >= mcq.passPercentage;

    res.status(200).json({
      passed,
      scorePercentage,
      correctAnswers,
      timeTaken,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const GetQuestionsLevel2AController = async (req, res) => {
  try {
    // Find all questions and exclude the correctAnswer field
    const data = await level2A.find({}, {'questions.correctAnswer': 0});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = {
  Getlevel2GamesController,
  addLevel2AQuestionsController,
  submitLevel2AResultController,
  GetQuestionsLevel2AController,
  addLevel2Models
};
