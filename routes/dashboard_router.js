const express = require('express');

// Config Model
const Config = require(__dirname + '/../models/config');

// Major A
const majorA = require('major-a');
const mAuth = majorA.majorAuth;

// Dashboard Router
var dashboardRouter = module.exports = exports = express.Router();
// Get user preferences
dashboardRouter.get('/preferences', mAuth(), (req, res) => {
  // Check db for preferences
  Config.findOne({
    owner_id: req.user._id
  }, (err, data) => {
    // Check error
    if (err) {
      return res.status(500).json({
        msg: 'There was an error'
      });
    }
    // No config, create new config
    if (!data) {
      var newConfig = new Config;
      newConfig.owner_id = req.user._id;
      // Save Config
      newConfig.save((savedConfigError, savedConfig) => {
        // Check Error
        if (savedConfigError) {
          return res.status(500).json({
            msg: 'There was an error'
          });
        }
        // Return new Config File
        return res.status(200).json(savedConfig);
      })
    } else {
      // Send back config file
      res.status(200).json(data);
    }
  });
});