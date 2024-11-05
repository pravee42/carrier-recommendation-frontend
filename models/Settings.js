const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  workingLineOptions: Array,
  designationGrade: Array
});

module.exports = mongoose.model('Settings', settingsSchema);
