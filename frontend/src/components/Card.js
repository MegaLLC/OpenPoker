import React from "react";

// card ratio is 1.4
// ex: 239w x 335h

const Card = (props) => {
  if (props.card && props.card !== "EM") {
    return <img src={"./cards/" + props.card + ".svg"} alt="" className={"h-100 p-2"}></img>;
  } else {
    return <div></div>;
  }
};

export default Card;
