const express = require('express');
const { SetActiveChannel } = require('../controllers/activeChannelController');
const { Getlevel2GamesController, addLevel2Models, calibrateMultipleCameras, getCalibratedDatas } = require('../controllers/level2GamesController');

const router = express.Router();

router.post('/set-active-channel', SetActiveChannel);
router.get('/get-models-details', Getlevel2GamesController);
router.post('/video-calibration', calibrateMultipleCameras);
router.get('/video-calibration', getCalibratedDatas);
router.post('/set-models-details', addLevel2Models);

module.exports = router;
