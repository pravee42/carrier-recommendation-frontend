const express = require('express');
const { createMCQSettings, createExamResult } = require('../controllers/examController');
const { addMCQQuestionsController, submitMCQResultController, GetQuestionsController } = require('../controllers/mcqControllers');
const { addLevel2AQuestionsController, submitLevel2AResultController, GetQuestionsLevel2AController, addTutorialSection, getTutorialSection } = require('../controllers/level2GamesController');

const router = express.Router();

router.post('/settings/mcq', createMCQSettings);
router.post('/settings/mcq/add', addMCQQuestionsController);
router.get('/mcq/get-questions', GetQuestionsController);
router.post('/settings/mcq/validate', submitMCQResultController);
router.post('/exam/result', createExamResult);
router.post('/level2/a/add', addLevel2AQuestionsController)
router.post('/level2/add-tutorial', addTutorialSection)
router.get('/level2/get-tutorial', getTutorialSection)
router.post('/level2/a/submit', submitLevel2AResultController)
router.post('/level2/a/get-questions', GetQuestionsLevel2AController)

module.exports = router;
