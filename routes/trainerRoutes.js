const express = require('express');
const router = express.Router();
const { getUnverifiedUsers, verifyUsers } = require('../controllers/trainerController');

// Route to get all unverified users
router.get('/unverified-users', getUnverifiedUsers);

// Route to verify bulk users
router.post('/verify-users', verifyUsers);

module.exports = router;
