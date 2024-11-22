const mongoose = require('mongoose');

const level2GamesSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  device: {
    type: String,
  },
  cameraUrl: String,
});

module.exports = mongoose.model('Level2Games', level2GamesSchema);
