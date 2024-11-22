const { client } = require("../config/client");

async function addThemeData(req, res) {
    const db = client.db('test');
    const collection = db.collection('dashboardTheme');
  
    const result = await collection.findOneAndUpdate(
      {$set: {...req.body}}, 
      {upsert: true, returnDocument: 'after'}, 
    );
  
    return res.status(200).send({message:"Success"});
}

async function getThemeData(req, res) {
    const db = client.db('test');
    const collection = db.collection('dashboardTheme');
  
    const entries = await collection.find();

    return res.status(200).send({message:"Success", data: entries});
  
}


module.exports = {
addThemeData,
  getThemeData,
};
