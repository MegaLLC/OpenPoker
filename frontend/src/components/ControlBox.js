import React from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import RangeSlider from "react-bootstrap-range-slider";
import Row from "react-bootstrap/Row";

import "./ControlBox.css";

const SliderWithInputFormControl = () => {
  const [value, setValue] = React.useState(25);

  return (
    <Form>
      <Form.Group as={Row}>
        <Col xs="3">
          <Form.Control value={value} />
        </Col>
        <Col xs="9">
          <RangeSlider value={value} onChange={(e) => setValue(e.target.value)} />
        </Col>
      </Form.Group>
    </Form>
  );
};

// prettier-ignore
export class ControlBox extends React.Component {
  state = {
    raisebar: false,
    value: 0
  }

  toggleRaiseBar = () => {
    this.setState (prevState =>({
      raisebar: !prevState.raisebar
    }))
  }

  getCallorCheck = () => {
    if (this.props._.game.currentBet > this.props._.game.players[this.props._.net.seat].bet) {
      return "Call"
    } else {
      return "Check"
    }
  }

  render() {
    const renderRaiseBar = () =>{
      if (this.state.raisebar){
        return <SliderWithInputFormControl />
      }
    }
    const renderControlButton = () =>{
      if (this.props._.game.currentPlayer === this.props._.net.seat){
        return <div className="btn-group special">
          <Button variant="danger" onClick={() => this.props._.net.startGame()}>New Hand</Button>
          <Button variant="primary" onClick={() => this.props._.net.fold()}>Fold</Button>
      <Button variant="secondary" onClick={() => this.props._.net.bet(this.props._.game.currentBet)}>{this.getCallorCheck()}</Button>
          <Button variant="success" onClick = {this.toggleRaiseBar}>Raise</Button>
        </div>
      }
    }
    return (
      <div id="bottomRight">
          {renderRaiseBar()}
          {renderControlButton()}
      </div>
    );
  }
}
