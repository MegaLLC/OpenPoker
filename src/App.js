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
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr class = "board-table-row">
                  <td>1</td>
                  <td>Mark</td>
                  <td>
                    <Table>
                      <tr class = "board-table-row">
                        <td>a</td>
                        <td>b</td>
                        <td>c</td>
                        <td>d</td>
                        <td>e</td>
                      </tr>
                    </Table>
                  </td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr class = "board-table-row">
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </Table>
          </div>
      </Row>
    </Container>
  </div>
);

export default App; 