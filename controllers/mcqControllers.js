const MCQ = require('../models/mcq');
const activeChannel = require('../models/activeChannel'); // Assumed model for active channels

// Controller to add or update MCQ questions
const addMCQQuestionsController = async (req, res) => {
  try {
    const { questions, passPercentage, timeToComplete } = req.body;

    const mcq = await MCQ.findOneAndUpdate(
      {},
      {
        $set: {
          questions,
          passPercentage,
          timeToComplete,
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json(mcq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to validate answers and check pass percentage
const validateMCQController = async (req, res) => {
  try {
    const { userId, device, answers } = req.body; // answers: { questionId: answer }

    const mcq = await MCQ.findOne();
    if (!mcq) return res.status(404).json({ message: 'MCQ not found' });

    const correctAnswers = mcq.questions.filter((q) => answers[q._id] === q.correctAnswer).length;
    const scorePercentage = (correctAnswers / mcq.questions.length) * 100;
    const passed = scorePercentage >= mcq.passPercentage;

    res.status(200).json({ passed, scorePercentage, correctAnswers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to submit results and validate completion time
const submitMCQResultController = async (req, res) => {
  try {
    const { userId, device, answers } = req.body;

    // Fetch last connection time from activeChannel
    const activeChannel1 = await activeChannel.findOne({ userId, device });
    if (!activeChannel1) return res.status(404).json({ message: 'Active channel not found' });

    const mcq = await MCQ.findOne();
    if (!mcq) return res.status(404).json({ message: 'MCQ not found' });

    const currentTime = new Date();
    const timeTaken = (currentTime - activeChannel1.lastConnectedTime) / 1000; // in seconds

    if (timeTaken > mcq.timeToComplete) {
      return res.status(400).json({ message: 'Time limit exceeded' });
    }

    const correctAnswers = mcq.questions.filter((q) => answers[q._id] === q.correctAnswer).length;
    const scorePercentage = (correctAnswers / mcq.questions.length) * 100;
    const passed = scorePercentage >= mcq.passPercentage;

    res.status(200).json({
      passed,
      scorePercentage,
      correctAnswers,
      timeTaken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetQuestionsController = async (req, res) => {
    try {
      // Find all questions and exclude the correctAnswer field
      const data = await MCQ.find({}, { "questions.correctAnswer": 0 });
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { addMCQQuestionsController, validateMCQController, submitMCQResultController, GetQuestionsController };
