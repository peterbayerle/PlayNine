var express = require('express');
var socket = require('socket.io');
var path = require('path');
var GameManager = require('./model');

// app setup
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3000);
var io = socket(server);

app.use('/', (req, res) => {
  res.render('index');
});

var gameManager = new GameManager();

// socket logic
io.sockets.on('connection', (socket) => {
  console.log(`connected: <player id=${socket.id}>`);
  socket.emit('player joined', { playerId: socket.id });

  // player creates new lobby
  socket.on('created lobby', (data) => {
    var lobbyId = gameManager.addGame()
    var joined = gameManager.addPlayerToGame(lobbyId, socket.id);
    socket.emit('successful join?', { lobbyId: lobbyId, joined: joined });

    gameManager.setCurrentPlayerOfGame(lobbyId, socket.id);
    socket.join(lobbyId);
    socket.emit('update game ui', gameManager.getGameState(lobbyId));
    console.log(`new game: <player id=${socket.id}> created ${lobbyId}`);
  });

  // player attempts to join existing lobby
  socket.on('joining lobby', (data) => {
    var joined = gameManager.addPlayerToGame(data.lobbyId, socket.id);
    socket.emit('successful join?', { lobbyId: data.lobbyId, joined: joined });

    if (joined) {
      socket.join(data.lobbyId);
      socket.emit('update game ui', gameManager.getGameState(data.lobbyId));
      console.log(`successful join: <player id=${socket.id}> entered ${data.lobbyId}`);
    } else {
      console.log(`failed join: <player id=${socket.id}> did not enter ${data.lobbyId}`);
    }
  });

  socket.on('increased score', (data) => {
    gameManager.increaseScore(data.lobbyId);
    gameManager.switchCurrentPlayer(data.lobbyId);
    io.to(data.lobbyId).emit('update game ui', gameManager.getGameState(data.lobbyId));
  });

  // player disconnects from site
  socket.on('disconnect', () => {
    var { msg } = gameManager.removePlayerFromGame(socket.id);
    console.log(`departing: <player id=${socket.id}>, msg=${msg}`);
  });

});

console.log('the socket server is running');
