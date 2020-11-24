import React from "react";
import "./Card.css";

export class Card extends React.Component {
  render() {
    return (
      <div className="card-wrapper">
        <div className="card bg-secondary mx-1">
          <img src={"./cards/hd.svg"} className="card-image card-back" alt=""></img>
          <img src={"./cards/" + this.props.card + ".svg"} className="card-image card-front" alt=""></img>
        </div>
      </div>
    );
  }
}
