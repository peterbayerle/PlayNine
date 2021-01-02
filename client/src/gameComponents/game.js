import React from 'react';
import Board from './board';
import Button from 'react-bootstrap/Button';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.lobbyId = props.lobbyId;
    this.playerId = props.playerId;

    this.state = {
      myCards: [],
      opponentCards: [],
      myTurn: false,
      justDid: '',
      topDiscard: '',
      topDraw: ''
    };

    this.socket.emit('joined', {lobbyId: this.lobbyId});

    this.socket.on('handled action', data => {
      var playerNum = data.players.p1 === this.playerId ? 'p1' : 'p2';
      var opponentNum = playerNum === 'p1' ?  'p2' : 'p1';

      this.setState(Object.assign(data, {
        myCards: data[playerNum],
        opponentCards: data[opponentNum],
        myTurn: this.playerId === data.currentPlayer,
      }));
    });
  };

  renderSkip(cards) {
    if (this.state.myTurn && cards.filter(x => x !== null).length >= 7 && this.state.justDid === 'draw to discard') {
      return (
        <div className="text-center">
          <Button
            variant="link"
            onClick={_ => this.socket.emit('player action',
            { mode: this.state.mode, lobbyId: this.lobbyId, playerId: this.playerId, move: { action: 'skipped turn' }})}
          >
          Skip Turn
          </Button>
        </div>
      )
    } else {
      return;
    }
  };

  render() {
    var bottomStatement;
    if (this.state.mode === 'tee up') bottomStatement = 'Tee up!'
    else if (this.state.myTurn) bottomStatement = 'It\'s your turn!'
    else bottomStatement = 'It\'s your opponent\'s turn!'

    return (
      <div className="game">
        <div className="game-board">
          <Board
            {...this.state}
            socket={this.socket}
            playerId={this.playerId}
            lobbyId={this.lobbyId}
          />
          <p className="font-weight-light text-center">{bottomStatement}</p>
          {this.renderSkip(this.state.myCards)}
        </div>
      </div>
    );
  };
};

export default Game;
