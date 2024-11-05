const mongoose = require('mongoose');

const level3CyleTimeSchema = new mongoose.Schema({
  attempts: Number,
  status: {type: String, enum: ['pass', 'fail']},
  byHeartTestActualScore: {type: String, required: true},
  cycleTimes: Array,
  mistakes: Array,
  designCycleTime: Number,
  targetScore: Number,
  actualScore: Number,
});

const level3MemorySchema = new mongoose.Schema({
  attempts: Number,
  mistakes: Number,
  score: Number,
  status: {type: String, enum: ['pass', 'fail']},
  myProcessObservation: {type: String, required: true},
  byHeartTestActualScore: {type: String, required: true},
});

const level3Schema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  assignieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperVisor',
    required: true,
  },
  processName: {type: String, required: true},
  processNumber: {type: Number, required: true},
  level3CycleTime: level3CyleTimeSchema,
  level3Memory: level3MemorySchema,
});

module.exports = mongoose.model('Level3', level3Schema);
