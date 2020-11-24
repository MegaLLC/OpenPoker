import React from "react";
import Badge from "react-bootstrap/Badge";

import { Card } from "./Card";

import "./Player.css";

export class Player extends React.Component {
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
          <Badge variant="success" className="dealer">
            <h6 class="my-0">D</h6>
          </Badge>
        </div>
        <Badge variant="info" className="table-chip" id={this.props.chipid}>
          <h6>{this.props.options.bet}</h6>
        </Badge>
      </div>
    );
  }
}

export function createPlayerlist(players) {
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
