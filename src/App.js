import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table';

import './App.css';

{/* 
React Component Layout

WholeBoard
  PlayerList
    Player
  PokerTable
    AllTableCards
      TableCard
  ControlBox
    <Fold, Call, Raise buttons etc>

*/}

class Player extends React.Component{
  render () {
    return (
      <div class="player bg-info" style={this.props.alignment}></div>
    );
  }
};

function createPlayerlist(players) {

    let playerlist = []; 
    for (var i = 0; i <= 8; i++){
      playerlist.push(<Player alignment = {players[i].alignment} key = {players[i].seat}/>);
    }
    return playerlist;
}


class PokerTable extends React.Component{
  render () {
    return (
      <div class="col-10 m-auto table" style={{height:"100%"}}>
        {/* Inside table */}
        <div class="board-cards">
          <div class = "card bg-secondary mx-1"><img src="./cards/CLUB-1.svg" class="card-image"></img></div>
          <div class = "card bg-secondary mx-1"><img src="./cards/CLUB-2.svg" class="card-image"></img></div>
          <div class = "card bg-secondary mx-1"><img src="./cards/CLUB-3.svg" class="card-image"></img></div>
          <div class = "card bg-secondary mx-1"><img src="./cards/CLUB-4.svg" class="card-image"></img></div>
          <div class = "card bg-secondary mx-1"><img src="./cards/CLUB-5.svg" class="card-image"></img></div>
        </div>

      </div>
    )
  }
};


class WholeBoard extends React.Component{
  render() {
    return (
       <div class = "overall">
          <Container>
            <Row class = "board-container bg-info" style={{height:"25vh"}}>
              <div class="col-10 m-auto bg-success"></div>
            </Row>
            <Row class = "board-container m-auto bg-white" style={{height:"40vh"}}>
              {createPlayerlist(this.props.players)}
              <PokerTable />
            </Row>
            <Row class = "board-container m-auto bg-white" style={{height:"35vh"}}></Row>
        </Container>
      </div>
    );
  }
};

const App = () => (
  <WholeBoard players={PLAYERS}/>
);


const PLAYERS = [
  {seat: 1, alignment:{left: "50%", top: "78%"}},
  {seat: 2, alignment:{left: "32%", top: "78%"}},
  {seat: 3, alignment:{left: "20%", top: "56%"}},
  {seat: 4, alignment:{left: "20%", top: "30%"}},
  {seat: 5, alignment:{left: "38%", top: "12%"}},
  {seat: 6, alignment:{left: "62%", top: "12%"}},
  {seat: 7, alignment:{left: "80%", top: "30%"}},
  {seat: 8, alignment:{left: "80%", top: "56%"}},
  {seat: 9, alignment:{left: "68%", top: "78%"}},
];


export default App; 
