const {client} = require('../config/client');
const {ObjectId} = require('mongodb');

async function addMonitoringEffectiveness(data, supervisor) {
  const db = client.db('test');
  const collection = db.collection('monitoringEffectiveness');

  const result = await collection.findOneAndUpdate(
    {userId: data.userId}, // Query to match documents with the same userId
    {$set: {...data, supervisor}}, // Update operation to set new data
    {upsert: true, returnDocument: 'after'}, // Options: upsert and return updated document
  );

  return result.value;
}

async function getMonitoringEffectiveness(userId) {
  const db = client.db('test');
  const collection = db.collection('monitoringEffectiveness');

  const entries = await collection.find({userId});

  return entries;
}

async function updateMonitoringEffectiveness(id, updateData) {
  const db = client.db('test');
  const collection = db.collection('monitoringEffectiveness');

  // Update the document by its ID
  const result = await collection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updateData},
    {returnDocument: 'after'},
  );

  return result.value; // Return the updated document
}

async function deleteMonitoringEffectiveness(id) {
  const db = client.db('test');
  const collection = db.collection('monitoringEffectiveness');

  // Delete the document by its ID
  await collection.deleteOne({_id: new ObjectId(id)});

  return {message: 'Entry deleted successfully'};
}

module.exports = {
  addMonitoringEffectiveness,
  getMonitoringEffectiveness,
  updateMonitoringEffectiveness,
  deleteMonitoringEffectiveness,
};
