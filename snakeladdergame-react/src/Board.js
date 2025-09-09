import React from 'react';
import './Board.css';

const Board = ({ playerPos, cpuPos, snakes, ladders, size = 30 }) => {
  const columns = Math.ceil(Math.sqrt(size));
  const rows = Math.ceil(size / columns);
  const tiles = [];

  for (let row = rows - 1; row >= 0; row--) {
    const rowTiles = [];
    for (let col = 0; col < columns; col++) {
      let i = row * columns + col + 1;
      if (row % 2 !== 0) {
        // Reverse the row direction for every other row
        i = (row + 1) * columns - col;
      }

      if (i > size) continue; // Skip if out of bounds

      let content = "";

      if (i === playerPos && i === cpuPos) content = '🧍+🤖';
      else if (i === playerPos) content = '🧍';
      else if (i === cpuPos) content = '🤖';
      else if (snakes[i]) content = '🐍';
      else if (ladders[i]) content = '🪜';

      rowTiles.push(
        <div key={i} className="tile">
          <div className="tile-num">{i}</div>
          <div className="tile-content">{content}</div>
        </div>
      );
    }
    tiles.push(...rowTiles);
  }

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {tiles}
    </div>
  );
};

export default Board;
