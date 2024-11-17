const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  level: Number,
  attempts: Number,
  timeTaken: Number,
  mistakes: Number,
  marks: Number,
  scorePercentage: Number,
  status: { type: String, enum: ['pass', 'fail'] },
  round: { type: String }
});

module.exports = mongoose.model('Exam', examSchema);
