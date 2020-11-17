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
    this.discardButton = document.getElementById('discard');
    this.drawButton = document.getElementById('draw');
    this.skipButton = document.getElementById('skip');
    this.yourCards = Array.from(Array(8).keys(), i =>
      document.getElementById(`yourCard${i}`)
    );
    this.opponentCards = Array.from(Array(8).keys(), i =>
      document.getElementById(`opponentCard${i}`)
    );
    this.opponentsScore = document.getElementById('opponents score');
    this.yourScore = document.getElementById('your score');
    this.scoreTable = document.getElementById('score table');
  };

  didNotJoin() {
    this.lobbyField.classList.add('is-invalid');
  }

  showGamePage(lobbyId) {
    // this.lobbyFull.display = 'none';
    this.enterRoomPage.style.display = 'none';
    this.playGamePage.style.display = 'block';
    this.lobbyHeader.innerHTML = `Lobby Id: ${lobbyId}`;
  };

  getLobbyId() {
    return this.lobbyField.value;
  };

  updateCardFaces(cards, rel) {
    var cardStyle = rel == 'you' ? 'info' : 'warning';
    var buttons = rel == 'you' ? this.yourCards : this.opponentCards
    for (var i=0; i<8; i++) {
      if (cards[i] !== null) {
        buttons[i].value = cards[i];
        buttons[i].className = `btn btn-outline-${cardStyle}`;
      } else {
        buttons[i].value = '';
        buttons[i].className = `btn btn-${cardStyle}`;
      }
    }
  };

  makeUnclickable(discard, draw, inds) {
    this.discardButton.disabled = discard;
    this.drawButton.disabled = draw;
    if (inds == 'all') inds = Array.from(Array(8).keys());
    for (var i=0; i<this.yourCards.length; i++) {
      this.yourCards[i].disabled = inds.includes(i);
    }
  };

  cardsToInds(cards) {
    var inds = [];
    for (var i=0; i<cards.length; i++) {
      if (cards[i] !== null) inds.push(i);
    }
    return inds;
  }

  updateGameUI(data) {
    var inds = this.cardsToInds(data[data.you]);
    this.updateCardFaces(data[data.opponent], 'opponent');
    this.updateCardFaces(data[data.you], 'you');

    if (data.mode == 'tee up') {
      if (inds.length > 1) this.makeUnclickable(true, true, 'all');
      else this.makeUnclickable(true, true, inds);
      this.skipButton.style.display = 'none';

    } else if (data.mode == 'play') {
      var yourTurn = data.you == data.currentPlayer;

      var clickableCards = null;
      if (data.justDid == 'draw to discard') {
        clickableCards = inds;
      } else if (!yourTurn || !data.justDid) {
        clickableCards = 'all';
      } else {
        clickableCards = [];
      }

      // card view
      this.makeUnclickable(
        ((data.topDiscard === null && data.justDid != 'draw') || !yourTurn || data.justDid == 'draw to discard'),
        (!yourTurn || data.justDid),
        clickableCards
      );

      // discard button view
      if (data.topDicard !== null) {
        this.discardButton.value = data.topDiscard
        this.discardButton.className = 'btn btn-outline-secondary';
      } else {
        this.discardButton.className = 'btn btn-secondary';
        this.discardButton.className = '';
      }

      //  draw button view
      if (data.justDid == 'draw') {
        this.drawButton.value = data.topDeck;
        this.drawButton.className = 'btn btn-outline-secondary';
      } else {
        this.drawButton.value = '';
        this.drawButton.className = 'btn btn-secondary';
      }

      // skip button
      var showSkip = inds.length == 7 && data.justDid == 'draw to discard' && yourTurn
      if (showSkip) {
        this.skipButton.style.display = 'block';
      } else {
        this.skipButton.style.display = 'none';
      }

      // turn view
      this.yourTurn.style.display = !yourTurn || showSkip ? 'none' : 'block';
      this.opponentsTurn.style.display = yourTurn || showSkip ? 'none' : 'block';

    } else if (data.mode == 'end') {
      this.scoreTable.style.display = 'block';
      this.yourScore.innerHTML = data.scores.you ;
      this.opponentsScore.innerHTML = data.scores.opponent;
      this.lobbyHeader.innerHTML = 'Game over - thanks for playing!';

      for (var i=0; i<this.yourCards.length; i++) {
        this.yourCards[i].style.display = 'none';
        this.opponentCards[i].style.display = 'none';
      }

      this.discardButton.style.display = 'none';
      this.drawButton.style.display = 'none';
      this.skipButton.style.display = 'none';
      this.opponentsTurn.style.display = 'none';
      this.yourTurn.style.display = 'none';
      document.getElementById('draw label').style.display = 'none';
      document.getElementById('discard label').style.display = 'none';
    }
  }

};
