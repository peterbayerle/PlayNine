var PlayNine = require('../playNine');
var assert = require('assert');

var p9 = new PlayNine();

// basic card swapping tests
p9._deck = [3];
p9.discard = [-5];
assert(p9.flip('p1', 0));
assert(p9.discardToHand('p1', 1));
p9.discard = [];
assert(!p9.discardToHand('p1', 2));

assert(p9.deckToHand('p2', 0));
assert(!p9.flip('p2', 0));
p9.discard = [2];
assert(!p9._deck.length);
assert(p9.deckToHand('p2', 1));

// point score tests
p9.playerHands = {
  p1: [3, 1, 1, 0, 2, 1, 1, 0],
  p2: [-5, -5, 1, 6, -5, -5, 8, 6],
};
var scores = p9.scores
assert(scores.p1 == -5);
assert(scores.p2 == -21);

p9.playerHands = {
  p1: [1, 2, 3, 4, 5, 6, 7, 8],
  p2: [1, 1, 1, 0, 1, 1, 1, 0],
};
var scores = p9.scores
assert(scores.p1 == 36);
assert(scores.p2 == -15);

p9.playerHands = {
  p1: [1, 1, 1, 1, 1, 1, 1, 1],
  p2: [-5, 0, 1, 2, -5, 0, 1, 2],
};
var scores = p9.scores
assert(scores.p1 == -20);
assert(scores.p2 == -10);
