const express = require('express');
const jsonParser = require('body-parser').json();

// UserFile
const UserFile = require(__dirname + '/../models/userFile');

// Major A
const majorA = require('major-a');
const mAuth = majorA.majorAuth;

module.exports = exports = function(io) {
  const userRouter = express.Router();

  // Update User Profile
  userRouter.put('/update/:id', mAuth(), jsonParser, (req, res) => {
    console.log('hit');
    // Find File
    UserFile.update({
      owner_id: req.params.id
    }, req.body, (err, foundUserFile) => {
      // Check error
      if (err || !foundUserFile) {
        return res.status(500).json({
          msg: 'User Not Found.'
        });
      }

      // Populate default config
      foundUserFile.populateConfig()
        .then(function(newData) {
          // Push new file to display
          io.to(req.user._id).emit('UPDATED_CONFIG', newData);
        });

      // Send back new file
      res.status(200).json(foundUserFile);
    });
  });

  // Return router
  return userRouter;
};
