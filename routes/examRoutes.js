const express = require('express');
const {
  createMCQSettings,
  createExamResult,
} = require('../controllers/examController');
const authendicate = require('../middleware/authendicate');
const {
  addMCQQuestionsController,
  submitMCQResultController,
  GetQuestionsController,
} = require('../controllers/mcqControllers');
const {
  addLevel2AQuestionsController,
  submitLevel2AResultController,
  GetQuestionsLevel2AController,
  addTutorialSection,
  getTutorialSection,
  getLevel2CompletedUsers,
} = require('../controllers/level2GamesController');

const router = express.Router();

router.post('/mcq', createMCQSettings);
router.post('/mcq/add', addMCQQuestionsController);
router.get('/mcq/get-questions', GetQuestionsController);
router.post('/mcq/validate', submitMCQResultController);
router.post('/exam/result', createExamResult);
router.post('/level2/a/add', addLevel2AQuestionsController);
router.post('/level2/add-tutorial', addTutorialSection);
router.get('/level2/get-tutorial', getTutorialSection);
router.get(
  '/level2/get-completed-users',
  authendicate,
  getLevel2CompletedUsers,
);
router.post('/level2/a/submit', submitLevel2AResultController);
router.post('/level2/a/get-questions', GetQuestionsLevel2AController);

module.exports = router;
