const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduleDate: Date,
});

module.exports = mongoose.model('Schedule', scheduleSchema);
