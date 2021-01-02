var express = require('express');
var socket = require('socket.io');
var path = require('path');
var CurrentGames = require('./model/model');

// app setup
const app = express();
const port = process.env.port || 3001;
const server = app.listen(port);

app.get('/', (req, res) => {
  res.json({'result': '✅'});
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
  }
});

var games = new CurrentGames();

io.sockets.on('connection', (socket) => {
  console.log(`connected: <player id=${socket.id}>`);
  socket.emit('player joined', { playerId: socket.id });

  socket.on('created lobby', data => {
    var lobbyId = games.addGame();
    var joined = games.addPlayerToGame(lobbyId, socket.id);
    socket.emit('joining lobby', {lobbyId});
    socket.join(lobbyId);
    console.log(`new game: <player id=${socket.id}> created ${lobbyId}`);
  });

  // player attempts to join existing lobby
  socket.on('joining lobby', data => {
    var joined = games.addPlayerToGame(data.lobbyId, socket.id);
    socket.emit('successful join?', {joined});

    if (joined) {
      socket.join(data.lobbyId);
      socket.emit('joining lobby', {lobbyId: data.lobbyId});
      console.log(`successful join: <player id=${socket.id}> entered ${data.lobbyId}`);
    } else {
      console.log(`failed join: <player id=${socket.id}> did not enter ${data.lobbyId}`);
    }
  });

  socket.on('joined', data => {
    io.to(data.lobbyId).emit('handled action', games.state(data.lobbyId));
  });

  socket.on('pressed discard', (data) => {
    games.setCurrentAction(data.lobbyId, 'discard');
    io.to(data.lobbyId).emit('handled action', games.state(data.lobbyId));
  });

  socket.on('pressed draw', (data) => {
    games.setCurrentAction(data.lobbyId, 'draw');
    io.to(data.lobbyId).emit('handled action', games.state(data.lobbyId));
  });

  // player makes move
  socket.on('player action', (data) => {
    var justDid = games.handlePlayerAction(data.playerId, data.move);
    if (data.mode == 'play' && justDid != 'draw to discard') {
      games.switchCurrentPlayer(data.lobbyId);
    }
    var state = games.state(data.lobbyId)
    var msg = state.mode == 'end' ? 'end of game' : 'handled action'

    io.to(data.lobbyId).emit(msg, state);
  });

  // player disconnects from site
  socket.on('disconnect', () => {
    var { msg } = games.removePlayerFromGame(socket.id);
    console.log(`departing: <player id=${socket.id}>, msg=${msg}`);
  });
});

console.log('the socket server is running');
