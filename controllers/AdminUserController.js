const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "japan"

const loginAdminUser = async (req, res) => {
  try {
    const {username, password} = req.body;

    // Check if the user exists
    const user = await AdminUser.findOne({username});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
      {id: user._id, role: user.role},
      JWT_SECRET,
      {expiresIn: '1h'}, 
    );

    // Respond with the token
    res.status(200).json({message: 'Login successful', token, role: user.role});
  } catch (error) {
    res.status(500).json({message: 'Error logging in', error});
  }
};

// Controller to create a new admin user
const createAdminUser = async (req, res) => {
  try {
    const {username, password, role, name, email} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new AdminUser({
      username,
      password: hashedPassword,
      name,
      email,
      role,
    });

    await newUser.save();
    res.status(201).json({message: 'Admin user created successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error creating user', error});
  }
};

// Controller to get all admin users
const getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find().select("-password")
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: 'Error fetching users', error});
  }
};

// Controller to delete an admin user by ID
const deleteAdminUser = async (req, res) => {
  try {
    const {id} = req.params;
    await AdminUser.findByIdAndDelete(id);
    res.status(200).json({message: 'Admin user deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error deleting user', error});
  }
};

module.exports = {
  createAdminUser,
  getAllAdminUsers,
  deleteAdminUser,
  loginAdminUser,
};
