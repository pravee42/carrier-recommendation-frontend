const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  workingLineOptions: Array,
  designationGrade: Array,
  level3ProcessNames: Array,
  shopGuru: String,
  TeamLeader: String,
  trainerEmail: String,
  SectionHead: String
});

module.exports = mongoose.model('Settings', settingsSchema);
