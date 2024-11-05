const mongoose = require('mongoose');

const activeChannelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  device: { type: String, required: true, unique: true }, 
  lastConnectedTime: { type: Date },
  status: {type: String, required: true}
});

module.exports = mongoose.model('activeChannel', activeChannelSchema);
