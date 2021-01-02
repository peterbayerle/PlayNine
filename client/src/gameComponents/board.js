import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from './card';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
  };

  handleCardClick(idx) {
    var move;
    if (this.props.mode === 'tee up' || this.props.justDid === 'draw to discard') {
      move = { action: 'flip', cardNum: idx };
    } else {
      // mode == play
      move = { action: this.props.justDid, cardNum: idx };
    }
    this.socket.emit('player action',
    {mode: this.props.mode, lobbyId: this.props.lobbyId, playerId: this.props.playerId, move});
  };

  renderCard(idx, val, player, clickable) {
    return (
      <div className='pr-2' key={idx}>
        <Card
          value={val}
          player={player}
          faceDown={val !== null}
          clickable={clickable}
          onClick={_ => this.handleCardClick(idx)}
        />
      </div>
    );
  };

  getClickableCards(cards, player) {
    // determines which cards are clickable
    var clickable;
    if (player === 'opponent' || this.props.mode === 'end') {
      clickable = Array(8).fill(false);
    } else if (this.props.mode === 'tee up') {
      if (cards.filter(x => x !== null).length > 1) { // if the player has flipped over 2 during tee off
        clickable = Array(8).fill(false);
      } else {
        clickable = cards.map(x => x === null);
      }
    } else {
      if (!this.props.myTurn || !this.props.justDid) { // not your turn, or you haven't pressed deck or discard
        clickable = Array(8).fill(false);
      } else if (this.props.justDid === 'draw to discard') { // if you just discarded what you drew
        clickable = cards.map(x => x === null); // you can only flip over what hasn't been flipped
      } else {
        clickable = Array(8).fill(true);
      }
    }
    return clickable
  };

  renderHand(cards, player) {
    var clickable = this.getClickableCards(cards, player);

    return (
      <Container>
        <Row className='justify-content-center'>
          {cards.slice(0,4).map(
            (val, idx) => this.renderCard(idx, val, player, clickable[idx]))}
        </Row>
        <Row className='justify-content-center pt-2'>
        {cards.slice(4).map(
          (val, idx) => this.renderCard(idx+4, val, player, clickable[idx+4]))}
        </Row>
      </Container>
    );
  };

  getClickablePiles() {
    // [discard, draw]
    return [
      ((this.props.topDiscard !== null || this.props.justDid === 'draw') && this.props.myTurn && this.props.justDid !== 'draw to discard'),
      (this.props.myTurn && this.props.topDeck === null && this.props.mode !== 'tee up' && !this.props.justDid)
    ]
  };

  handlePileClick(pile) {
    switch (pile) {
      case 'topDiscard':
        if (!this.props.justDid) {
          this.socket.emit('pressed discard', { lobbyId: this.props.lobbyId });
        } else if (this.props.justDid === 'draw') {
          // player wants to discard the card they drew
          this.socket.emit('player action',
          { mode: this.props.mode, lobbyId: this.props.lobbyId, playerId: this.props.playerId, move: { action: 'draw to discard' }});
        }
        break;
      default:
        this.props.socket.emit('pressed draw', { lobbyId: this.props.lobbyId });
        break;
    }
  };

  renderPiles() {
    var clickable = this.getClickablePiles();
    return (
      <Container>
        <Row className='d-flex flex-row justify-content-center pt-4'>
            {['topDiscard', 'topDeck'].map((pile, idx)  => {
              return (
                <div className='d-flex flex-column pl-3 pr-3' key={idx}>
                  <Card
                    value={this.props[pile]}
                    player={pile}
                    faceDown={this.props[pile] !== null}
                    clickable={clickable[idx]}
                    onClick={_ => this.handlePileClick(pile)}
                  />
                  <p className='font-weight-light text-center'>{pile.slice(3)}</p>
                </div>
              )}
            )
          }
        </Row>
      </Container>
    );
  };

  render() {
    return (
      <div className="pt-2">
        {this.renderHand(this.props.opponentCards, 'opponent')}
        {this.renderPiles()}
        {this.renderHand(this.props.myCards, 'you')}
      </div>
    );
  };
};

export default Board;
