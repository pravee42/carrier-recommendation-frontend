const Settings = require('../models/Settings');

// Create or Update Settings
exports.createOrUpdateSettings = async (req, res) => {
  const { workingLineOptions, designationGrade, level3ProcessNames, shopGuru, TeamLeader, SectionHead, trainerEmail } = req.body;

  try {
    // Look for an existing settings document (assuming only one settings document should exist)
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings
      settings.workingLineOptions = workingLineOptions || settings.workingLineOptions;
      settings.designationGrade = designationGrade || settings.designationGrade;
      settings.level3ProcessNames = level3ProcessNames || settings.level3ProcessNames;
      settings.shopGuru = shopGuru || settings.shopGuru;
      settings.TeamLeader = TeamLeader || settings.TeamLeader;
      settings.SectionHead = SectionHead || settings.SectionHead;
      settings.trainerEmail = trainerEmail || settings.trainerEmail

      await settings.save();
      res.status(200).json({ message: 'Settings updated successfully', data: settings });
    } else {
      // Create new settings
      settings = new Settings({
        workingLineOptions,
        designationGrade,
        level3ProcessNames,
        shopGuru,
        TeamLeader,
        trainerEmail,
        SectionHead,
      });

      await settings.save();
      res.status(201).json({ message: 'Settings created successfully', data: settings });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating or updating settings', error: error.message });
  }
};

// Get Settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json({ data: settings });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
};

// Delete Settings
exports.deleteSettings = async (req, res) => {
  try {
    const result = await Settings.deleteOne();
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json({ message: 'Settings deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting settings', error: error.message });
  }
};
