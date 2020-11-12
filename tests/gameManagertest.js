var GameManager = require('../model');
var assert = require('assert');

var gm = new GameManager();
gm.addGame('id1');
assert(gm.addPlayerToGame('id1', 'a'));
assert(gm.addPlayerToGame('id1', 'b'));
assert(!gm.addPlayerToGame('id1', 'c'));

assert('players remain' == gm.removePlayerFromGame('a').msg);
assert('not in game' == gm.removePlayerFromGame('c').msg);
assert(gm.addPlayerToGame('id1', 'c'));
assert('players remain' == gm.removePlayerFromGame('c').msg);
assert('deleted game' == gm.removePlayerFromGame('b').msg);
assert('not in game' == gm.removePlayerFromGame('b').msg);
