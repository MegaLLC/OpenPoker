import React from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import RangeSlider from "react-bootstrap-range-slider";
import Row from "react-bootstrap/Row";

import "./ControlBox.css";

const SliderWithInputFormControl = (_) => {
  const self = _.state.game.players[_.state.net.seat];
  const minV = _.state.game.currentBet * 2;
  const maxV = self.chips + self.bet;
  const [value, setValue] = React.useState(minV);
  const [sliderValue, setSliderValue] = React.useState(minV);
  let sendValue = (value) => {
    value = Math.min(value, maxV);
    value = Math.max(value, minV);
    setSliderValue(value);
    setValue(value);
    _.valueCallback(value);
  };

  return (
    <Form>
      <Form.Group as={Row}>
        <Col xs="3">
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => sendValue(e.target.value)}
          />
        </Col>
        <Col xs="9">
          <RangeSlider
            min={_.state.game.currentBet * 2}
            max={maxV}
            value={sliderValue}
            onChange={(e) => sendValue(e.target.value)}
          />
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

  valueCallback = (childValue) => {this.setState({value: childValue})}

  toggleRaiseBar = () => {
    if (this.state.raisebar) {
      this.props._.net.bet(this.state.value)
    }
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
        return <SliderWithInputFormControl state={this.props._} valueCallback={this.valueCallback}/>
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
