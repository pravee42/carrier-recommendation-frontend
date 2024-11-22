const mongoose = require('mongoose');

const level2Schema = new mongoose.Schema({
  round: String,
  tutorialVideo: String,
  tutorialImages: Array
});

module.exports = mongoose.model('level2', level2Schema);
