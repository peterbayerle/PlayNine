import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table'

function End(props) {
  return (
    <Container>
      <div className="d-flex flex-column justify-content-center pt-3">
        <Container className="w-50 pt-3">
          <Table>
            <tbody>
              <tr>
                <td>{!props.youWin ? '🏆' : ''}</td>
                <th>Opponent's score</th>
                <td>{props.opponentScore}</td>
              </tr>
              <tr>
                <td>{props.youWin ? '🏆' : ''}</td>
                <th>Your score</th>
                <td>{props.yourScore}</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
    </Container>
  );
};

export default End;
