const express = require('express');
const mongoose = require('mongoose');
const db = require(__dirname + '/lib/db');

// CONST
const PORT = process.env.PORT || 8080;
const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);

// Connect to Mongo Instance
mongoose.connect(process.env.MONGO_URI || db.url);

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authentication, authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// MajorA
const majorA = require('major-a');
const majorRouter = majorA.majorRouter;
app.use('/auth', majorRouter);

// Dashboard Router
const dashboardRouter = require(__dirname + '/routes/dashboard_router')(io);
app.use('/dashboard', dashboardRouter);

// User Router
const userRouter = require(__dirname + '/routes/user_router')(io);
app.use('/user', userRouter);


// Widget Router
const widgetRouter = require(__dirname + '/routes/widget_router');
app.use('/widget', widgetRouter);

// Listen
http.listen(PORT, () => {
  console.log('Server live on port ', PORT);
});

module.exports = exports = io;
