const mongoose = require('mongoose');

const CheckPointsSchema = new mongoose.Schema({
  partHandling: Array,
  inputQuality: Array,
  workAsPerSOP: Array,
  outputQuality: Array,
  cycleTime: Array,
  awareness: Number,
  safety: Number,
  discipline: Number
});

const operatorObservationSchema = new mongoose.Schema({
  userId:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  assignieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperVisor',
    required: true,
  },
  stationNo: Number,
  lineName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  },
  checkPoints: CheckPointsSchema,
  totalPoints: Array,
});

module.exports = mongoose.model('operatorObservation', operatorObservationSchema);
