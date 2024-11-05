const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionImage: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

const level2ASchema = new mongoose.Schema({
    questions: [QuestionSchema],
    passPercentage: { type: Number, required: true },
    timeToComplete: { type: Number, required: true }, 
});

module.exports = mongoose.model('level2A', level2ASchema);
