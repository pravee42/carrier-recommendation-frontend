const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

const MCQSchema = new mongoose.Schema({
    questions: [QuestionSchema],
    passPercentage: { type: Number, required: true },
    timeToComplete: { type: Number, required: true }, // in seconds or minutes
});

module.exports = mongoose.model('MCQ', MCQSchema);
