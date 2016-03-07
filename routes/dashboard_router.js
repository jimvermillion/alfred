const express = require('express');
const jsonParser = require('body-parser').json();

// Config Model
const Config = require(__dirname + '/../models/config');




// Major A
const majorA = require('major-a');
const mAuth = majorA.majorAuth;

// Dashboard Router
module.exports = exports = function(io) {

  // Connection
  io.on('connection', function(socket) {
    // Join Room
    socket.on('JOIN_ROOM', function(user_id) {
      socket.join(user_id);
      // Find user config
      Config.findOne({
        owner_id: user_id
      }, (err, data) => {
        if (err) return console.log('There was an erorr');
        // Load user config
        io.to(user_id).emit('UPDATED_CONFIG', data);
      });
    });
  });

  // Router
  var dashboardRouter = express.Router();

  // Create new config
  dashboardRouter.post('/preferences', mAuth(), jsonParser, (req, res) => {
    // Save params from request body
    try {
      var config = new Config;
      config.name = req.body.name || null;
      config.owner_id = req.user._id;
      config.location = req.body.location;
      config.modules = req.body.modules || [];
    } catch (e) {
      return res.status(500).json({
        msg: 'There was an item missing'
      });
    }
    // Save document into DB
    config.save((err, savedData) => {
      // Check error
      if (err) {
        return res.status(500).json({
          msg: 'There was an error saving'
        });
      }
      // Return data
      res.status(200).json(savedData);
    });
  });

  // Get user preferences
  dashboardRouter.get('/preferences', mAuth(), (req, res) => {
    // Check db for preferences
    Config.find({
      owner_id: req.user._id
    }, (err, data) => {
      // Check error
      if (err) {
        return res.status(500).json({
          msg: 'There was an error'
        });
      }
      // No config, create new config
      if (!data.length) {
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

  // Update Config
  dashboardRouter
    .put('/preferences/:id', mAuth(), jsonParser, (req, res) => {
      // Update Prefenece Config
      var updatedConfig = req.body;
      // Remove Id as to not confuse mongo
      delete updatedConfig._id;
      // Update config doc
      Config.update({
        _id: req.params.id
      }, updatedConfig, (updateErr, updateData) => {
        // Check error
        if (updateErr) {
          return res.status(500).json({
            msg: 'There was an error'
          });
        }

        // Emit event
        io.to(req.user._id).emit('UPDATED_CONFIG', updatedConfig);

        // Send response
        res.status(200).json(updateData);
      })
    });

  // Delete Config
  dashboardRouter.delete('/preferences/:id', (req, res) => {
    // Delete Prefenece Config
    Config.remove({
      _id: req.config.id
    }, (err, data) => {
      if (err) return console.log(err);
      if (!data) {
        var data = new Config;
        data.owner_id = req.user.id;
        res.status(200).json({
          msg: 'successfully deleted config'
        });
      }
    });
  });

  // Return Router
  return dashboardRouter;
}