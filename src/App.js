import React, { useState } from 'react';
import "./App.css"

const Chessboard = ({ rows, cols, bishopPosition, horsePosition, inactiveCells }) => {
  const [meetingPoints, setMeetingPoints] = useState([]);

  const isInvalidCell = (x, y) => inactiveCells.some(cell => cell[0] === x && cell[1] === y);

  const findMeetingPoints = () => {
    const horseMoves = [
      [-2, 1],
      [-1, 2],
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
    ];

    const visited = new Set();

    const bishopQueue = [{ x: bishopPosition[0], y: bishopPosition[1], animal: 'B' }];
    const horseQueue = [{ x: horsePosition[0], y: horsePosition[1], animal: 'H' }];

    while (bishopQueue.length > 0 && horseQueue.length > 0) {
      const bishop = bishopQueue.shift();
      const horse = horseQueue.shift();

      const { x: bx, y: by, animal: bAnimal } = bishop;
      const { x: hx, y: hy, animal: hAnimal } = horse;

      const key = `${bx},${by},${hx},${hy}`;

      if (visited.has(key)) {
        continue;
      }

      visited.add(key);

      if (bx === hx && by === hy) {
        setMeetingPoints(points => [...points, [bx, by]]);
      }

      const moves = bAnimal === 'H' ? horseMoves : [[-1, -1], [-1, 1], [1, -1], [1, 1]];

      for (const [dx, dy] of moves) {
        const nbx = bx + dx;
        const nby = by + dy;

        if (nbx >= 0 && nbx < rows && nby >= 0 && nby < cols && !isInvalidCell(nbx, nby)) {
          bishopQueue.push({ x: nbx, y: nby, animal: bAnimal });
        }
      }

      for (const [dx, dy] of horseMoves) {
        const nhx = hx + dx;
        const nhy = hy + dy;

        if (nhx >= 0 && nhx < rows && nhy >= 0 && nhy < cols && !isInvalidCell(nhx, nhy)) {
          horseQueue.push({ x: nhx, y: nhy, animal: hAnimal });
        }
      }
    }
  };

  return (
    <div id='body'>
      
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 50px)` }}>
        {Array.from({ length: rows }).map((_, x) => (
          Array.from({ length: cols }).map((_, y) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid #ccc',
                backgroundColor:
                  meetingPoints.some(point => point[0] === x && point[1] === y)
                    ? 'yellow'
                    : isInvalidCell(x, y)
                    ? 'gray'
                    : '',
              }}
            >
              {bishopPosition[0] === x && bishopPosition[1] === y ? 'B' : ''}
              {horsePosition[0] === x && horsePosition[1] === y ? 'H' : ''}
            </div>
          ))
        ))}
      </div>
      <button onClick={findMeetingPoints}>Find Meeting Points</button>
    </div>
  );
};

const App = () => {
  const rows = 8;
  const cols = 8;
  const bishopPosition = [3, 2];
  const horsePosition = [6, 6];
  const inactiveCells = [[0, 3], [0,7],[2,0],[2,6],[4,3],[6,7],[7,1]];

  return (
    <div>
      <Chessboard
        rows={rows}
        cols={cols}
        bishopPosition={bishopPosition}
        horsePosition={horsePosition}
        inactiveCells={inactiveCells}
      />
    </div>
  );
};

export default App;
