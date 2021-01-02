var PlayNine = require('../model/playNine');

class GameManager {
  // used to manage a PlayNine instance
  constructor(lobbyId) {
    this.lobbyId = lobbyId;
    this.game = new PlayNine();
    this.players = { p1: null, p2: null };
    this.currentPlayer = 'p1';
    this.justDid = null; // 'discard' || 'draw'
  };

  isEmpty() {
    return !this.players.p1 && !this.players.p2;
  };

  setCurrentPlayer(playerId) {
    this.currentPlayer = players.p1 == playerId ? 'p1' : 'p2';
  };

  playerInGame(playerId) {
    return this.players.p1 == playerId || this.players.p2 == playerId;
  };

  addPlayer(newPlayerId) {
    if (!this.players.p1) {
      this.players.p1 = newPlayerId;
      return true;
    } else if (!this.players.p2) {
      this.players.p2 = newPlayerId;
      return true;
    }
    return false; // both players are in the lobby!
  };

  removePlayer(playerId) {
    if (!this.playerInGame(playerId)) return;

    if (this.players.p1 == playerId) {
      this.players.p1 = null;
    } else {
      this.players.p2 = null;
    }
    return;
  };

  handle(action, playerId, cardNum) {
    var playerNum = this.players.p1 == playerId ? 'p1' : 'p2';

    switch (action) {
      case 'flip':
        this.game.flip(playerNum, cardNum);
        break;
      case 'discard':
        this.game.discardToHand(playerNum, cardNum);
        break;
      case 'draw':
        this.game.deckToHand(playerNum, cardNum);
        break;
      case 'draw to discard':
        this.game.deckToDiscard();
        break;
      default:
        break;
    }

    this.justDid = action == 'draw to discard' ? 'draw to discard' : null;
    return this.justDid;
  };

  state() {
    var displayInfo = this.game.displayInfo();
    displayInfo.currentPlayer = this.players[this.currentPlayer];
    displayInfo.players = this.players
    displayInfo.justDid = this.justDid;
    displayInfo.topDeck = this.justDid == 'draw' ? displayInfo.topDeck : null;

    return displayInfo;
  };

};

class CurrentGames {
  // used to keep track of all games being played
  constructor() {
    this.lobbyToGame = {}; // maps lobby id to game
    this.playerToLobby = {}; // maps player id to lobby id
  };

  generateId() {
    return Math.random().toString(36).substring(7);
  };

  addGame() {
    var lobbyId = this.generateId();
    this.lobbyToGame[lobbyId] = new GameManager(lobbyId);
    return lobbyId;
  };

  setCurrentPlayerOfGame(lobbyId, playerId) {
    var game = this.lobbyToGame[lobbyId]
    if (game) {
      game.setCurrentPlayer(playerId)
    }
  }

  addPlayerToGame(lobbyId, playerId) {
    // returns true if player was successfully added, otherwise false
    var game = this.lobbyToGame[lobbyId];
    if (!game) return false;

    var playerAdded = game.addPlayer(playerId);
    if (playerAdded) {
      this.playerToLobby[playerId] = lobbyId;
    }
    return playerAdded;
  };

  removePlayerFromGame(playerId) {
    /*
    removes player from game, and deletes game if no players remain
    msg == 'game dne' if playerId not in a game
    msg == 'players remain' if player is removed from game, but another player is still in the gameManager
    msg == 'deleted game' if the player is removed, and the no other players are left
    */
    var lobbyId = this.playerToLobby[playerId];
    delete this.playerToLobby[playerId];
    var game = this.lobbyToGame[lobbyId];

    if (!game) return { msg: 'not in game' };

    game.removePlayer(playerId);
    if (game.isEmpty()) {
      delete this.lobbyToGame[lobbyId];
      return { msg: 'deleted game' };
    }
    return { msg: 'players remain' };
  };

  switchCurrentPlayer(lobbyId) {
    var game = this.lobbyToGame[lobbyId];
    if (game) {
      game.currentPlayer = (game.currentPlayer == 'p1') ? 'p2' : 'p1';
    }
  };

  setCurrentAction(lobbyId, action) {
    var game = this.lobbyToGame[lobbyId];
    game.justDid = action;
  }

  handlePlayerAction(playerId, move) {
    var lobbyId = this.playerToLobby[playerId];
    var game = this.lobbyToGame[lobbyId];
    var { action, cardNum } = move;

    var justDid = game.handle(action, playerId, cardNum);

    return justDid;
  };

  state(lobbyId) {
    var game = this.lobbyToGame[lobbyId];
    return game.state();
  };

};

module.exports = CurrentGames;
