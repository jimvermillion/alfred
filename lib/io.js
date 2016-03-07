const io = require('socket.io')();

io.on('connection', function(socket) {
	console.log('Client CONNECTED');
});

module.exports = io;