var CurrentGames = require('../model/model');
var assert = require('assert');

var games = new CurrentGames();

// adding players to a game
var lobbyId = games.addGame();
assert(games.addPlayerToGame(lobbyId, 'a'));
assert(games.addPlayerToGame(lobbyId, 'b'));
assert(!games.addPlayerToGame(lobbyId, 'c'));

// removing players from a game/deleting games from games
assert('players remain' == games.removePlayerFromGame('a').msg);
assert('not in game' == games.removePlayerFromGame('c').msg);
assert(games.addPlayerToGame(lobbyId, 'c'));
assert('players remain' == games.removePlayerFromGame('c').msg);
assert('deleted game' == games.removePlayerFromGame('b').msg);
assert('not in game' == games.removePlayerFromGame('b').msg);

// current player
var lobbyId2 = games.addGame();
games.addPlayerToGame(lobbyId2, 'a');
games.addPlayerToGame(lobbyId2, 'b');
assert(games.lobbyToGame[lobbyId2].currentPlayer == 'p1');
assert(games.lobbyToGame[lobbyId2].players.p1 == 'a');
games.switchCurrentPlayer(lobbyId2);
assert(games.lobbyToGame[lobbyId2].currentPlayer == 'p2');
assert(games.lobbyToGame[lobbyId2].players.p2 == 'b');
games.removePlayerFromGame('b');
assert(games.lobbyToGame[lobbyId2].players.p2 == null);
games.addPlayerToGame(lobbyId2, 'c');
assert(games.lobbyToGame[lobbyId2].players.p2 == 'c');
