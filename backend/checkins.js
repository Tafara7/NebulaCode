const express = require('express');
const router = express.Router();
const { connectDB, ObjectId } = require('./db');

router.get('/project/:projectId', async (req, res) => {
  const db = await connectDB();
  const checkins = await db.collection('checkins').find({ projectId: new ObjectId(req.params.projectId) }).toArray();
  res.json(checkins);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const { projectId, userId, message, createdAt } = req.body;
  const result = await db.collection('checkins').insertOne({ projectId: new ObjectId(projectId), userId: new ObjectId(userId), message, createdAt });
  res.json(result.ops ? result.ops[0] : result);
});

router.delete('/:id', async (req, res) => {
  const db = await connectDB();
  await db.collection('checkins').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

module.exports = router;