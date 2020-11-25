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

  startGame(room) {
    room.send("start");
  }

  bet(room) {
    room.send("bet", 0);
  }

  fold(room) {
    room.send("fold");
  }

  render() {
    const renderRaiseBar = () =>{
      if (this.state.raisebar){
        return <SliderWithInputFormControl />
      }
    }
    return (
      <div id="bottomRight">
          {renderRaiseBar()}
          <div className="btn-group special">
            <Button variant="primary" onClick={() => this.fold(this.props.room)}>Fold</Button>
            <Button variant="secondary" onClick={() => this.startGame(this.props.room)}>Call</Button>
            <Button variant="success" onClick = {this.toggleRaiseBar}>Raise</Button>
          </div>
      </div>
    );
  }
}
