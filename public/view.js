export class View {
  constructor(document) {
    // pages
    this.enterRoomPage = document.getElementById('enter room page');
    this.playGamePage = document.getElementById('play game page');

    // enterRoomPage divs
    this.createLobbyButton = document.getElementById('create lobby button');
    this.enterLobbyButton = document.getElementById('enter lobby button');
    this.lobbyField = document.getElementById('lobby field');

    // playGamePage divs
    this.lobbyHeader = document.getElementById('lobby header');
    this.yourTurn = document.getElementById('your turn');
    this.opponentsTurn = document.getElementById('opponents turn');
    this.score = document.getElementById('score');
    this.increaseScoreButton = document.getElementById('increase score');
  };

  showGamePage(lobbyId) {
    this.enterRoomPage.style.display = 'none';
    this.playGamePage.style.display = 'block';
    this.lobbyHeader.innerHTML = `Lobby Id: ${lobbyId}`;
  };

  getLobbyId() {
    return this.lobbyField.value;
  };

  updateGameUI(data) {
    var yourTurn = data.you == data.currentPlayer;
    this.yourTurn.style.display = yourTurn ? 'block' : 'none';
    this.opponentsTurn.style.display = yourTurn ? 'none' : 'block';
    this.score.innerHTML = data.currentScore;
    this.increaseScoreButton.disabled = !yourTurn;
  }

};
