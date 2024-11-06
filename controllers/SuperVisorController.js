const SuperVisor = require('../models/Supervisor');

exports.createSupervisor = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const newSupervisor = new SuperVisor({ name, email, phone });
    await newSupervisor.save();

    res.status(201).json({ message: 'Supervisor created successfully', data: newSupervisor });
  } catch (error) {
    res.status(500).json({ message: 'Error creating supervisor', error: error.message });
  }
};

exports.getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await SuperVisor.find();
    res.status(200).json({ data: supervisors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supervisors', error: error.message });
  }
};

exports.getSupervisorById = async (req, res) => {
  try {
    const { id } = req.params;
    const supervisor = await SuperVisor.findById(id);

    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.status(200).json({ data: supervisor });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supervisor', error: error.message });
  }
};

exports.updateSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const updatedSupervisor = await SuperVisor.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );

    if (!updatedSupervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.status(200).json({ message: 'Supervisor updated successfully', data: updatedSupervisor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supervisor', error: error.message });
  }
};

exports.deleteSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSupervisor = await SuperVisor.findByIdAndDelete(id);

    if (!deletedSupervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.status(200).json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supervisor', error: error.message });
  }
};
