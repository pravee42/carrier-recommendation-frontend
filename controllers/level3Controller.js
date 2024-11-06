const Level3 = require('../models/level3');
const SuperVisor = require('../models/Supervisor');
const User = require('../models/User');
const { sendMailToSuperVisor } = require('../utils/mail');


exports.addLevel3 = async (req, res) => {
  const { assignieId, userId } = req.params;
  const { processName, processNumber, level3CycleTime, level3Memory } = req.body;

  try {
    const newLevel3 = new Level3({
      userId,
      assignieId,
      processName,
      processNumber,
      level3CycleTime,
      level3Memory,
    });

    await newLevel3.save();
    res.status(201).json({ message: 'Level3 data added successfully', data: newLevel3 });
  } catch (error) {
    res.status(500).json({ message: 'Error adding Level3 data', error: error.message });
  }
};

exports.getLevel3 = async (req, res) => {
  const { id } = req.params;

  try {
    const level3 = await Level3.findById(id);
    if (!level3) {
      return res.status(404).json({ message: 'Level3 data not found' });
    }
    res.status(200).json({ data: level3 });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Level3 data', error: error.message });
  }
};

exports.updateLevel3 = async (req, res) => {
  const { id } = req.params;
  const { processName, processNumber, level3CycleTime, level3Memory } = req.body;

  try {
    const updatedLevel3 = await Level3.findByIdAndUpdate(
      id,
      { processName, processNumber, level3CycleTime, level3Memory },
      { new: true }
    );

    if (!updatedLevel3) {
      return res.status(404).json({ message: 'Level3 data not found' });
    }
    res.status(200).json({ message: 'Level3 data updated successfully', data: updatedLevel3 });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Level3 data', error: error.message });
  }
};

exports.bulkUpdateSupervisors = async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: 'Invalid data format or empty user list.' });
  }

  try {
    const updatePromises = users.map(async ({ userId, NameOfSupervisor, supervisorId }) => {
      const user = await User.findById(userId);

      if (user) {
        user.NameOfSupervisor = NameOfSupervisor;
        user.supervisorId = supervisorId;

        await user.save();

        // Fetch supervisor email
        const supervisor = await SuperVisor.findById(supervisorId);
        
        if (supervisor && supervisor.email) {
          // Send email to the supervisor
          await sendMailToSuperVisor(supervisor.email, userId, supervisorId, user.traineeName);
        }
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Bulk update successful and emails sent to supervisors.' });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ message: 'Bulk update failed', error: error.message });
  }
};
