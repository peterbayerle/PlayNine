var express = require('express');
var socket = require('socket.io');
var path = require('path');
var CurrentGames = require('./model/model');

// app setup
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');

var server = app.listen(3000, '192.168.86.217');
var io = socket(server);

app.use('/', (req, res) => {
  res.render('index', {});
});

var games = new CurrentGames();

io.sockets.on('connection', (socket) => {
  console.log(`connected: <player id=${socket.id}>`);
  socket.emit('player joined', { playerId: socket.id });

  // player creates new lobby
  socket.on('created lobby', (data) => {
    var lobbyId = games.addGame()
    var joined = games.addPlayerToGame(lobbyId, socket.id);
    socket.emit('successful join?', { lobbyId: lobbyId, joined: joined });

    socket.join(lobbyId);
    socket.emit('update game ui', games.displayInfo(lobbyId));
    console.log(`new game: <player id=${socket.id}> created ${lobbyId}`);
  });

  // player attempts to join existing lobby
  socket.on('joining lobby', (data) => {
    var joined = games.addPlayerToGame(data.lobbyId, socket.id);
    socket.emit('successful join?', { lobbyId: data.lobbyId, joined: joined });

    if (joined) {
      socket.join(data.lobbyId);
      socket.emit('update game ui', games.displayInfo(data.lobbyId));
      console.log(`successful join: <player id=${socket.id}> entered ${data.lobbyId}`);
    } else {
      console.log(`failed join: <player id=${socket.id}> did not enter ${data.lobbyId}`);
    }
  });

  // to prevent cheaters!!!!!
  socket.on('pressed discard', (data) => {
    games.setCurrentAction(data.lobbyId, 'discard');
    io.to(data.lobbyId).emit('update game ui', games.displayInfo(data.lobbyId));
  });

  socket.on('pressed draw', (data) => {
    games.setCurrentAction(data.lobbyId, 'draw');
    io.to(data.lobbyId).emit('update game ui', games.displayInfo(data.lobbyId));
  });

  // player makes move
  socket.on('player action', (data) => {
    var justDid = games.handlePlayerAction(data.playerId, data.move);
    if (data.mode == 'play' && justDid != 'draw to discard') {
      games.switchCurrentPlayer(data.lobbyId);
    }
    io.to(data.lobbyId).emit('update game ui', games.displayInfo(data.lobbyId));
  });

  // player disconnects from site
  socket.on('disconnect', () => {
    var { msg } = games.removePlayerFromGame(socket.id);
    console.log(`departing: <player id=${socket.id}>, msg=${msg}`);
  });

});

console.log('the socket server is running');
