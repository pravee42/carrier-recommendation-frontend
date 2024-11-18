const mongoose = require('mongoose');
const operatorObservation = require('../models/level3B');

exports.addOrReplaceOperatorObservation = async (req, res) => {
  try {
    const { userId, lineName, department, stationNo, checkPoints, totalPoints, assignieId, day } = req.body;

    // Check how many documents the user has already added
    const existingDocuments = await operatorObservation.find({ userId });

    // If there are 3 documents already, replace the most recent one
    if (existingDocuments.length >= 3) {
      // Sort by date in descending order to find the most recent one
      const mostRecentDocument = existingDocuments.sort((a, b) => b.date - a.date)[0];

      // Replace the most recent document
      const updatedDocument = await operatorObservation.findByIdAndUpdate(
        mostRecentDocument._id, 
        { 
          userId, 
          lineName, 
          department, 
          stationNo, 
          checkPoints, 
          totalPoints, 
          assignieId,
          day
        }, 
        { new: true } 
      );

      return res.status(200).json({ message: 'Document replaced successfully', updatedDocument });
    } else {
      // If there are less than 3 documents, add a new one
      const newObservation = new operatorObservation({
        userId,
        lineName,
        department,
        stationNo,
        checkPoints,
        totalPoints,
        assignieId
      });

      const savedDocument = await newObservation.save();
      return res.status(201).json({ message: 'Document added successfully', savedDocument });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while adding/replacing the document', error });
  }
};

// Delete Document Controller
exports.deleteOperatorObservation = async (req, res) => {
  try {
    const { observationId } = req.params;

    // Find and delete the document by its ID
    const deletedDocument = await operatorObservation.findByIdAndDelete(observationId);

    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the document', error });
  }
};
