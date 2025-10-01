const express = require('express');
const router = express.Router();
const { connectDB, ObjectId } = require('./db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const users = await db.collection('users').find().toArray();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const { username, email, bio, location, joined } = req.body;
  const result = await db.collection('users').insertOne({ username, email, bio, location, joined, friends: [] });
  res.json(result.ops ? result.ops[0] : result);
});

router.put('/:id', async (req, res) => {
  const db = await connectDB();
  const update = req.body;
  await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const db = await connectDB();
  await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

module.exports = router;