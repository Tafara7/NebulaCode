const express = require('express');
const router = express.Router();
const { connectDB, ObjectId } = require('./db');

router.get('/project/:projectId', async (req, res) => {
  const db = await connectDB();
  if (req.params.projectId === "all") {

    const checkins = await db.collection('checkins').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: "$project", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          message: 1,
          createdAt: 1,
          userId: 1,
          projectId: 1,
          username: "$user.username",
          projectName: "$project.name"
        }
      }
    ]).toArray();
    res.json(checkins);
  } else {
    try {
      const checkins = await db.collection('checkins').find({ projectId: new ObjectId(req.params.projectId) }).toArray();
      res.json(checkins);
    } catch (err) {
      res.status(400).json({ error: "Invalid projectId" });
    }
  }
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