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
    gameManager.addGame(data.lobbyId)
    gameManager.addPlayerToGame(data.lobbyId, socket.id);
    console.log(`new game: <player id=${socket.id}> @ ${data.lobbyId}`);
  });

  // player attempts to join existing lobby
  socket.on('joining lobby', (data) => {
    var joined = gameManager.addPlayerToGame(data.lobbyId, socket.id);
    socket.emit('successful join?', { lobbyId: data.lobbyId, joined: joined });

    if (joined) {
      console.log(`joined: <player id=${socket.id}> @ ${data.lobbyId}`);
    } else {
      console.log(`failed to join: <player id=${socket.id}> @ ${data.lobbyId}`);
    }
    console.log(gameManager.playerToLobby);
    console.log(gameManager.lobbyToGame);
  });

  // player disconnects from site
  socket.on('disconnect', () => {
    var { msg } = gameManager.removePlayerFromGame(socket.id);
    console.log(`departing: <player=${socket.id}>, msg=${msg}`);
  });

});

console.log('the socket server is running');
