export class View {
  constructor(document) {
    // pages
    this.enterRoomPage = document.getElementById('enter room page');
    this.playGamePage = document.getElementById('play game page');

    // enterRoomPage divs
    this.createLobbyButton = document.getElementById('create lobby button');
    this.enterLobbyButton = document.getElementById('enter lobby button');
    this.lobbyField = document.getElementById('lobby field');
    this.lobbyFull = document.getElementById('lobby full');

    // playGamePage divs
    this.lobbyHeader = document.getElementById('lobby header');
    this.teeUp = document.getElementById('tee up header');
    this.yourTurn = document.getElementById('your turn');
    this.opponentsTurn = document.getElementById('opponents turn');
    this.discardButton = document.getElementById('discard');
    this.drawButton = document.getElementById('draw');
    this.skipButton = document.getElementById('skip');
    this.buttons = Array.from(Array(8).keys(), i =>
      document.getElementById(`card${i}`)
    );
    this.opponentCards = document.getElementById('opponent cards');
    this.yourCards = document.getElementById('your cards');
    this.topDiscard = document.getElementById('top discard');
    this.topDeck = document.getElementById('top deck');
  };

  didNotJoin() {
    this.lobbyFull.style.display = 'block';
    this.lobbyFull.style.color = 'red';
  }

  showGamePage(lobbyId) {
    this.lobbyFull.display = 'none';
    this.enterRoomPage.style.display = 'none';
    this.playGamePage.style.display = 'block';
    this.lobbyHeader.innerHTML = `Lobby Id: ${lobbyId}`;
  };

  getLobbyId() {
    return this.lobbyField.value;
  };

  makeUnclickable(discard, draw, inds) {
    this.discardButton.disabled = discard;
    this.drawButton.disabled = draw;
    if (inds == 'all') inds = Array.from(Array(8).keys());
    for (var i=0; i<this.buttons.length; i++) {
      this.buttons[i].disabled = inds.includes(i);
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
    var inds = this.cardsToInds(data[data.you])
    this.opponentCards.innerHTML = `opponent's cards: ${JSON.stringify(data[data.opponent])}`;
    this.yourCards.innerHTML = `your cards: ${JSON.stringify(data[data.you])}`;

    if (data.mode == 'tee up') {
      this.teeUp.style.display = 'block';
      if (inds.length > 1) this.makeUnclickable(true, true, 'all');
      else this.makeUnclickable(true, true, inds);
      this.skipButton.style.display = 'none';

    } else if (data.mode == 'play') {
      var yourTurn = data.you == data.currentPlayer;

      var clickableCards = null;
      if (data.justDid == 'draw to discard') {
        clickableCards = inds;
      } else if (!yourTurn) {
        clickableCards = 'all';
      } else {
        clickableCards = [];
      }

      this.makeUnclickable(
        ((data.topDiscard === null && data.justDid != 'draw') || !yourTurn || data.justDid == 'draw to discard'),
        (!yourTurn || data.justDid),
        clickableCards
      );

      if (inds.length == 7 && data.justDid == 'draw' && yourTurn) {
        this.skipButton.style.display = 'block';
      } else {
        this.skipButton.style.display = 'none';
      }


      this.topDiscard.innerHTML = `top discard: ${data.topDiscard}`;
      this.topDeck.innerHTML = data.justDid == 'draw' ? `top deck: ${data.topDeck}` : null;

      this.yourTurn.style.display = yourTurn ? 'block' : 'none';
      this.opponentsTurn.style.display = yourTurn ? 'none' : 'block';
      this.teeUp.style.display = 'none';

    } else if (data.mode == 'end') {
      this.yourTurn.style.display = 'none';
      this.opponentsTurn.style.display = 'none';
      this.opponentCards.innerHTML = `opponent's points: ${data.scores.opponent}`;
      this.yourCards.innerHTML = `your points: ${data.scores.you}`;
      this.teeUp.innerHTML = '🏌️‍♀️ game over! thanks for playing 🏌️‍♂️';

      for (var i=0; i<this.buttons.length; i++) {
        this.buttons[i].style.display = 'none';
      }
      this.discardButton.style.display = 'none';
      this.drawButton.style.display = 'none';
      this.skipButton.style.display = 'none';
      this.topDiscard.style.display = 'none';
      this.topDeck.style.display = 'none';
    }
  }

};
