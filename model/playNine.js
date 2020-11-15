class PlayNine {
  constructor() {
    var cards = Array(4).fill(-5);
    for (var i=0; i<13; i++) {
      for (var j=0; j<8; j++) {
        cards.push(i);
      }
    }
    this.shuffle(cards);

    this._deck = cards;
    this.discard = [];
    this.playerHands = { p1: [], p2: [] };

    for (var i=0; i<16; i++) {
      if (i % 2 == 0) { this.playerHands.p1.push([this._deck.pop(), 'down']); }
      else { this.playerHands.p2.push([this._deck.pop(), 'down']); }
    }

    this.faceUp = { p1: 0 , p2: 0 };
    this._mode = 'tee up';
    this._teeUp = { p1: 0, p2: 0 };

  };

  flip(playerNum, cardNum) {
    // returns true if card flipped, false if already flipped/invalid cardNum
    if (cardNum < 0 || cardNum > 7) return false;
    var wasFaceDown = this.playerHands[playerNum][cardNum][1] == 'down';
    this.playerHands[playerNum][cardNum][1] = 'up';

    // if the card was face down initially, then add to the player's faceUp count
    if (wasFaceDown) {
      this.faceUp[playerNum] += 1;
    }

    // handle state
    if (this._mode == 'tee up') {
      this._teeUp[playerNum] += 1;
    }

    return wasFaceDown;
  };

  discardToHand(playerNum, cardNum) {
    // returns true if discard added to player hand, false if discard empty/invalid cardNum
    if (cardNum < 0 || cardNum > 7 || !this.discard.length) return false;
    var [temp, wasFaceDown] = this.playerHands[playerNum][cardNum];

    this.playerHands[playerNum][cardNum][0] = this.discard.pop();
    this.playerHands[playerNum][cardNum][1] = 'up';
    this.discard.push(temp);

    if (wasFaceDown == 'down') {
      this.faceUp[playerNum] += 1;
    }

    return true;
  };

  deckToDiscard() {
    this.discard.push(this.deck.pop());
    return true;
  };

  deckToHand(playerNum, cardNum) {
    // returns true if discard added to player hand, false if invalid cardNum
    if (cardNum < 0 || cardNum > 7) return false;
    var [temp, wasFaceDown] = this.playerHands[playerNum][cardNum];
    this.playerHands[playerNum][cardNum][0] = this.deck.pop();
    this.playerHands[playerNum][cardNum][1] = 'up'
    this.discard.push(temp);

    if (wasFaceDown == 'down') {
      this.faceUp[playerNum] += 1;
    }

    return true;
  };

  shuffle(cards) {
    var j, x, i;
    for (i = cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = cards[i];
        cards[i] = cards[j];
        cards[j] = x;
    }
  };

  get playerHandsDisplay() {
    var display = { p1: [], p2: [] };
    for (var player in this.playerHands) {
      for (var card of this.playerHands[player]) {
        display[player].push(
          card[1] == 'up' ? card[0] : null
        );
      }
    }
    return display;
  };

  get deck() {
    if (!this._deck.length) { // initiate discard/deck swap
      this._deck = this.discard;
      this.discard = [];
      this.shuffle(this._deck);
    }
    return this._deck;
  };

  get scores() {
    var points = { p1: 0, p2: 0 };
    for (var player in points) {
      var counts = Array(13).fill(0);
      var cards = this.playerHands[player];
      for (let i=0; i<4; i++) {
        if (cards[i] == cards[i+4]) {
          var idx = cards[i];
          if (cards[i] == -5) {
            points[player] -= 10;
            idx = counts.length-1;
          }
          counts[idx] += 1;
        } else {
          points[player] += parseInt(cards[i]) + parseInt(cards[i+4]);
        }
      }
      for (var c of counts) {
        if (c > 0) points[player] += [0, -10, -15, -20][c-1];
      }
    }
    return points;
  };

  get mode() {
    if (this._mode == 'tee up') {
      if (this._teeUp.p1 + this._teeUp.p2 == 4) {
        this._mode = 'play';
      }
    } else if (this._mode == 'play') {
      if (this.faceUp.p1 == 8 || this.faceUp.p2 == 8) {
        this._mode = 'end';
      }
    }
    return this._mode;
  };

  displayInfo() {
    return {
      mode: this.mode,
      p1 : this.playerHandsDisplay.p1,
      p2: this.playerHandsDisplay.p2,
      topDeck: this.deck[this.deck.length-1],
      topDiscard: this.discard.length ? this.discard[this.discard.length-1] : null,
      scores: this.mode == 'end' ? this.scores : {}
    }
  };

};

module.exports = PlayNine;
