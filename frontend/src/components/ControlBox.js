import React from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import RangeSlider from "react-bootstrap-range-slider";
import Row from "react-bootstrap/Row";

import "./ControlBox.css";

const SliderWithInputFormControl = (_) => {
  return (
    <Form>
      <Form.Group as={Row}>
        <Col xs="3">
          <Form.Control
            value={_.value}
            onChange={(e) => _.setValue(e.target.value)}
            onBlur={(e) => _.sendValue(e.target.value)}
          />
        </Col>
        <Col xs="9">
          <RangeSlider min={_.minV} max={_.maxV} value={_.value} onChange={(e) => _.sendValue(e.target.value)} />
        </Col>
      </Form.Group>
    </Form>
  );
};

// prettier-ignore
export class ControlBox extends React.Component {

  self = 0;
  minV = 0;
  maxV = 0;

  sendValue = (newValue) => {
    newValue = Math.min(newValue, this.maxV);
    newValue = Math.max(newValue, this.minV);
    this.setState({value: newValue})
  };

  setValue = (newValue) => {
    this.setState({value: newValue})
  };

  state = {
    raisebar: false,
    value: Math.min(this.props._.game.currentBet * 2, this.props._.game.players[this.props._.net.seat].chips + this.props._.game.players[this.props._.net.seat].bet)
  }

  toggleRaiseBar = () => {
    if (this.state.raisebar) {
      this.props._.net.bet(this.state.value)
    } else {
      this.setState({value: this.minV});
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

  clearRaiseBar = () => {
    this.setState({raisebar: false});
  }

  render() {
    this.self = this.props._.game.players[this.props._.net.seat];
    this.minV = Math.max(this.props._.game.currentBet * 2, this.props._.game.bigBlind);
    this.minV = Math.min(this.minV, this.self.chips + this.self.bet);
    this.maxV = this.self.chips + this.self.bet;
    const renderRaiseBar = () => {
      if (this.state.raisebar){
        return <SliderWithInputFormControl value={this.state.value} minV={this.minV} maxV={this.maxV} sendValue={this.sendValue} setValue={this.setValue}/>
      }
    }
    const renderControlButton = () =>{
      if (this.props._.game.currentPlayer === this.props._.net.seat){
        return <div className="btn-group">
          <Button variant="danger" onClick={() => this.props._.net.startGame()}>New Hand</Button>
          <Button variant="primary" onClick={() => {this.props._.net.fold(); this.clearRaiseBar()}}>Fold</Button>
      <Button variant="secondary" onClick={() => {this.props._.net.bet(this.props._.game.currentBet); this.clearRaiseBar()}}>{this.getCallorCheck()}</Button>
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
