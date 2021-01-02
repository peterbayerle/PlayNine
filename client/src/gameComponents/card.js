import Button from 'react-bootstrap/Button';

import '../style.css';

function Card(props) {
  var variant;
  switch(props.player) {
    case 'opponent':
      variant = 'warning';
      break;
    case 'you':
      variant = 'info';
      break;
    default:
      variant = 'secondary'
  }
  variant = props.faceDown ? 'outline-' + variant : variant;

  return (
    <Button
      variant={variant}
      className='card-button'
      disabled={!props.clickable}
      style={{'fontSize':'25px'}}
      onClick={props.onClick}
    >
    {props.value}
    </Button>
  );
};

export default Card;
