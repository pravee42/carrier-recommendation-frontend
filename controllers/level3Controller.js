const Level3 = require('../models/level3');

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


