const express = require('express');
const router = express.Router();
const authendicate = require('../middleware/authendicate')
const { getUnverifiedUsers, verifyUsers } = require('../controllers/trainerController');

// Route to get all unverified users
router.get('/unverified-users', getUnverifiedUsers);

// Route to verify bulk users
router.post('/verify-users', authendicate, verifyUsers);

module.exports = router;
