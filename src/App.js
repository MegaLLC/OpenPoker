import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table';

import './App.css';

// we are gaming

const App = () => (
  <div class = "overall">
    <Container>
      <Row class = "board-container bg-info" style={{height:"25vh"}}>
          <div class="col-10 m-auto bg-success"></div>
      </Row>
      <Row class = "board-container m-auto bg-white" style={{height:"40vh"}}>
          <div class="col-10 m-auto table" style={{height:"100%"}}>
        a
          </div>
          {/* You */}
          <div class="player bg-info" style={{left: "50%", top: "78%"}}></div>
          <div class="player bg-info" style={{left: "32%", top: "78%"}}></div>
          <div class="player bg-info" style={{left: "68%", top: "78%"}}></div>

          {/* right side */}
          <div class="player bg-info" style={{left: "80%", top: "56%"}}></div>
          <div class="player bg-info" style={{left: "80%", top: "30%"}}></div>

          {/* left side */}
          <div class="player bg-info" style={{left: "20%", top: "56%"}}></div>
          <div class="player bg-info" style={{left: "20%", top: "30%"}}></div>

          {/* Top */}
          <div class="player bg-info" style={{left: "62%", top: "12%"}}></div>
          <div class="player bg-info" style={{left: "38%", top: "12%"}}></div>
      </Row>
      <Row class = "board-container m-auto bg-white" style={{height:"35vh"}}></Row>
    </Container>
  </div>
);

export default App; 
