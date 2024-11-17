const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'supervisor', 'trainer'],
    required: true,
  },
}, {
  timestamps: true
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
