var GameManager = require('../model/model');
var assert = require('assert');

var gm = new GameManager();

// adding players to a game
var lobbyId = gm.addGame();
assert(gm.addPlayerToGame(lobbyId, 'a'));
assert(gm.addPlayerToGame(lobbyId, 'b'));
assert(!gm.addPlayerToGame(lobbyId, 'c'));

// removing players from a game/deleting games from gm
assert('players remain' == gm.removePlayerFromGame('a').msg);
assert('not in game' == gm.removePlayerFromGame('c').msg);
assert(gm.addPlayerToGame(lobbyId, 'c'));
assert('players remain' == gm.removePlayerFromGame('c').msg);
assert('deleted game' == gm.removePlayerFromGame('b').msg);
assert('not in game' == gm.removePlayerFromGame('b').msg);

// current player
var lobbyId2 = gm.addGame();
gm.addPlayerToGame(lobbyId2, 'a');
gm.addPlayerToGame(lobbyId2, 'b');
assert(gm.lobbyToGame[lobbyId2].currentPlayer = 'p1');
assert(gm.lobbyToGame[lobbyId2].players.p1 == 'a');
gm.switchCurrentPlayer(lobbyId2);
assert(gm.lobbyToGame[lobbyId2].currentPlayer = 'p2');
assert(gm.lobbyToGame[lobbyId2].players.p2 == 'b');
gm.removePlayerFromGame('b');
assert(gm.lobbyToGame[lobbyId2].players.p2 == null);
gm.addPlayerToGame(lobbyId2, 'c');
assert(gm.lobbyToGame[lobbyId2].players.p2 == 'c');
