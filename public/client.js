var socket;
import { View } from './view.js'

socket = io.connect('http://localhost:3000');
var view = new View(document);

// player info
var playerId;
var lobbyId;

socket.on('player joined', data => {
  playerId = data.playerId;
  console.log(`my playerId is ${playerId}`);
});

// methods for dealing with homepage
view.createLobbyButton.onclick = () => {
  // var lobbyId = generateId();
  // view.showGamePage(lobbyId)
  socket.emit('created lobby', { });
};

view.enterLobbyButton.onclick = () => {
  var lobbyId = view.getLobbyId();
  socket.emit('joining lobby', { lobbyId: lobbyId });
};

view.lobbyField.onkeydown = event => {
  if (event.key == 'Enter') {
    var lobbyId = view.getLobbyId();
    socket.emit('joining lobby', { lobbyId: lobbyId });
  }
};

view.increaseScoreButton.onclick = event => {
  socket.emit('increased score', { lobbyId: lobbyId });
};

socket.on('successful join?', data => {
  if (data.joined) {
    lobbyId = data.lobbyId;
    view.showGamePage(data.lobbyId)
  }
});

socket.on('update game ui', data => {
  data.you = playerId;
  view.updateGameUI(data);
})
