const socketIO = require('socket.io');
const io = socketIO.listen(3000);

let players = [];

io.sockets.on('connection', function(socket) {
  console.log('connection');

  socket.on('entry', function(playerId) {
    const player = {
      playerId: playerId,
      roomId: '',
      kind: 'free',
      state: 'waiting',
    };

    const waiting = [];

    for (const p of players) {
      if (p.kind === 'friend') continue;
      if (p.state !== 'waiting') continue;
      waiting.push(p);
    }

    if (waiting.length < 1) {
      const roomId = String(getRoomId());
	    
      player.roomId = roomId;
      players.push(player);

      socket.join(roomId);

      return;
    }

    const opponent = waiting[0];
    const opponentId = opponent.playerId;
    const roomId = opponent.roomId;

    player.roomId = roomId;
    players.push(player);

    socket.join(roomId);

    const colors = divideColor(playerId, opponentId);
    const data = { color: colors, roomId: roomId };
    io.to(roomId).emit('matchingSuccess', data);

    player.state = 'playing';
    opponent.state = 'playing';
  });

  socket.on('entryFriendBattle', function(data) {
    const player = {
      playerId: data.playerId,
      roomId: data.roomId,
      kind: 'friend',
      state: 'waiting',
    };

    players.push(player);
    socket.join(data.roomId);

    const room = io.sockets.adapter.rooms[data.roomId];
    if(room.length < 2) return;

    let opponent = {};
    for (const p of players) {
      if (p.roomId !== data.roomId) continue;
      if (p.playerId === data.playerId) continue;
      opponent = p;
    }

    const colors = divideColor(data.playerId, opponent.playerId);
    const dataFromServer = { color: colors, roomId: data.roomId };
    io.to(data.roomId).emit('matchingSuccess', dataFromServer);

    player.state = 'playing';
    opponent.state = 'playing';
  });

  socket.on('enter', function(roomId) {
    socket.join(roomId);
  });

  socket.on('exit', function(playerId) {
    const player = players.find(e => e.playerId === playerId);

    if(!player) return;

    const roomId = player.roomId;

    socket.leave(roomId);

    players = players.filter(e => e.playerId !== playerId);
  });

  socket.on('message', function(data) {
    const player = players.find(e => e.playerId === data.playerId);
    const roomId = player.roomId;
    io.to(roomId).emit('message', data);
  });

  socket.on('surrender', function(playerId) {
    const player = players.find(e => e.playerId === playerId);
    const roomId = player.roomId;
    io.to(roomId).emit('surrender', playerId);
  });

  socket.on('disconnect', function() {
    console.log('disconnect');
  });
});

function divideColor(playerId1, playerId2) {
  const result = {};
  const rand = getRandom(0, 1);
  if(rand === 0) {
    result[playerId1] = 'black';
    result[playerId2] = 'white';
  } else {
    result[playerId1] = 'white';
    result[playerId2] = 'black';
  }

  return result;
}

function getRoomId(){
  return getRandom(10000, 99999);
}

function getRandom(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

