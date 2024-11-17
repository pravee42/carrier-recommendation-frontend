const express = require('express');
const router = express.Router();
const {
  addMonitoringMultiSkill,
  getMonitoringMultiSkills,
  updateMonitoringMultiSkill,
  deleteMonitoringMultiSkill,
} = require('../controllers/monitoringMultiSkillController');

// Route to add a new MonitoringMultiSkill entry
router.post('/add', async (req, res) => {
  try {
    const newEntry = await addMonitoringMultiSkill(req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding entry', error });
  }
});

// Route to get all MonitoringMultiSkill entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const entries = await getMonitoringMultiSkills(req.params.userId);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries', error });
  }
});

// Route to update a MonitoringMultiSkill entry by ID
router.put('/update/:id', async (req, res) => {
  try {
    const updatedEntry = await updateMonitoringMultiSkill(req.params.id, req.body);
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry', error });
  }
});

// Route to delete a MonitoringMultiSkill entry by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await deleteMonitoringMultiSkill(req.params.id);
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error });
  }
});

module.exports = router;
