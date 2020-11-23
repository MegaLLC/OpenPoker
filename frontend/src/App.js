import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import * as Colyseus from "colyseus.js";

import "./App.css";
import "./Card.css";

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
class Player extends React.Component {
  render() {
    return (
      <div>
        <div class="player bg-info" id={this.props.playerid}>
          <div class="board-cards-hand">
            <Card card={this.props.options.card1}></Card>
            <Card card={this.props.options.card2}></Card>
          </div>
          <h5>{this.props.options.username}</h5>
          <h6>{this.props.options.chips}</h6>
        </div>
        <Badge variant="info" className="table-chip" id={this.props.chipid}>
          <h6>{this.props.options.bet}</h6>
        </Badge>
      </div>
    );
  }
}

function createPlayerlist(players) {
  let playerlist = [];
  var dict = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
  };
  for (var i = 0; i <= 8; i++) {
    playerlist.push(<Player options={players[i]} playerid={dict[i] + "player"} chipid={dict[i] + "chip"} />);
  }
  return playerlist;
}

class Card extends React.Component {
  render() {
    return (
      <div class="card-wrapper">
        <div class="card bg-secondary mx-1">
          <img src={"./cards/hd.svg"} class="card-image card-back"></img>
          <img src={"./cards/" + this.props.card + ".svg"} class="card-image card-front"></img>
        </div>
      </div>
    );
  }
}

class PokerTable extends React.Component {
  render() {
    return (
      <div class="col-9 m-auto table" style={{ height: "100%" }}>
        {/* Inside table */}
        <Badge variant="info" className="pot-display">
          <h4>{this.props.game.pot}</h4>
        </Badge>
        <div class="board-cards">
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

// prettier-ignore
class ControlBox extends React.Component {
  render() {
    return (
      <div id="bottomRight">
        <Button variant="primary" onClick={() => this.props.click()}>Fold</Button>{" "}
        <Button variant="secondary">Call</Button>{" "}
        <Button variant="success">Raise</Button>{" "}
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
    console.log("yo");
    this.gameRoom.send("start");
  }

  render() {
    return (
      <div class="overall">
        <Container>
          <Row class="board-container bg-info" style={{ height: "25vh" }}>
            <div class="col-10 m-auto bg-success"></div>
          </Row>
          <Row class="board-container m-auto bg-white" style={{ height: "40vh" }}>
            <PokerTable game={this.state.game} />
            {createPlayerlist(this.state.game.players)}
          </Row>
          <Row class="board-container m-auto bg-white" style={{ height: "35vh" }}>
            <ControlBox click={() => this.cc()} />
          </Row>
        </Container>
      </div>
    );
  }
}

const App = () => <WholeBoard />;

export default App;
