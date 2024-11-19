const {MongoClient} = require('mongodb');

const url =
  'mongodb+srv://darkparadise877:PeU0jo3RX1ips4Sv@cluster0.h2nml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

module.exports = {connectToMongoDB, client};
