const socketIO = require('socket.io');
const io = socketIO.listen(3000);
let roomId = '';
let roomIdHolder = {};
let players = [];
let isExistWaitingPlayer = false;

// event that clietns connect
io.sockets.on('connection', function(socket) {
  console.log('connection');

  socket.on('login', function(id) {
    if(isExistWaitingPlayer === true) {
      socket.join(roomId);

      players.push(id);
      roomIdHolder[id] = roomId;

      const color = divideTurn(players);
      const data = { color: color, roomId: roomId };
      io.to(roomId).emit('message', data);

      players = [];
      isExistWaitingPlayer = false;
    } else {
      roomId = String(getRoomId());
      socket.join(roomId);

      players.push(id);
      roomIdHolder[id] = roomId;
      isExistWaitingPlayer = true;
    }
  });

  socket.on('enter', function(roomId) {
    socket.join(roomId);
  });

  // event when recieving messages
  socket.on('message', function(msg) {
    console.log('message');

    const data = JSON.parse(msg);
    io.to(roomIdHolder[data.id]).emit('message', msg);
  });

  // event that clients disconnect
  socket.on('disconnect', function(){
    console.log('disconnect');
  });
});

function divideTurn(players) {
  const result = {};
  const player1 = players[0];
  const player2 = players[1];
  const rand = getRandom(0, 1);
  if(rand === 0) {
    result[player1] = 'black';
    result[player2] = 'white';
  } else {
    result[player1] = 'white';
    result[player2] = 'black';
  }

  return result;
}

function getRoomId(){
  return getRandom(10000, 99999);
}

function getRandom(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

