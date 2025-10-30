const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connectDB, ObjectId } = require("./db");

function normalizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return {
    ...rest,
    _id: u._id ? u._id.toString() : null,
    friends: Array.isArray(u.friends) ? u.friends.map(id => id ? id.toString() : id) : [],
    savedProjects: Array.isArray(u.savedProjects) ? u.savedProjects.map(id => id ? id.toString() : id) : [],
  };
}

router.get("/", async (req, res) => {
  const db = await connectDB();
  const users = await db.collection("users").find().toArray();
  const safe = users.map(normalizeUser);
  res.json(safe);
});

router.get("/:id", async (req, res) => {
  const db = await connectDB();
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

router.post("/", async (req, res) => {
  const db = await connectDB();
  const { username, email, password, bio = "", role = "user" } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "username, email and password required" });
  const existing = await db.collection("users").findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(400).json({ error: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const doc = {
    username,
    email,
    password: hashed,
    bio,
    friends: [],
    savedProjects: [],
    createdAt: new Date().toISOString(),
    role: role || "user",
    profileImage: null,
  };
  const r = await db.collection("users").insertOne(doc);
  const created = await db.collection("users").findOne({ _id: r.insertedId });
  res.json(normalizeUser(created));
});

router.put("/:id", async (req, res) => {
  const db = await connectDB();
  const update = { ...req.body };
  try {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    if (Array.isArray(update.friends)) {
      update.friends = update.friends.map(id => id);
    }
    if (Array.isArray(update.savedProjects)) {
      update.savedProjects = update.savedProjects.map(id => id);
    }
    delete update._id;
    await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, { $set: update }, { upsert: false });
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/:id", async (req, res) => {
  const db = await connectDB();
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

module.exports = router;