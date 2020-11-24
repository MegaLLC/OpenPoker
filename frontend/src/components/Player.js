import React from "react";
import Badge from "react-bootstrap/Badge";

import { Card } from "./Card";

import "./Player.css";

export class Player extends React.Component {
  render() {
    let state = this.props.remoteState;
    let playerState = state.players[this.props.index];
    let isDealer = this.props.index === state.currentDealer;

    return (
      <div>
        <div className="player bg-info" id={this.props.playerid}>
          <div className="board-cards-hand">
            <Card card={playerState.card1}></Card>
            <Card card={playerState.card2}></Card>
          </div>
          <h5>{playerState.username}</h5>
          <h6>{playerState.chips}</h6>
          {/* Dealer Button */}
          <Badge variant="warning" className="dealer" style={{ visibility: isDealer ? "visible" : "hidden" }}>
            <h5 className="my-0">D</h5>
          </Badge>
        </div>
        <Badge variant="info" className="table-chip" id={this.props.chipid}>
          <h6>{playerState.bet}</h6>
        </Badge>
      </div>
    );
  }
}

export function createPlayerlist(remoteState) {
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
    playerlist.push(
      <Player remoteState={remoteState} index={i} playerid={dict[i] + "player"} chipid={dict[i] + "chip"} />
    );
  }
  return playerlist;
}
