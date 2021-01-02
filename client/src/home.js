import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'

import './style.css'

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lobbyInputContent: '',
      unsuccessfulJoin: false
    };

    this.socket = props.socket;

    this.socket.on('successful join?', data => {
      if (!data.joined) {
        this.setState({unsuccessfulJoin: true});
      }
    });
  };

  createGame() {
    this.socket.emit('created lobby', {});
  };

  joinGame() {
    var lobbyId = this.state.lobbyInputContent;
    this.socket.emit('joining lobby', { lobbyId: lobbyId });
  };

  render() {
    var invalidLobby = this.state.unsuccessfulJoin ? 'is-invalid' : '';

    return (
      <Container id="home-page">
        <div className="d-flex flex-column justify-content-center pt-2">
          <Button
            variant="info"
            onClick={() => this.createGame()}
          >Create New Game</Button>

          <InputGroup className="mb-3 pt-3">
            <FormControl
              placeholder="Lobby Id"
              aria-label="Enter Lobby Id"
              aria-describedby="basic-addon2"
              onSubmit={event => this.joinGame()}
              onChange={event => {this.setState({lobbyInputContent: event.target.value})}}
              className={`${invalidLobby} rounded-left`}
            />
            <InputGroup.Append>
              <Button
                className="rounded-right"
                variant="info"
                onClick={() => this.joinGame()}
              >Join game</Button>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">
              This lobby is full or does not exist!
            </Form.Control.Feedback>
          </InputGroup>
        </div>
      </Container>
    );
  };
};

export default Home;
