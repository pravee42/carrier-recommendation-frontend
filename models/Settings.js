const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  level1PassPercent: Number
});

module.exports = mongoose.model('Settings', settingsSchema);
