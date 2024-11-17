const express = require('express');
const router = express.Router();
const {createOrUpdateSettings, getSettings, deleteSettings} = require('../controllers/settingsController');

// Create or Update Settings
router.post('/settings', createOrUpdateSettings);

// Get Settings
router.get('/settings', getSettings);

// Delete Settings
router.delete('/settings', deleteSettings);

module.exports = router;
