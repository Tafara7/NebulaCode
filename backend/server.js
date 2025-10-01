const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { connectDB } = require("./db");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

const userRoutes = require('./users');
const projectRoutes = require('./projects');
const checkinRoutes = require('./checkins');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/checkins', checkinRoutes);


app.post("/api/signin", async (req, res) => {
  const db = await connectDB();
  const { email, password } = req.body;
  const user = await db.collection('users').findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: "Incorrect password" });

  const { password: pw, ...userNoPw } = user;
  res.json({ success: true, user: userNoPw });
});

app.post("/api/signup", async (req, res) => {
  res.status(404).json({ error: "Use /api/users for signup" });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/public/index.html"));
});

app.listen(port, () => {
  console.log("Listening on localhost:3000");
});