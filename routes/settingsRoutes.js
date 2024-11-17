const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Create or Update Settings
router.post('/settings', settingsController.createOrUpdateSettings);

// Get Settings
router.get('/settings', settingsController.getSettings);

// Delete Settings
router.delete('/settings', settingsController.deleteSettings);

module.exports = router;
