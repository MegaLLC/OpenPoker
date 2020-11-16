import React, { useState } from 'react';


import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button';

import './App.css';


/*
class Table extends React.Component{
  render () {
    <Container>
      <Row>
        <Col>
          <svg width={400} height={180}>
      <     rect x={50} y={20} rx={20} ry={20} width={150} height={150} style={{fill: 'red', stroke: 'black', strokeWidth: 5, opacity: '0.5'}} />
          </svg>
        </Col>
      </Row>
    </Container>
  }
};
*/


const App = () => (
  <Container>
    <Row class = "board-container">
        <div class = "board">
          <svg class = "board-svg">
            <rect class = "board-rect" rx={100} ry={100} style={{fill: 'red', stroke: 'black', strokeWidth: 5, opacity: '0.5'}} />
          </svg>
        </div>
    </Row>
  </Container>
);



export default App;


/*
<svg width={400} height={180}>
  <rect x={50} y={20} rx={20} ry={20} width={150} height={150} style={{fill: 'red', stroke: 'black', strokeWidth: 5, opacity: '0.5'}} />
</svg>

const App = () => (
  <Container fluid>
    <Row class = "board-container">
        <Col class = "board-c">
          <svg class="board-svg">
            <rect class = "board" rx={100} ry={100} style={{fill: 'red', stroke: 'black', strokeWidth: 5, opacity: '0.5'}} />
          </svg>
        </Col>
    </Row>
  </Container>
);
*/