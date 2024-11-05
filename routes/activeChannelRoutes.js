const express = require('express');
const { SetActiveChannel } = require('../controllers/activeChannelController');
const { Getlevel2GamesController, addLevel2Models } = require('../controllers/level2GamesController');

const router = express.Router();

router.post('/set-active-channel', SetActiveChannel);
router.post('/get-models-details', Getlevel2GamesController);
router.post('/set-models-details', addLevel2Models);

module.exports = router;
