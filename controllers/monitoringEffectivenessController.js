const MonitoringEffectiveness = require('../models/monitoringEffectiveness');

async function enforceMonthlyLimit(userId) {
  const entries = await MonitoringEffectiveness.find({userId}).sort({date: 1});

  if (entries.length >= 12) {
    await MonitoringEffectiveness.deleteOne({
      _id: entries[entries.length - 1]._id,
    });
  }
}

async function addMonitoringEffectiveness(data) {
  await enforceMonthlyLimit(data.userId);

  const newEntry = new MonitoringEffectiveness(data);
  await newEntry.save();

  return newEntry;
}

async function getMonitoringEffectiveness(userId) {
  const entries = await MonitoringEffectiveness.find({userId}).sort({date: -1});
  return entries;
}

async function updateMonitoringEffectiveness(id, updateData) {
  const entry = await MonitoringEffectiveness.findByIdAndUpdate(
    id,
    updateData,
    {new: true},
  );
  return entry;
}

async function deleteMonitoringEffectiveness(id) {
  await MonitoringEffectiveness.findByIdAndDelete(id);
  return {message: 'Entry deleted successfully'};
}

module.exports = {
  addMonitoringEffectiveness,
  getMonitoringEffectiveness,
  updateMonitoringEffectiveness,
  deleteMonitoringEffectiveness,
};
