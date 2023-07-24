import React, { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

// Helper function to generate a new die with a random value
function generateNewDie() {
  return {
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
    id: nanoid(),
  };
}

export default function App() {
  // State to manage the dice and game status
  const [dice, setDice] = useState(getDiceNumber());
  const [tenzies, setTenzies] = useState(false);
  const [rollsCount, setRollsCount] = useState(0);
  const [startTime, setStartTime] = useState(null); // Track the game start time
  const [winTime, setWinTime] = useState(null); // Track the time to win

  // Effect to check for a win or set the game start time
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
      setWinTime(Date.now()); // Record the time to win
    } else if (!startTime) {
      // Set the game start time if not set already
      setStartTime(Date.now());
    }
  }, [dice, startTime]);

  // Function to generate an array of dice
  function getDiceNumber() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(generateNewDie());
    }
    return arr;
  }

  // Function to roll the dice
  function rollNumber() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRollsCount((prevRolls) => prevRolls + 1);
    } else {
      setTenzies(false);
      setDice(getDiceNumber());
      setRollsCount(0);
      setStartTime(null); // Reset the game start time
    }
  }

  // Function to toggle holding a die
  function HoldDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die;
      })
    );
  }

  // Map the dice array to Die components
  const diceElements = dice.map((die) => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} HoldDice={() => HoldDice(die.id)} />
  ));

  // Calculate the time taken to win the game
  const timeToWin = tenzies && winTime ? ((winTime - startTime) / 1000).toFixed(2) : null;

  return (
    <main>
      {tenzies && <Confetti />} {/* Show confetti on winning */}
      <h1 className="title">Tenzies Game</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <div className="badge-container">
        <div className="roll-count-badge" data-count={rollsCount}>
          Rolls: {rollsCount}
        </div>
        {tenzies && (
          <div className="time-to-win-badge" data-time={timeToWin}>
            Time to Win: {timeToWin} seconds
          </div>
        )}
      </div>
      <button className="roll-dice" onClick={rollNumber}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
