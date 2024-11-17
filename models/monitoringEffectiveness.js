const mongoose = require('mongoose');

const checkpointSchema = new mongoose.Schema({
  parthandling: {type: Number, default: 0, min: 0, max: 2},
  inputQuality: {type: Number, default: 0, min: 0, max: 2},
  workAsPerSOP: {type: Number, default: 0, min: 0, max: 2},
  outputQuality: {type: Number, default: 0, min: 0, max: 2},
  cycleTime: {type: Number, default: 0, min: 0, max: 2},
  Awareness: {type: Number, default: 0, min: 0, max: 2},
  Safety: {type: Number, default: 0, min: 0, max: 2},
  Discipline: {type: Number, default: 0, min: 0, max: 2},
});

const monitoringEffectivenessSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  checkpoints: [checkpointSchema],
  date: {type: Date, required: true},
  totalMarks: {type: Number, required: true},
  percentage: {
    type: Number,
    required: true,
    default: function () {
      return (this.totalMarks / 16) * 100;
    },
  },
});

monitoringEffectivenessSchema.index({userId: 1, date: 1}, {unique: true});

const MonitoringEffectiveness = mongoose.model(
  'MonitoringEffectiveness',
  monitoringEffectivenessSchema,
);

module.exports = MonitoringEffectiveness;
