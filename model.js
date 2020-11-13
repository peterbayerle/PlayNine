class Game {
  constructor(lobbyId) {
    this.lobbyId = lobbyId;
    this.player1Id = null;
    this.player2Id = null;
    this.currentScore = 0;
    this.currentPlayer = this.player1Id;
  };

  isEmpty() {
    return !this.player1Id && !this.player2Id;
  }

  setCurrentPlayer(playerId) {
    this.currentPlayer = playerId;
  }

  playerInGame(playerId) {
    return this.player1Id == playerId || this.player2Id == playerId;
  }

  addPlayer(newPlayerId) {
    if (!this.player1Id) {
      this.player1Id = newPlayerId;
      return true;
    } else if (!this.player2Id) {
      this.player2Id = newPlayerId;
      return true;
    }
    return false; // both players are in the lobby!
  };

  removePlayer(playerId) {
    if (!this.playerInGame(playerId)) return;

    if (this.player1Id == playerId) {
      this.player1Id = null;
    } else {
      this.player2Id = null;
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
    console.log(`current player: ${game.currentPlayer}`);
    if (game) {
      game.currentPlayer = (game.currentPlayer == game.player1Id) ?
        game.player2Id:
        game.player1Id;
    }
    console.log(`new current player: ${game.currentPlayer}`);
  };

  getGameState(lobbyId) {
    var game = this.lobbyToGame[lobbyId];

    if (!game) {
      return {};
    }

    return {
      currentPlayer: game.currentPlayer,
      currentScore: game.currentScore
    };
  };

};

module.exports = GameManager;
