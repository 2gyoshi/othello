const socketIO = require('socket.io');
const io = socketIO.listen(3000);

const FREEMODE   = 'free';
const FRIENDMODE = 'friend';
const WAITING = 'waiting';
const PLAYING = 'playing';

class Player {
  constructor(id, roomId) {
    this.id = id;
    this.roomId = roomId;
  }
  setRoomId(roomId) {
    this.roomId = roomId;
  }
  getRoomId() {
    return this.roomId;
  }
}

class PlayerList {
  constructor() {
    this.items = new Array();
  }
  add(item) {
    this.items.push(item);
  }
  remove(item) {
    this.items = this.items.filter(e => e !== item);
  }
  size() {
    return this.items.length;
  }
  getItems() {
    return this.items;
  }
  getItemByRoomId(roomId) {
    return this.items.filter(e => e.getRoomId() === roomId);
  }
}

const waitingPlayerList = new PlayerList();
const waitingPlayerListForFriend = new PlayerList();

io.sockets.on('connection', function(socket) {
  console.log('connection');

  socket.on('entry', function() {
    const playerList = waitingPlayerListForFriend;

    const player = new Player(socket.id);
    playerList.add(player);

    const waiting = playerList.getItems();

    // プレイヤーが人数に満たない場合は入室して待機する
    if (waiting.length < 2) {
      const roomId = String(getRoomId());
      player.setRoomId(roomId);
      socket.join(roomId);

      return;
    }

    // 待機中の部屋に入室する
    const opponent = waiting[0];

    const roomId = opponent.getRoomId();
    player.setRoomId(roomId);
    socket.join(roomId);

    // プレイヤーに石の色を振り分ける
    const colors = divideColor(player.id, opponent.id);

    // クライアントに通知する
    io.to(roomId).emit('success', {roomId: roomId, colors: colors});

    playerList.remove(player);
    playerList.remove(opponent);
  });

  socket.on('entryForFriend', function(roomId) {
    const playerList = waitingPlayerListForFriend;

    const player = new Player(socket.id, roomId);
    playerList.add(player);
    socket.join(roomId);

    const waiting = playerList.getItemByRoomId(roomId);

    if (waiting.length < 2) return;

    const opponent = waiting[0];

    // プレイヤーに石の色を振り分ける
    const colors = divideColor(player.id, opponent.id);

    // クライアントに通知する
    io.to(roomId).emit('success', {roomId: roomId, colors: colors});

    playerList.remove(player);
    playerList.remove(opponent);
  });

  socket.on('exit', function(roomId) {
    socket.leave(roomId);
  });

  socket.on('message', function(data) {
    io.to(data.roomId).emit('message', data);
  });

  socket.on('surrender', function(data) {
    io.to(data.roomId).emit('surrender', data.surrenderId);
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

