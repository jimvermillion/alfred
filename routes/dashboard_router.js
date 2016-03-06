const express = require('express');

const Config = require(__dirname + '/../models/config');
var dashboardRouter = module.exports = exports = express.Router();

dashboardRouter.get('/preferences', (req, res) => {
  Config.findOne({ owner_id: req.user.id }, (err, data) => {
    if (err) return console.log(err);
    if (!data) {
      var data = new Config;
      data.owner_id = req.user.id;
    }
    res.json(data);
  });
});
