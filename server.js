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


// Auth Router
app.use('/auth', majorRouter);

// Listen
app.listen(PORT, () => {
	console.log('Server live on port ', PORT);
});