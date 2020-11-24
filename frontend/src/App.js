import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-bootstrap-range-slider";

import * as Colyseus from "colyseus.js";
import { Card } from "./components/Card";
import { createPlayerlist } from "./components/Player";

import "./App.css";

/*
React Component Layout

WholeBoard
  PlayerList
    Player
  PokerTable
    PotDisplay
    TableChips
    AllTableCards
      Card
  ControlBox
    <Fold, Call, Raise buttons etc>


    Add mp3 sound when you win on showdown

    button greyed out state.

    Things that are actually state:
    style={this.props.options.alignment}

    DONT FORGET TO LOOK INTO REACT KEYS ON COMPONENT LISTS

    hd and em
*/

// if cards empty conditionally render nothing.

class PokerTable extends React.Component {
  render() {
    return (
      <div className="col-9 m-auto table" style={{ height: "100%" }}>
        {/* Inside table */}
        <Badge variant="info" className="pot-display">
          <h4>{this.props.game.pot}</h4>
        </Badge>
        <div className="board-cards">
          <Card card={this.props.game.card1}></Card>
          <Card card={this.props.game.card2}></Card>
          <Card card={this.props.game.card3}></Card>
          <Card card={this.props.game.card4}></Card>
          <Card card={this.props.game.card5}></Card>
        </div>
      </div>
    );
  }
}

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
class ControlBox extends React.Component {
  state = {
    raisebar: false,
    value: 0
  }

  toggleRaiseBar = () => {
    this.setState (prevState =>({
      raisebar: !prevState.raisebar
    }))
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
            <Button variant="primary" onClick={() => this.props.click()}>Fold</Button>
            <Button variant="secondary">Call</Button>
            <Button variant="success" onClick = {this.toggleRaiseBar}>Raise</Button>
          </div>
      </div>
    );
  }
}

class WholeBoard extends React.Component {
  constructor() {
    super();

    this.colyseus = new Colyseus.Client("ws://localhost:2567");

    this.colyseus.joinOrCreate("main").then((room) => {
      console.log(room.sessionId, "joined", room.name);
      this.gameRoom = room;

      room.onStateChange((state) => {
        console.log(room.name, "has new state:", state);
        this.setState({ game: room.state });
      });
    });
    this.state = {
      game: {
        currentPlayer: 0,
        currentDealer: 0,
        pot: 0,
        currentBet: 0,
        card1: "3d",
        card2: "4s",
        card3: "4d",
        card4: "4c",
        card5: "4h",
        players: [
          { isSeated: true, name: "user0", card1: "Ah", card2: "Ad", chips: 500, bet: 1 },
          { isSeated: true, name: "user1", card1: "Kd", card2: "Kc", chips: 500, bet: 2 },
          { isSeated: true, name: "user2", card1: "Ks", card2: "Ac", chips: 500, bet: 3 },
          { isSeated: true, name: "user3", card1: "Qc", card2: "Qd", chips: 500, bet: 4 },
          { isSeated: true, name: "user4", card1: "Qs", card2: "Qh", chips: 500, bet: 5 },
          { isSeated: true, name: "user5", card1: "Jd", card2: "Js", chips: 500, bet: 6 },
          { isSeated: true, name: "user6", card1: "Jh", card2: "Jc", chips: 500, bet: 7 },
          { isSeated: true, name: "user7", card1: "2c", card2: "2d", chips: 500, bet: 8 },
          { isSeated: true, name: "user8", card1: "em", card2: "2h", chips: 500, bet: 9 },
        ],
      },
    };
  }

  cc() {
    this.gameRoom.send("start");
  }

  render() {
    return (
      <div className="overall">
        <Container>
          <Row style={{ height: "25vh" }}>
            <div className="col-10 m-auto bg-success"></div>
          </Row>
          <Row style={{ height: "40vh" }}>
            <PokerTable game={this.state.game} />
            {createPlayerlist(this.state.game)}
          </Row>
          <Row style={{ height: "35vh" }}>
            <ControlBox click={() => this.cc()} />
          </Row>
        </Container>
      </div>
    );
  }
}

const App = () => <WholeBoard />;

export default App;
