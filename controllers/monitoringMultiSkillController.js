const MonitoringMultiSkill = require('../models/monitoringMultiSkill');

// Create a new MonitoringMultiSkill entry
async function addMonitoringMultiSkill(data) {
  const newEntry = new MonitoringMultiSkill(data);
  await newEntry.save();
  return newEntry;
}

// Retrieve all MonitoringMultiSkill entries for a user
async function getMonitoringMultiSkills(userId) {
  const entries = await MonitoringMultiSkill.find({ userId }).sort({ createdAt: -1 });
  return entries;
}

// Update a MonitoringMultiSkill entry by ID
async function updateMonitoringMultiSkill(id, updateData) {
  const entry = await MonitoringMultiSkill.findByIdAndUpdate(id, updateData, { new: true });
  return entry;
}

// Delete a MonitoringMultiSkill entry by ID
async function deleteMonitoringMultiSkill(id) {
  await MonitoringMultiSkill.findByIdAndDelete(id);
  return { message: 'Entry deleted successfully' };
}

module.exports = {
  addMonitoringMultiSkill,
  getMonitoringMultiSkills,
  updateMonitoringMultiSkill,
  deleteMonitoringMultiSkill
};
