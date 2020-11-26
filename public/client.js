var socket;
import { View } from './view.js'

socket = io.connect('/');
var view = new View(document);

// player and game info
var playerId;
var lobbyId;
var mode;
var justDid;

socket.on('player joined', data => {
  playerId = data.playerId;
});

// methods for dealing with homepage
view.createLobbyButton.onclick = () => {
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

view.discardButton.onclick = () => {
  if (!justDid) {
    socket.emit('pressed discard', { lobbyId });
  } else if (justDid == 'draw') {
    // player wants to discard the card they drew
    socket.emit('player action',
    { mode, lobbyId, playerId, move: { action: 'draw to discard' }});
  }
};

view.drawButton.onclick = () => {
  socket.emit('pressed draw', { lobbyId });
}

view.skipButton.onclick = () => {
  socket.emit('player action',
  { mode, lobbyId, playerId, move: { action: 'skipped turn' }});
}

for (let i in view.yourCards) {
  var button = view.yourCards[i];
  button.onclick = () => {
    if (mode == 'tee up' || justDid == 'draw to discard') {
      socket.emit('player action',
      { mode, lobbyId, playerId, move: { action: 'flip', cardNum: i }});
    } else {
      // mode == play
      socket.emit('player action',
      { mode, lobbyId, playerId, move: { action: justDid, cardNum: i }});
    }
  }
}

socket.on('successful join?', data => {
  if (data.joined) {
    lobbyId = data.lobbyId;
    view.showGamePage(data.lobbyId)
  } else {
    view.didNotJoin();
  }
});

socket.on('update game ui', data => {
  mode = data.mode;
  data.you = playerId;
  data.opponent = data.players[0] != playerId ?  data.players[0] : data.players[1]
  justDid = data.justDid;

  if (mode == 'end') {
    data.scores = {
      you: data.scoresById[data.you],
      opponent: data.scoresById[data.opponent]
    };
  }

  view.updateGameUI(data);
});
