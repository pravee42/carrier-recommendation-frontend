const {client} = require('../config/client');

exports.addOrReplaceOperatorObservation = async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('operatorObservations');

    const userId = req.body.userId || req.params.userId;

    const updatedDocument = await collection.updateOne(
      {_id: userId},
      {$set: {...req.body, assigineId: req?.user?.id}},
      {upsert: true},
    );

    return res.status(200).json({
      message: 'Document added/replaced successfully',
      updatedDocument,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while adding/replacing the document',
      error,
    });
  }
};

exports.getOperatorObservationByUserId = async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('operatorObservations');

    // Get userId from req.body or req.params
    const userId = req.body.userId || req.params.userId;

    // Find the document by _id (userId)
    const document = await collection.findOne({ _id: userId });

    if (document) {
      return res.status(200).json({ message: 'Document retrieved successfully', data: document });
    } else {
      return res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while retrieving the document',
      error,
    });
  }
};


// Delete Document Controller

exports.deleteOperatorObservation = async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('operatorObservations');

    // Assuming `userId` is coming from req.body or req.params
    const userId = req.body.userId || req.params.userId;

    // Delete the document based on the _id field
    const result = await collection.deleteOne({_id: userId});

    if (result.deletedCount === 1) {
      return res.status(200).json({message: 'Document deleted successfully'});
    } else {
      return res.status(404).json({message: 'Document not found'});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while deleting the document',
      error,
    });
  }
};
