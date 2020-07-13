// sockcet.io sample code

const socketIO = require('socket.io');
const io = socketIO.listen(3000);

// event that clietns connect
io.sockets.on('connection', function(socket) {
  console.log("connection");

  // event when recieving messages
  socket.on('message', function(data) {
    console.log("message");
    io.sockets.emit('message', data);
  });

  // event that clients disconnect
  socket.on('disconnect', function(){
    console.log("disconnect");
  });
});
