import React from "react";

export default function Die({ value, isHeld, HoldDice }) {
  const styles = {
    backgroundColor: isHeld ? "yellow" : "white",
  };

  return (
    <div className="die-face" onClick={HoldDice} style={styles}>
      <h2 className="die-num">{value}</h2>
    </div>
  );
}
