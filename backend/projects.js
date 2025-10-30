const express = require('express');
const router = express.Router();
const { connectDB, ObjectId } = require('./db');

function normalizeProject(p) {
  if (!p) return null;
  return {
    ...p,
    _id: p._id ? p._id.toString() : null,
    ownerId: p.ownerId ? (p.ownerId.toString ? p.ownerId.toString() : String(p.ownerId)) : null,
    memberIds: Array.isArray(p.memberIds) ? p.memberIds.map(id => (id && id.toString ? id.toString() : String(id))) : [],
    files: Array.isArray(p.files)
      ? p.files.map(f => ({
          ...f,
          uploadedBy: f.uploadedBy ? (f.uploadedBy.toString ? f.uploadedBy.toString() : String(f.uploadedBy)) : null,
          versions: Array.isArray(f.versions)
            ? f.versions.map(v => ({
                ...v,
                uploadedBy: v.uploadedBy ? (v.uploadedBy.toString ? v.uploadedBy.toString() : String(v.uploadedBy)) : null
              }))
            : []
        }))
      : [],
    checkedOutBy: p.checkedOutBy ? (p.checkedOutBy.toString ? p.checkedOutBy.toString() : String(p.checkedOutBy)) : null
  };
}

router.get('/', async (req, res) => {
  const db = await connectDB();
  const { search } = req.query;
  let projects;
  if (search) {
    projects = await db.collection('projects').find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }).toArray();
  } else {
    projects = await db.collection('projects').find().toArray();
  }
  res.json(projects.map(normalizeProject));
});

router.get('/:id', async (req, res) => {
  const db = await connectDB();
  try {
    const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(normalizeProject(project));
  } catch (err) {
    res.status(400).json({ error: "Invalid projectId" });
  }
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const { name, description, ownerId, memberIds = [], tags = [], createdAt, image, files = [] } = req.body;
  const doc = {
    name,
    description,
    ownerId: new ObjectId(ownerId),
    memberIds: (memberIds || []).map(id => new ObjectId(id)),
    tags: tags || [],
    createdAt: createdAt || new Date().toISOString(),
    image: image || null,
    files: (files || []).map(f => ({
      filename: f.filename,
      content: f.content || '',
      uploadedBy: f.uploadedBy ? new ObjectId(f.uploadedBy) : new ObjectId(ownerId),
      createdAt: f.createdAt || new Date().toISOString(),
      versions: f.versions && Array.isArray(f.versions) ? f.versions : []
    })),
    checkedOutBy: null
  };
  const result = await db.collection('projects').insertOne(doc);
  const created = await db.collection('projects').findOne({ _id: result.insertedId });
  res.json(normalizeProject(created));
});

router.put('/:id', async (req, res) => {
  const db = await connectDB();
  const update = { ...req.body };
  delete update._id;
  if (update.ownerId) update.ownerId = new ObjectId(update.ownerId);
  if (Array.isArray(update.memberIds)) update.memberIds = update.memberIds.map(id => new ObjectId(id));
  await db.collection('projects').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
  const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
  res.json(normalizeProject(project));
});

router.delete('/:id', async (req, res) => {
  const db = await connectDB();
  await db.collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

router.post('/:id/files', async (req, res) => {
  const db = await connectDB();
  const { filename, content = '', uploadedBy, message = '' } = req.body;
  if (!filename) return res.status(400).json({ error: "filename required" });
  const file = {
    filename,
    content,
    uploadedBy: uploadedBy ? new ObjectId(uploadedBy) : null,
    createdAt: new Date().toISOString(),
    versions: [{
      content,
      uploadedBy: uploadedBy ? new ObjectId(uploadedBy) : null,
      createdAt: new Date().toISOString(),
      message
    }]
  };
  await db.collection('projects').updateOne({ _id: new ObjectId(req.params.id) }, { $push: { files: file } });
  const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
  res.json(normalizeProject(project));
});


router.put('/:id/image', async (req, res) => {
  const db = await connectDB();
  const { image } = req.body; 
  await db.collection('projects').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { image: image || null } });
  const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
  res.json(normalizeProject(project));
});

module.exports = router;