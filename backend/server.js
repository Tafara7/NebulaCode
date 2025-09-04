const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.post("/api/signin", (req, res) => {
  res.json({ success: true, user: { username: req.body.username || "demoUser" } });
});

app.post("/api/signup", (req, res) => {
  res.json({ success: true, user: { username: req.body.username || "newUser" } });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/public/index.html"));
});

app.listen(port, () => {
  console.log("Listening on localhost:3000");
});