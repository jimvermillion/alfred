const express = require('express');
const jsonParser = require('body-parser').json();

// Config Model
const Config = require(__dirname + '/../models/config');
const UserFile = require(__dirname + '/../models/userFile');

// Major A
const majorA = require('major-a');
const mAuth = majorA.majorAuth;

// Dashboard Router
module.exports = exports = function(io) {

  // Mirror Module Socket
  const moduleSocket = require(__dirname + '/../lib/module-socket')(io);
  // Socket Connection
  io.on('connection', moduleSocket);

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
        var newUser = new UserFile();
        newUser.owner_id = req.user._id;
        // Save Config
        newUser.save((savedUserFileError, savedUserFile) => {
          // Check Error
          if (savedUserFileError) {
            return res.status(500).json({
              msg: 'There was an error'
            });
          }
          // Initialize New User -- SEE /models/userFile.js
          savedUserFile.initialize()
            .then(function(newConfig) {
              // Return New Config File
              return res.status(200).json([newConfig]);
            }, function(err) {
              return console.log('Promise reject');
            });
        });
        // Config Files Exist
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
        updatedConfig.user = req.user;
        io.to(req.user._id).emit('UPDATED_CONFIG', updatedConfig);

        // Send response
        res.status(200).json(updateData);
      })
    });

  dashboardRouter
    .delete('/preferences/:id', mAuth(), jsonParser, (req, res) => {
      var userID;
      Config.find({
        _id: req.params.id
      }, (err, prefToDelete) => {
        if (err) return console.log(err);
        userID = prefToDelete.owner_id;
        // Delete Prefenece Config
        Config.remove({
          _id: req.params.id
        }, (err, data) => {
          // Check error
          if (err) return console.log(err);
          // Check if user has any other other prefs...if not we'll need to 
          Config.find({
            owner_id: userID
          }, (err, data) => {
            //another err check
            if (err) return console.log(err);
            // if there isn't any other prefs, make one
            if (!data.length) {
              //new config
              var config = new Config;
              config.owner_id = userID;
              //save config in db
              config.save((err, savedData) => {
                // Check error
                if (err) {
                  return res.status(500).json({
                    msg: 'There was an error saving'
                  });
                }
                res.status(200).json({
                  msg: 'successfully deleted config'
                });
              });
            } else {
              res.status(200).json({
                msg: 'successfully deleted config'
              });
            }
          });
        });
      });
    });
  return dashboardRouter;
}