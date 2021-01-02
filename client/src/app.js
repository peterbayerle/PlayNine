import React from 'react';
import Game from './gameComponents/game';
import End from './end';
import Home from './home';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props){
    super(props);
    this.endProps = {};

    this.state = {
      joinedGame: false,
      lobbyId: '',
      mode: ''
    };

    // the only socket events handled in the App instance are those that affect the rendering of subcomponents
    this.socket = io('http://localhost:3001', {
      withCredentials: true,
    });

    // get player's id from server
    this.socket.on('player joined', data => {
      this.playerId = data.playerId;
    });

    // handle change of view when a player enters a lobby
    this.socket.on('joining lobby', data => {
      this.setState({joinedGame: true, lobbyId: data.lobbyId});
    });

    // handle end of game screen
    this.socket.on('end of game', data => {
      var yourNum = data.players.p1 === this.playerId ? 'p1' : 'p2';
      var opponentNum = yourNum === 'p1' ? 'p2' : 'p1'
      this.endProps.yourScore = data.scores[yourNum];
      this.endProps.opponentScore = data.scores[opponentNum];
      this.endProps.youWon = this.endProps.yourScore <= this.endProps.opponentScore;

      this.setState({mode: 'end'});
    });
  };

  render() {
    var View;
    if (this.state.mode === 'end') {
      View = End;
    } else if (this.state.joinedGame) {
      View = Game
    } else {
      View = Home;
    }

    return (
      <div>
        <h1 className="text-center pt-3">️🏌️‍♂️ Play Nine! 🏌️‍♀️</h1>
        <h4 className="text-center">{this.state.joinedGame ? `Lobby: ${this.state.lobbyId}` : ''}</h4>
        <View
          socket={this.socket}
          lobbyId={this.state.lobbyId}
          playerId={this.playerId}
          {...this.endProps}
        />
      </div>
    );
  };
};

export default App;
