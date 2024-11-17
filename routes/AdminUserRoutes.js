const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authendicate');


const {
  loginAdminUser,
  createAdminUser,
  getAllAdminUsers,
  deleteAdminUser,
} = require('../controllers/AdminUserController');

// Route to handle login for admin users
router.post('/login', loginAdminUser);

router.post('/createadmin',authenticate, createAdminUser);
router.get('/getadmins', authenticate, getAllAdminUsers);
router.delete('/delete/:id', authenticate, deleteAdminUser);

module.exports = router;
