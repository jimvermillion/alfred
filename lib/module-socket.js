const Config = require(__dirname + '/../models/config');
const UserFile = require(__dirname + '/../models/userFile');

module.exports = function(io) {
  return function(socket) {
    // Join Room
    socket.on('JOIN_ROOM', function(user_id) {
      // Join room
      socket.join(user_id);
      // For Testing
      socket.emit('ROOM_JOINED', user_id);

      // Find user config
      UserFile.findOne({
        owner_id: user_id
      }, (userFileErr, foundUserFile) => {
        // Error
        if (userFileErr) return console.log('There was an erorr, config');
        // Attach config file to user document
        foundUserFile.populateConfig()
          .then(function(res) {
            // Emit
            io.to(user_id).emit('UPDATED_CONFIG', res);
          });
      });
    });
    return socket;
  }
}