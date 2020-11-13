class Game {
  constructor(lobbyId) {
    this.lobbyId = lobbyId;
    this.players = { p1: null, p2: null };
    this.currentScore = 0;
    this.currentPlayer = 'p1';
  };

  isEmpty() {
    return !this.players.p1 && !this.players.p2;
  }

  setCurrentPlayer(playerId) {
    this.currentPlayer = players.p1 == playerId ? 'p1' : 'p2';
  }

  playerInGame(playerId) {
    return this.players.p1 == playerId || this.players.p2 == playerId;
  }

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
};

class GameManager {
  constructor() {
    this.lobbyToGame = {}; // maps lobby id to game
    this.playerToLobby = {}; // maps player id to lobby id
  };

  generateId() {
    return Math.random().toString(36).substring(7);
  };

  addGame() {
    var lobbyId = this.generateId();
    this.lobbyToGame[lobbyId] = new Game(lobbyId);
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
  }

  increaseScore(lobbyId) {
    var game = this.lobbyToGame[lobbyId];
    if (game) {
      game.currentScore++;
    }
  };

  switchCurrentPlayer(lobbyId) {
    var game = this.lobbyToGame[lobbyId];
    if (game) {
      game.currentPlayer = (game.currentPlayer == 'p1') ? 'p2' : 'p1';
    }
  };

  getGameState(lobbyId) {
    var game = this.lobbyToGame[lobbyId];

    if (!game) {
      return {};
    }

    return {
      currentPlayer: game.players[game.currentPlayer],
      currentScore: game.currentScore
    };
  };

};

module.exports = GameManager;
