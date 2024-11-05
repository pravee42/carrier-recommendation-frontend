const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: [{ type: String, required: true }], 
  marks: { type: Number, required: true },
});

const MCQSchema = new mongoose.Schema({
  questions: [QuestionSchema],
  passPercentage: { type: Number, required: true },
  minimumPassPercentage: { type: Number, required: true },
  maximumPassPercentage: { type: Number, required: true },
  timeToComplete: { type: Number, required: true }, 
});

module.exports = mongoose.model('MCQ', MCQSchema);
