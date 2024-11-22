const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

module.exports = mongoose.model('SuperVisor', supervisorSchema);
