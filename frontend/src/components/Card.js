import React from "react";
import "./Card.css";

// card ratio is 1.4
// ex: 239w x 335h

export class Card extends React.Component {
  render() {
    return (
      <div className="card-wrapper m-auto">
        <div className="card bg-secondary">
          <img src={"./cards/hd.svg"} className="card-image card-back" alt=""></img>
          <img src={"./cards/" + this.props.card + ".svg"} className="card-image card-front" alt=""></img>
        </div>
      </div>
    );
  }
}
