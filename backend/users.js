const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { connectDB, ObjectId } = require('./db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) }, { projection: { password: 0 } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const { username, email, password, bio, location, joined } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({
    username, email, password: hashedPassword, bio, location, joined, friends: []
  });

  const user = await db.collection('users').findOne({ _id: result.insertedId }, { projection: { password: 0 } });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const db = await connectDB();
  const update = { ...req.body };
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const db = await connectDB();
  await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

module.exports = router;