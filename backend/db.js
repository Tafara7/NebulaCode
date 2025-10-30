const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://test-user:test-password@cluster0.7wbwi.mongodb.net/nebula_code?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('nebula_code');
  }
  return db;
}

module.exports = { connectDB, ObjectId };