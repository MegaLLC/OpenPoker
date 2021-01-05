import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { ToastContainer } from "react-toastify";
import { sum } from "lodash";

import Card from "./components/Card";
import createPlayerlist from "./components/Player";
import { ControlBox } from "./components/ControlBox";

import { Network } from "./helpers/Networking";
import { defaultState } from "./helpers/Constants";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

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

    button greyed out state.

    Things that are actually state:
    style={this.props.options.alignment}

    DONT FORGET TO LOOK INTO REACT KEYS ON COMPONENT LISTS

    hd and em
*/
const PokerTable = (props) => {
  let pot = 0;
  if (props._.game.pot.length) {
    pot = sum(props._.game.pot.map((potState) => potState.chips));
  }
  return (
    <div className="col-9 m-auto table" style={{ height: "100%" }}>
      {/* Inside table */}
      <Badge variant="info" className="pot-display">
        <h4>{pot}</h4>
      </Badge>
      <div className="board-cards">
        <Card card={props._.game.card1}></Card>
        <Card card={props._.game.card2}></Card>
        <Card card={props._.game.card3}></Card>
        <Card card={props._.game.card4}></Card>
        <Card card={props._.game.card5}></Card>
      </div>
    </div>
  );
};

const DisconnectPopup = (reconnect) => {
  return (
    <Modal show={true} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title className={"w-100 text-center"}>
          <h2>Disconnected</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={"d-flex justify-content-center p-4"}>
        <Button variant="outline-info" onClick={reconnect}>
          Reconnect
        </Button>
      </Modal.Body>
    </Modal>
  );
};

class WholeBoard extends React.Component {
  constructor() {
    super();
    this.state = { net: new Network(this.setState.bind(this)), game: defaultState };
  }

  componentDidMount() {
    this.state.net.connect();
  }

  render() {
    return (
      <div className="overall">
        {!this.state.net.connected && DisconnectPopup(this.state.net.connect.bind(this.state.net))}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Container>
          <Row style={{ height: "25vh" }}>
            <div className="col-10 m-auto bg-success"></div>
          </Row>
          <Row style={{ height: "40vh" }}>
            <PokerTable _={this.state} />
            {createPlayerlist(this.state)}
          </Row>
          <Row style={{ height: "35vh" }}>
            <ControlBox _={this.state} />
          </Row>
        </Container>
      </div>
    );
  }
}

const App = () => <WholeBoard />;

export default App;
