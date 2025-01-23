const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  traineeName: String,
  DOJ: {type: Date, default: new Date()},
  mobileNo: {type: String, unique: true},
  email: String,
  qualification: String,
  branch: String,
  designationGrade: {
    type: String,
  },
  collegeName: String,
  yearOfPassOut: String,
  address: String,
  fingerprint: String,
  verified: {type: Boolean, default: false},
  verifiedBy: String,
  userImage: String,
  nextSession: {
    type: Object,
  },
  nameOfWorkingLine: String,
  NameOfSupervisor: String,
  supervisorId: String,
  PhoneNumberOfSuperVisor: String,
  cc_no: {type: String, default: ""},
  shopguru: String,
  teamleader: String,
  sectionhead: String,
});

module.exports = mongoose.model('User', userSchema);
