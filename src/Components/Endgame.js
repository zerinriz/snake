import React from "react";

function Endgame(props) {
  setSpeed(null);
  setGameOver(true);
  if (points > totalPoints) {
    setTotalPoints(points);
  }
  setPoints(0);

  return <div></div>;
}

export default Endgame;
