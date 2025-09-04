"use strict";

var express = require("express");
var path = require("path");
var app = express();
var port = 3000;
app.use(express.json());
app.use(express["static"](path.join(__dirname, '../frontend/public')));
app.post("/api/signin", function (req, res) {
  res.json({
    success: true,
    user: {
      username: req.body.username || "demoUser"
    }
  });
});
app.post("/api/signup", function (req, res) {
  res.json({
    success: true,
    user: {
      username: req.body.username || "newUser"
    }
  });
});
app.get(/.*/, function (req, res) {
  res.sendFile(path.resolve(__dirname, "../frontend/public/index.html"));
});
app.listen(port, function () {
  console.log("Listening on localhost:3000");
});