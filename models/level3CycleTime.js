const mongoose = require('mongoose');


const level3CyleTimeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processName: String,
    processNumber: Number,
    attempts: Number,
    status: { type: String, enum: ['pass', 'fail'] },
    byHeartTestActualScore: {type: String, required: true},
    cycleTimes: Array,
    mistakes: Array,
    desginCycleTime: Number,
    targetScore: Number,
    actualScore: Number,

    assignieId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperVisor' },
});

module.exports = mongoose.model('level3CyleTime', level3CyleTimeSchema);
