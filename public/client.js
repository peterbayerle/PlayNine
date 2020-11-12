var socket;

socket = io.connect('http://localhost:3000');

// pages
var enterRoomPage = document.getElementById('enter room page');
var playGamePage = document.getElementById('play game page');

// enterRoomPage divs
var createLobbyButton = document.getElementById('create lobby button');
var enterLobbyButton = document.getElementById('enter lobby button');
var lobbyField = document.getElementById('lobby field');

// playGamePage divs
var lobbyHeader = document.getElementById('lobby header')

// player info
var playerId;
socket.on('player joined', (data) => {
  playerId = data.playerId;
  console.log(`my playerId is ${playerId}`);
});

// methods for dealing with homepage
createLobbyButton.onclick = () => {
  var lobbyId = generateId();
  switchToGame(lobbyId);
  socket.emit('created lobby', { lobbyId: lobbyId });
};

enterLobbyButton.onclick = () => {
  var lobbyId = lobbyField.value;
  socket.emit('joining lobby', { lobbyId: lobbyId });
};

lobbyField.onkeydown = (event) => {
  if (event.key == 'Enter') {
    var lobbyId = lobbyField.value;
    socket.emit('joining lobby', { lobbyId: lobbyId });
  }
};

socket.on('successful join?', (data) => {
  if (data.joined) {
    switchToGame(data.lobbyId);
  }
});

// helpers
var generateId = () => {
  return Math.random().toString(36).substring(7);
};

var switchToGame = (lobbyId) => {
  enterRoomPage.style.display = 'none';
  playGamePage.style.display = 'block';
  lobbyHeader.innerHTML = `Lobby Id: ${lobbyId}`;
};
