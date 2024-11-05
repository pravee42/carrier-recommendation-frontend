const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  _id: Number,
  questionImage: {type: String, required: true},
  correctAnswer: {type: String, required: true},
});

const level2ASchema = new mongoose.Schema({
  questions: [QuestionSchema],
  passPercentage: {type: Number, required: true},
  timeToComplete: {type: Number, required: true},
  workingLine: {type: String, required: true},
  totalMarks: {type: Number, required: true},
});

module.exports = mongoose.model('level2A', level2ASchema);
