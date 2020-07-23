const socketIO = require('socket.io');
const io = socketIO.listen(3000);

const players = {};

// event that clietns connect
io.sockets.on('connection', function(socket) {
  console.log('connection');

  socket.on('entry', function(playerId) {
    players[playerId] = {
      roomId: '',
      state: 'waiting',
    };

    const waiting = [];
    for (const id of Object.keys(players)) {
      const p = players[id];
      if (p.state === 'waiting') {
        waiting.push({
          playerId: id,
          roomId: p.roomId
        });
      }
    }

    if (waiting.length < 2) {
      const roomId = String(getRoomId());
      players[playerId].roomId = roomId;
      socket.join(roomId);

      return;
    }

    const opponentId = waiting[0].playerId;

    const roomId = waiting[0].roomId;
    players[playerId].roomId = roomId;
    socket.join(roomId);

    const colors = divideColor([playerId, opponentId]);

    const data = { color: colors, roomId: roomId };
    io.to(roomId).emit('roomIdFromServer', data);

    players[playerId].state = 'playing';
    players[opponentId].state = 'playing';
  });

  socket.on('enter', function(roomId) {
    socket.join(roomId);
  });

  socket.on('exit', function(playerId) {
    const roomId = players[playerId]['roomId'];
    socket.leave(roomId);
    delete players[playerId];
  });

  // event when recieving messages
  socket.on('message', function(msg) {
    const data = JSON.parse(msg);
    const roomId = players[data.id]['roomId'];
    io.to(roomId).emit('message', msg);
  });

  socket.on('surrender', function(playerId) {
    const roomId = players[playerId]['roomId'];
    io.to(roomId).emit('surrender', playerId);
  });

  // event that clients disconnect
  socket.on('disconnect', function(playerId) {
    console.log('disconnect');
  });
});

function divideColor(players) {
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

