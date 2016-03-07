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
const majorAuth = majorA.majorAuth;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authentication, authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Auth Router
app.use('/auth', majorRouter);

// Dashboard Router
const dashboardRouter = require(__dirname + '/routes/dashboard_router');
app.use('/dashboard', dashboardRouter);

// Listen
app.listen(PORT, () => {
	console.log('Server live on port ', PORT);
});
