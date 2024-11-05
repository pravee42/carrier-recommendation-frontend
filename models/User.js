const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  traineeName: String,
  DOJ: Date,
  mobileNo: {type: String, unique: true},
  email: String,
  qualification: String,
  branch: String,
  designationGrade: {
    type: String,
    enum: ['Apprentice', 'STTs', 'NEEM', 'LEAD'],
  },
  collegeName: String,
  yearOfPassOut: String,
  address: String,
  fingerprint: String,
  verified: {type: Boolean, default: false},
  verifiedBy: String,
  userImage: String,
});

module.exports = mongoose.model('User', userSchema);
