const Config = require(__dirname + '/../models/config');

module.exports = function(io) {
  return function(socket) {
    // Join Room
    socket.on('JOIN_ROOM', function(user_id) {
      socket.join(user_id);
      // Find user config
      Config.findOne({
        owner_id: user_id
      }, (err, data) => {
        // Error
        if (err) return console.log('There was an erorr');
        // Emit
        io.to(user_id).emit('UPDATED_CONFIG', data);
      });
    });
  }
}