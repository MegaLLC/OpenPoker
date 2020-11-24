import React from "react";
import "./Card.css";

export class Card extends React.Component {
  render() {
    return (
      <div class="card-wrapper">
        <div class="card bg-secondary mx-1">
          <img src={"./cards/hd.svg"} class="card-image card-back" alt=""></img>
          <img src={"./cards/" + this.props.card + ".svg"} class="card-image card-front" alt=""></img>
        </div>
      </div>
    );
  }
}
