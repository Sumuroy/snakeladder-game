import React, { useState, useEffect } from 'react';
import Board from './Board';
import './App.css';
import diceRoll from './assets/dice_roll.mp3';
import snakeHiss from './assets/snake_hiss.mp3';
import ladderClimb from './assets/ladder_climb.mp3';
import winFanfare from './assets/win_fanfare.mp3';

const App = () => {
  const [playerPos, setPlayerPos] = useState(1);
  const [cpuPos, setCpuPos] = useState(1);
  const [turn, setTurn] = useState("Player");
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("🎮 Game Start: Your Turn");
  const [diceFace, setDiceFace] = useState(null);
  const [muted, setMuted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53,
    62: 19, 64: 60, 87: 24, 93: 73,
    95: 75, 98: 78
  };

  const ladders = {
    1: 38, 4: 14, 9: 31, 21: 42,
    28: 84, 36: 44, 51: 67, 71: 91,
    80: 100
  };

  const diceEmoji = {
    1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅",
  };

  const playSound = (sound) => {
    if (!muted) new Audio(sound).play();
  };

  const handleMove = async (position, setPositionFn, isPlayer) => {
    const res = await fetch('http://localhost:5000/roll');
    const data = await res.json();
    const roll = data.roll;

    playSound(diceRoll);
    setDiceFace(roll);
    setMessage(`${isPlayer ? "🧍 You" : "🤖 Computer"} rolled a ${roll}`);

    let newPos = position + roll;
    if (newPos > 100) newPos = position;

    setTimeout(() => {
      if (snakes[newPos]) {
        newPos = snakes[newPos];
        playSound(snakeHiss);
      } else if (ladders[newPos]) {
        newPos = ladders[newPos];
        playSound(ladderClimb);
      }

      if (newPos === 100) {
        playSound(winFanfare);
        setMessage(`${isPlayer ? "🧍 You" : "🤖 Computer"} win the game! 🎉`);
        setPlayerPos(1);
        setCpuPos(1);
        setTurn("Player");
        setRolling(false);
        setDiceFace(null);
        return;
      }

      setPositionFn(newPos);
      const nextTurn = isPlayer ? "CPU" : "Player";
      setTurn(nextTurn);
      setMessage(`${nextTurn === "Player" ? "🧍 Your Turn" : "🤖 Computer's Turn"}`);
      setRolling(false);
    }, 800);
  };

  const handlePlayerRoll = async () => {
    if (turn !== "Player" || rolling) return;
    setRolling(true);
    await handleMove(playerPos, setPlayerPos, true);
  };

  useEffect(() => {
    if (turn === "CPU" && !rolling && gameStarted) {
      setRolling(true);
      setTimeout(() => handleMove(cpuPos, setCpuPos, false), 1000);
    }
  }, [turn, gameStarted]);

  return (
    <div className="container">
      <h1>🎲 Snake and Ladder</h1>

      {!gameStarted ? (
        <div className="start-screen">
          <h2>Welcome to Snake and Ladder 🐍🪜</h2>
          <button onClick={() => setGameStarted(true)}>🎮 Play Game</button>
        </div>
      ) : (
        <>
          <div className="controls">
            <p className="turn-message">{message}</p>
            <button onClick={() => setMuted(!muted)}>
              {muted ? "🔇 Unmute" : "🔊 Mute"}
            </button>
          </div>

          {diceFace && (
            <div className="dice-display">
              <span className="dice-symbol">{diceEmoji[diceFace]}</span>
            </div>
          )}

          <Board
            playerPos={playerPos}
            cpuPos={cpuPos}
            snakes={snakes}
            ladders={ladders}
            size={100}
          />

          <button onClick={handlePlayerRoll} disabled={turn !== "Player" || rolling}>
            {rolling ? "Rolling..." : "Roll Dice 🎲"}
          </button>
        </>
      )}
    </div>
  );
};

export default App;
