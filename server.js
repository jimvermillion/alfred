const express = require('express');
const mongoose = require('mongoose');
const db = require(__dirname + '/lib/db');

const PORT = process.env.PORT || 8080
const app = express();

// Connect to Mongo Instance
mongoose.connect(db.url);

// MajorA
const majorA = require('major-a');
const majorRouter = majorA.majorRouter;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authentication, authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


// Auth Router
app.use('/auth', majorRouter);

// Listen
app.listen(PORT, () => {
	console.log('Server live on port ', PORT);
});