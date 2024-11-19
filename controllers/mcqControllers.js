
const Exam = require('../models/Exam');
const MCQ = require('../models/mcq');

const activeChannel = require('../models/activeChannel'); // Assumed model for active channels

// Controller to add or update MCQ questions
const addMCQQuestionsController = async (req, res) => {
  try {
    const {
      questions,
      passPercentage,
      timeToComplete,
      minimumPassPercentage,
      maximumPassPercentage,
    } = req.body;

    // Validate questions array to ensure each question includes marks and correctAnswer as an array
    const validatedQuestions = questions.map((question) => {
      if (!Array.isArray(question.correctAnswer)) {
        throw new Error("Each question's correctAnswer should be an array");
      }
      if (typeof question.marks !== "number") {
        throw new Error("Each question should have a numerical marks value");
      }
      return question;
    });

    const mcq = await MCQ.findOneAndUpdate(
      {},
      {
        $set: {
          questions: validatedQuestions,
          passPercentage,
          timeToComplete,
          minimumPassPercentage,
          maximumPassPercentage,
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
    const {userId, device, answers} = req.body; // answers: { questionId: answer }

    const mcq = await MCQ.findOne();
    if (!mcq) return res.status(404).json({message: 'MCQ not found'});

    const correctAnswers = mcq.questions.filter(
      q => answers[q._id] === q.correctAnswer,
    ).length;
    const scorePercentage = (correctAnswers / mcq.questions.length) * 100;
    const passed = scorePercentage >= mcq.passPercentage;

    res.status(200).json({passed, scorePercentage, correctAnswers});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const submitMCQResultController = async (req, res) => {
  console.log("djhdf")
  try {
    const {userId, device, answers} = req.body;

    // Fetch last connection time from activeChannel
    const activeChannel1 = await activeChannel.findOne({userId, device});
    if (!activeChannel1)
      return res.status(404).json({message: 'Active channel not found'});

    const mcq = await MCQ.findOne();
    if (!mcq) return res.status(404).json({message: 'MCQ not found'});

    const currentTime = new Date();
    const timeTaken = (currentTime - activeChannel1.lastConnectedTime) / 1000; // in seconds

    if (timeTaken > mcq.timeToComplete) {
      return res.status(400).json({message: 'Time limit exceeded'});
    }

    let totalMarks = 0;
    let earnedMarks = 0;

    mcq.questions.forEach(question => {
      totalMarks += question.marks;

      // Check if the answer is correct by comparing with all correct answers
      const userAnswer = answers[question._id];
      if (
        Array.isArray(question.correctAnswer) &&
        Array.isArray(userAnswer) &&
        question.correctAnswer.length === userAnswer.length &&
        question.correctAnswer.every(answer => userAnswer.includes(answer))
      ) {
        earnedMarks += question.marks;
      }
    });

    const scorePercentage = (earnedMarks / totalMarks) * 100;
    const passed = scorePercentage >= mcq.passPercentage;

    examResult = await new Exam({
      userId,
      level: 1,
      round: 'A',
      attempts: 1,
      timeTaken,
      marks:earnedMarks,
      status: passed ? "pass" : "fail",
      scorePercentage
    }).save();

    await activeChannel.findOneAndUpdate(
      {device: device},
      {
        userId: userId,
        status: 'ended',
      },
      {new: true, upsert: true},
    );

    res.status(200).json({
      status: passed ? 'pass' : 'fail',
      scorePercentage,
      earnedMarks,
      totalMarks,
      timeTaken,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: error.message});
  }
};

const GetQuestionsController = async (req, res) => {
  try {
    // Find all questions and exclude the correctAnswer field
    const data = await MCQ.findOne({});

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = {
  addMCQQuestionsController,
  validateMCQController,
  submitMCQResultController,
  GetQuestionsController,
};
