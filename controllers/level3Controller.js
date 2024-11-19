const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const {sendMailToSuperVisor} = require('../utils/mail');
const {client} = require('../config/client');
const {ObjectId} = require('mongodb');
const { request } = require('express');

exports.addLevel3 = async (req, res) => {
  const supervisor = req?.user?.id;
  const {userId} = req.body;

  try {
    const db = client.db('test');
    const collection = db.collection('level3');

    // Use updateOne with upsert: true to update if exists or insert if not
    const result = await collection.updateOne(
      {userId},
      {
        $set: {...req.body, supervisor},
      },
      {upsert: true},
    );

    const message = result.upsertedCount
      ? 'Level3 data added successfully'
      : 'Level3 data updated successfully';

    res.status(200).json({message});
  } catch (error) {
    res.status(500).json({
      message: 'Error adding/updating Level3 data',
      error: error.message,
    });
  }
};

exports.getLevel3 = async (req, res) => {
  const {id} = req.params;

  try {
    const db = client.db('test');
    const collection = db.collection('level3');

    const level3 = await collection.find({userId: id}).toArray();
    if (!level3 || level3.length === 0) {
      return res.status(404).json({message: 'Level3 data not found'});
    }
    res.status(200).json({data: level3});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving Level3 data', error: error.message});
  }
};

exports.updateLevel3 = async (req, res) => {
  const {id} = req.params;

  try {
    const db = client.db('test');
    const collection = db.collection('level3');

    const updatedLevel3 = await collection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: {...request.body}},
      {returnDocument: 'after'},
    );

    if (!updatedLevel3.value) {
      return res.status(404).json({message: 'Level3 data not found'});
    }
    res.status(200).json({
      message: 'Level3 data updated successfully',
      data: updatedLevel3.value,
    });
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating Level3 data', error: error.message});
  }
};

exports.bulkUpdateSupervisors = async (req, res) => {
  const {users} = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res
      .status(400)
      .json({message: 'Invalid data format or empty user list.'});
  }

  try {
    const updatePromises = users.map(
      async ({userId, NameOfSupervisor, supervisorId}) => {
        const user = await User.findById(userId);

        if (user) {
          user.NameOfSupervisor = NameOfSupervisor;
          user.supervisorId = supervisorId;

          await user.save();

          // Fetch supervisor email
          const supervisor = await AdminUser.findById(supervisorId);

          if (supervisor && supervisor.email) {
            // Send email to the supervisor
            await sendMailToSuperVisor(
              supervisor.email,
              userId,
              supervisorId,
              user.traineeName,
            );
          }
        }
      },
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Bulk update successful and emails sent to supervisors.',
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({message: 'Bulk update failed', error: error.message});
  }
};
