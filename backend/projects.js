const express = require('express');
const router = express.Router();
const { connectDB, ObjectId } = require('./db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const projects = await db.collection('projects').find().toArray();
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const db = await connectDB();
  const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const { name, description, ownerId, memberIds, tags, createdAt } = req.body;
  const result = await db.collection('projects').insertOne({ name, description, ownerId: new ObjectId(ownerId), memberIds: memberIds.map(id => new ObjectId(id)), tags, createdAt });
  res.json(result.ops ? result.ops[0] : result);
});

router.put('/:id', async (req, res) => {
  const db = await connectDB();
  const update = req.body;
  await db.collection('projects').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const db = await connectDB();
  await db.collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

module.exports = router;