"use strict";

var express = require("express");
var path = require("path");
var app = express();
var port = 3000;
app.use(express["static"](path.join(__dirname, '../frontend/public')));
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend/public', 'index.html'));
});
app.listen(port, function () {
  console.log("Listening on localhost:3000");
});