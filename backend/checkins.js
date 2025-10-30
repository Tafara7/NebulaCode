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

    const normalized = checkins.map(c => ({
      ...c,
      _id: c._id ? c._id.toString() : null,
      userId: c.userId ? (c.userId.toString ? c.userId.toString() : String(c.userId)) : null,
      projectId: c.projectId ? (c.projectId.toString ? c.projectId.toString() : String(c.projectId)) : null
    }));

    res.json(normalized);
  } else {
    try {
      const raw = await db.collection('checkins').find({ projectId: new ObjectId(req.params.projectId) }).toArray();
      const normalized = raw.map(c => ({
        ...c,
        _id: c._id ? c._id.toString() : null,
        userId: c.userId ? (c.userId.toString ? c.userId.toString() : String(c.userId)) : null,
        projectId: c.projectId ? (c.projectId.toString ? c.projectId.toString() : String(c.projectId)) : null
      }));
      res.json(normalized);
    } catch (err) {
      res.status(400).json({ error: "Invalid projectId" });
    }
  }
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const { projectId, userId, message, createdAt } = req.body;
  const result = await db.collection('checkins').insertOne({ projectId: new ObjectId(projectId), userId: new ObjectId(userId), message, createdAt });
  const inserted = await db.collection('checkins').findOne({ _id: result.insertedId });
  res.json({
    ...inserted,
    _id: inserted._id.toString(),
    projectId: inserted.projectId.toString(),
    userId: inserted.userId.toString()
  });
});

router.delete('/:id', async (req, res) => {
  const db = await connectDB();
  await db.collection('checkins').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

router.get('/search', async (req, res) => {
  const db = await connectDB();
  const { query } = req.query;
  const checkins = await db.collection('checkins').aggregate([
    {
      $match: {
        $or: [
          { message: { $regex: query, $options: 'i' } }
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
    },
    {
      $project: {
        _id: 1,
        message: 1,
        createdAt: 1,
        userId: 1,
        username: "$user.username"
      }
    }
  ]).toArray();

  const normalized = checkins.map(c => ({
    ...c,
    _id: c._id ? c._id.toString() : null,
    userId: c.userId ? (c.userId.toString ? c.userId.toString() : String(c.userId)) : null
  }));

  res.json(normalized);
});

module.exports = router;