const bcryptjs = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

exports.createSupervisor = async (req, res) => {
  try {
    const { name, email, phone, password, username } = req.body;
    
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new AdminUser({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      role: 'supervisor',
    });

    await newUser.save();

    res.status(201).json({ message: 'Supervisor created successfully', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating supervisor', error: error.message });
  }
};


exports.getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await AdminUser.find({role: 'supervisor'});
    res.status(200).json({ data: supervisors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supervisors', error: error.message });
  }
};

exports.getSupervisorById = async (req, res) => {
  try {
    const { id } = req.params;
    const supervisor = await AdminUser.findById(id);

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
    const { name, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedSupervisor = await AdminUser.findByIdAndUpdate(
      id,
      { name, email, phone, hashedPassword },
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
    const deletedSupervisor = await AdminUser.findByIdAndDelete(id);

    if (!deletedSupervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.status(200).json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supervisor', error: error.message });
  }
};

