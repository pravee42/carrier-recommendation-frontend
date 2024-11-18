const Level3 = require('../models/level3');
const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const { sendMailToSuperVisor } = require('../utils/mail');


exports.addLevel3 = async (req, res) => {
  const { assignieId, userId } = req.params;
  const { processName, processNumber, level3CycleTime, level3Memory } = req.body;

  try {
    // Check if a Level3 entry with the same processName and processNumber exists for the user
    const existingLevel3 = await Level3.findOne({ userId, processName, processNumber });

    if (existingLevel3) {
      // If found, update the existing Level3 entry
      existingLevel3.level3CycleTime = level3CycleTime;
      existingLevel3.level3Memory = level3Memory;
      await existingLevel3.save();

      return res.status(200).json({ message: 'Level3 data updated successfully', data: existingLevel3 });
    }

    // If no matching Level3 entry is found, check the total count for this user
    const level3Count = await Level3.countDocuments({ userId });
    if (level3Count >= 5) {
      return res.status(400).json({ message: 'User has reached the maximum limit of 5 Level3 entries.' });
    }

    // Create a new Level3 entry if the limit has not been reached
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
    const level3 = await Level3.find({userId: id});
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
        const supervisor = await AdminUser.findById(supervisorId);
        
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
