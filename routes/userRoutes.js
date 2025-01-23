const express = require('express');
const { createUser, validateUser, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', validateUser);
router.get('/getUser', getUser);

module.exports = router;
