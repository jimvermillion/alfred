const express = require('express');

const Config = require(__dirname + '/../models/config');
var dashboardRouter = module.exports = exports = express.Router();

dashboardRouter.get('/preferences/:id', (req, res) => {
  Config.findOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.log(err);

    res.json(data);
  });
});
