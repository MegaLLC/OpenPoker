import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";

import * as Colyseus from "colyseus.js";

import { Card } from "./components/Card";
import { createPlayerlist } from "./components/Player";
import { ControlBox } from "./components/ControlBox";

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

class WholeBoard extends React.Component {
  constructor() {
    super();

    this.colyseus = new Colyseus.Client("ws://localhost:2567");

    this.colyseus.joinOrCreate("main").then((room) => {
      console.log(room.sessionId, "joined", room.name);

      room.onStateChange((state) => {
        console.log(room.name, "has new state:", state);
        this.setState({ game: room.state, room: room });
      });
    });
  }

  render() {
    return (
      this.state && (
        <div className="overall">
          <Container>
            <Row style={{ height: "25vh" }}>
              <div className="col-10 m-auto bg-success"></div>
            </Row>
            <Row style={{ height: "40vh" }}>
              <PokerTable game={this.state.game} />
              {createPlayerlist(this.state)}
            </Row>
            <Row style={{ height: "35vh" }}>
              <ControlBox room={this.state.room} />
            </Row>
          </Container>
        </div>
      )
    );
  }
}

const App = () => <WholeBoard />;

export default App;
