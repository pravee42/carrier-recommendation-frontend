const mongoose = require('mongoose');

const monitoringMultiSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  nameOfProducts: {
    type: String,
    required: true
  },
  line: {
    type: String,
    required: true
  },
  process: {
    type: String,
    required: true
  },
  skillLevel: {
    type: Number,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  }
});

const MonitoringMultiSkill = mongoose.model('MonitoringMultiSkill', monitoringMultiSkillSchema);

module.exports = MonitoringMultiSkill;
