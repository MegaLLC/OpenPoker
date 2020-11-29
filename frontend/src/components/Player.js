import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import Card from "./Card";

import "./Player.css";

const Player = (props) => {
  let gameState = props._.game;
  let playerState = gameState.players[props.index];
  let isDealer = props.index === gameState.currentDealer;
  let isSeated = playerState.isSeated;
  let isTurn = props.index === gameState.currentPlayer;

  return (
    <div>
      {isSeated ? (
        <div className={`player ${isTurn ? "bg-warning" : "bg-info"}`} id={props.playerid}>
          {/* Player cards */}
          <div className="board-cards-hand">
            <Card card={playerState.card1}></Card>
            <Card card={playerState.card2}></Card>
          </div>
          <h5>{playerState.name}</h5>
          <h6>{playerState.chips}</h6>
          {/* Dealer button */}
          <Badge variant="warning" className="dealer" style={{ visibility: isDealer ? "visible" : "hidden" }}>
            <h5 className="my-0">D</h5>
          </Badge>
        </div>
      ) : (
        <div className="player bg-info d-flex justify-content-center" id={props.playerid}>
          <Button className="join-button bg-success align-self-center" onClick={() => props._.net.join(props.index)}>
            Join Game
          </Button>
        </div>
      )}
      <Badge variant="info" className="table-chip" id={props.chipid}>
        <h6>{playerState.bet}</h6>
      </Badge>
    </div>
  );
};

export default function createPlayerlist(remoteState) {
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
      <Player _={remoteState} index={i} playerid={dict[i] + "player"} chipid={dict[i] + "chip"} key={i} />
    );
  }
  return playerlist;
}
