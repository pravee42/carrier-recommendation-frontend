const mongoose = require('mongoose');

const level2Schema = new mongoose.Schema({
  level: Number,
  tutorialVideo: String,
  tutorialImages: Array
});

module.exports = mongoose.model('level2Schema', level2Schema);
