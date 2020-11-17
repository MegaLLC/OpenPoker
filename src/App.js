import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table';

import './App.css';

const App = () => (
  <div class = "overall">
    <Container>
      <Row class = "board-container">
          <div class = "board">
            <Table id = "board-table">
              <thead>
                <tr class = "board-table-row">
                  <th></th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Player 3</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr class = "board-table-row">
                  <td>Player 4</td>
                  <td></td>
                  <td>
                    <Table>
                      <tr class = "board-table-row">
                        <td>
                          <img src = "./cards/CLUB-1.svg" class = "board-card"></img>
                        </td>
                        <td>
                          <img src = "./cards/HEART-11-JACK.svg" class = "board-card"></img>
                        </td>
                        <td>
                          <img src = "./cards/CLUB-3.svg" class = "board-card"></img>
                        </td>
                        <td>
                          <img src = "./cards/CLUB-4.svg" class = "board-card"></img>
                        </td>
                        <td>
                          <img src = "./cards/CLUB-5.svg" class = "board-card"></img>
                        </td>
                      </tr>
                    </Table>
                  </td>
                  <td></td>
                  <td>Player 8</td>
                </tr>
                <tr class = "board-table-row">
                  <td></td>
                  <td>Player 5</td>
                  <td>Player 6</td>
                  <td>Player 7</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
      </Row>
    </Container>
  </div>
);

export default App; 