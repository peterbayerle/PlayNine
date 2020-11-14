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

  };

  // at the beginning of the game, players flip 2 cards of their choosing
  flip(player, cardNum) {
    // returns true if card flipped, false if already flipped/invalid cardNum
    if (cardNum < 0 || cardNum > 7) return false;
    var flipped = this.playerHands[player][cardNum][1] == 'down';
    this.playerHands[player][cardNum][1] = 'up';
    return flipped;
  };

  // players can take 2 actions
  discardToHand(player, cardNum) {
    // returns true if discard added to player hand, false if discard empty/invalid cardNum
    if (cardNum < 0 || cardNum > 7 || !this.discard.length) return false;
    var temp = this.playerHands[player][cardNum][0];
    this.playerHands[player][cardNum][0] = this.discard.pop();
    this.playerHands[player][cardNum][1] = 'up';
    this.discard.push(temp);
    return true;
  };

  deckToHand(player, cardNum) {
    // returns true if discard added to player hand, false if invalid cardNum
    if (cardNum < 0 || cardNum > 7) return false;
    var temp = this.playerHands[player][cardNum][0];
    this.playerHands[player][cardNum][0] = this.deck.pop();
    this.playerHands[player][cardNum][1] = 'up'
    this.discard.push(temp);
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
          points[player] += cards[i] + cards[i+4];
        }
      }
      for (var c of counts) {
        if (c > 0) points[player] += [0, -10, -15, -20][c-1];
      }
    }
    return points;
  };

  get gameState() {
    return {
      p1 : this.playerHandsDisplay.p1,
      p2: this.playerHandsDisplay.p2,
      topDeck: this.deck[this.deck.length-1] || null,
      topDiscard: this.discard[this.discard.length-1] || null
    }
  };

};

module.exports = PlayNine;
