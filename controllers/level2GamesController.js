const level2Games = require('../models/level2Games');
const level2A = require('../models/Level2A');
const level2 = require('../models/Level2');
const activeChannel = require('../models/activeChannel');
const User = require('../models/User');
const Exam = require('../models/Exam');

const Getlevel2GamesController = async (req, res) => {
  try {
    const data = await level2Games.find();
    const videoFeeds = [
      `${SATHISH_VIDEO_API}/8790/0/video_feed`,
      `${SATHISH_VIDEO_API}/8790/1/video_feed`,
      `${SATHISH_VIDEO_API}/8790/2/video_feed`,
    ];

    res.status(200).json({ModelsData: data, videoFeeds: videoFeeds});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const addLevel2Models = async (req, res) => {
  try {
    const {modelName, device} = req.body;

    const level2Game = await level2Games.findOneAndUpdate(
      {modelName},
      {$set: {modelName, device, cameraUrl: ''}},
      {upsert: true, new: true},
    );

    res.status(200).json(level2Game);
  } catch (error) {
    console.log(error);
  }
};

// Controller to add or update MCQ questions
const addLevel2AQuestionsController = async (req, res) => {
  try {
    const {questions, passPercentage, timeToComplete, workingLine, totalMarks} =
      req.body;

    const mcq = await level2A.findOneAndUpdate(
      {},
      {
        $set: {
          questions,
          passPercentage,
          timeToComplete,
          workingLine,
          totalMarks,
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
    const {userId, device, answers, nameOfWorkingLine} = req.body;

    // Fetch last connection time from activeChannel
    const activeChannel1 = await activeChannel.findOne({userId, device});
    if (!activeChannel1)
      return res.status(404).json({message: 'Active channel not found'});

    const mcq = await level2A.findOne({workingLine: nameOfWorkingLine});
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

    examResult = await new Exam({
      userId,
      level: 2,
      round: 'A',
      attempts: 1,
      timeTaken,
      marks: correctAnswers,
      scorePercentage,
      status: passed ? 'pass' : 'fail',
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
  const {type} = req.body;
  try {
    // Find all questions and exclude the correctAnswer field
    const data = await level2A.find(
      {workingLine: type},
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


const calibrateMultipleCameras = async (req, res) => {
  const updates = req.body; // Expecting an array of { modelName, cameraUrl }

  try {
    const updatePromises = updates.map(async ({modelName, cameraUrl}) => {
      return level2Games.findOneAndUpdate(
        {modelName},
        {cameraUrl},
        {new: true},
      );
    });

    const results = await Promise.all(updatePromises);

    res.json({
      message: 'Camera URLs calibrated successfully',
      results,
    });
  } catch (error) {
    res.status(500).json({message: 'Error calibrating camera URLs', error});
  }
};

const addTutorialSection = async (req, res) => {
  try {
    const {round, tutorialVideo, tutorialImages} = req.body;

    const level2Data = await level2.findOneAndUpdate(
      {round}, // Filter by round
      {tutorialVideo, tutorialImages}, // Fields to update or insert
      {new: true, upsert: true, setDefaultsOnInsert: true}, // Options: create if not found
    );

    res.status(200).json({
      message: 'Level 2 data added or updated successfully',
      data: level2Data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding or updating level 2 data',
      error: error.message,
    });
  }
};

const getTutorialSection = async (req, res) => {
  try {
    const level2Data = await level2.find();
    res.status(200).json({
      message: 'Level 2 data retrieved successfully',
      data: level2Data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving level 2 data',
      error: error.message,
    });
  }
};

const getLevel2CompletedUsers = async (req, res) => {
  try {
    const qualifiedExams = await Exam.find({
      level: 2,
      round: 'D',
      status: 'pass'
    }).populate({
      path: 'userId',
      model: User,
      select: 'traineeName DOJ mobileNo qualification branch designationGrade fingerprint verified verifiedBy userImage nameOfWorkingLine', 
    });

    const users = qualifiedExams.map(exam => exam.userId);

    res.status(200).json({
      message: 'Qualified users retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching qualified users',
      error: error.message,
    });
  }
};

module.exports = {
  Getlevel2GamesController,
  addLevel2AQuestionsController,
  submitLevel2AResultController,
  GetQuestionsLevel2AController,
  addLevel2Models,
  calibrateMultipleCameras,
  addTutorialSection,
  getTutorialSection,
  getLevel2CompletedUsers
};
