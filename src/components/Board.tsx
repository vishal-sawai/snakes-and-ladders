import React from 'react';
import Square from './Square';
import { Snake, Ladder, Pawn as PawnType } from '../utils/gameTypes';
import { getSquareCoordinates } from '../utils/helper';

interface BoardProps {
  snakes: Snake[];
  ladders: Ladder[];
  pawns: PawnType[];
}

const Board: React.FC<BoardProps> = ({ snakes, ladders, pawns }) => {
  // Create a 10x10 grid of squares (1-100)
  const renderSquares = () => {
    const squares = [];
    const rows = 10;
    const cols = 10;

    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        // Calculate the square number based on zigzag pattern (boustrophedon)
        // Rows are numbered from bottom to top (9 to 0)
        // Even rows go left to right, odd rows go right to left
        const rowIndex = 9 - row;
        const squareNumber = rowIndex % 2 === 0
          ? (10 * rowIndex) + col + 1
          : (10 * rowIndex) + (9 - col) + 1;

        const isSnakeHead = snakes.some(s => s.head === squareNumber);
        const isSnakeTail = snakes.some(s => s.tail === squareNumber);

        // Filter pawns on this square
        const squarePawns = pawns.filter(p => p.position === squareNumber);

        currentRow.push(
          <Square
            key={squareNumber}
            number={squareNumber}
            isSnakeHead={isSnakeHead}
            isSnakeTail={isSnakeTail}
            pawns={squarePawns}
          />
        );
      }
      squares.push(
        <div key={row} className="grid grid-cols-10 flex-1">
          {currentRow}
        </div>
      );
    }

    return squares;
  };

  // Enhanced SVG overlay for snakes and ladders
  const renderSvgOverlay = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Draw enhanced ladders */}
        {ladders.map((ladder, index) => {
          const bottom = getSquareCoordinates(ladder.bottom);
          const top = getSquareCoordinates(ladder.top);

          // Calculate ladder properties
          const angle = Math.atan2(top.y - bottom.y, top.x - bottom.x);
          const distance = Math.sqrt(Math.pow(top.x - bottom.x, 2) + Math.pow(top.y - bottom.y, 2));
          const rungCount = Math.max(3, Math.floor(distance / 5)); // Determine number of rungs
          const ladderWidth = 1.2; // Width of ladder

          // Calculate offsets for parallel lines
          const dx = (ladderWidth / 2) * Math.sin(angle);
          const dy = (ladderWidth / 2) * Math.cos(angle);

          // Endpoints for both rails of ladder
          const leftRail = {
            x1: bottom.x - dx,
            y1: bottom.y + dy,
            x2: top.x - dx,
            y2: top.y + dy
          };

          const rightRail = {
            x1: bottom.x + dx,
            y1: bottom.y - dy,
            x2: top.x + dx,
            y2: top.y - dy
          };

          // Generate rungs
          const rungs = [];
          for (let i = 0; i <= rungCount; i++) {
            const ratio = i / rungCount;
            const x1 = leftRail.x1 + (leftRail.x2 - leftRail.x1) * ratio;
            const y1 = leftRail.y1 + (leftRail.y2 - leftRail.y1) * ratio;
            const x2 = rightRail.x1 + (rightRail.x2 - rightRail.x1) * ratio;
            const y2 = rightRail.y1 + (rightRail.y2 - rightRail.y1) * ratio;

            rungs.push(
              <line
                key={`rung-${index}-${i}`}
                x1={x1} y1={y1}
                x2={x2} y2={y2}
                stroke="var(--ladder, #e9b949)"
                strokeWidth="0.4"
              />
            );
          }

          // Create ladder glow effect
          return (
            <g key={`ladder-${index}`} className="ladder">
              {/* Shadow/glow effect */}
              <filter id={`ladder-glow-${index}`} x="-10%" y="-10%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 1  0 1 0 0 0.8  0 0 1 0 0  0 0 0 3 0" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <g filter={`url(#ladder-glow-${index})`}>
                {/* Ladder rails */}
                <line
                  x1={leftRail.x1} y1={leftRail.y1}
                  x2={leftRail.x2} y2={leftRail.y2}
                  stroke="var(--ladder, #e9b949)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                <line
                  x1={rightRail.x1} y1={rightRail.y1}
                  x2={rightRail.x2} y2={rightRail.y2}
                  stroke="var(--ladder, #e9b949)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />

                {/* Ladder rungs */}
                {rungs}
              </g>
            </g>
          );
        })}

        {/* Draw enhanced snakes */}
        {snakes.map((snake, index) => {
          const head = getSquareCoordinates(snake.head);
          const tail = getSquareCoordinates(snake.tail);

          // Create control points for snake body
          const dx = tail.x - head.x;
          const dy = tail.y - head.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Amplitude of the snake curves based on distance
          const amplitude = Math.min(5, distance / 8);

          // Control points for main bezier curve
          const cp1x = head.x + dx * 0.25 + (index % 2 ? amplitude : -amplitude);
          const cp1y = head.y + dy * 0.25;

          const cp2x = head.x + dx * 0.75 + (index % 2 ? -amplitude : amplitude);
          const cp2y = head.y + dy * 0.75;

          // Random hue shift for snake color variation
          const hueShift = index * 20;

          return (
            <g key={`snake-${index}`} className="snake">
              {/* Shadow/glow effect */}
              <filter id={`snake-glow-${index}`} x="-10%" y="-10%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0.8  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Main snake body */}
              <path
                d={`M ${head.x},${head.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${tail.x},${tail.y}`}
                stroke={`hsl(${hueShift}, 50%, 50%)`}
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                filter={`url(#snake-glow-${index})`}
              />

              {/* Snake head */}
              <circle
                cx={head.x}
                cy={head.y}
                r="1.2"
                fill={`hsl(${hueShift}, 100%, 40%)`}
              />

              {/* Snake patterns - small circles along body */}
              {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
                // Calculate point along the bezier curve
                const bx = Math.pow(1 - t, 3) * head.x +
                  3 * Math.pow(1 - t, 2) * t * cp1x +
                  3 * (1 - t) * Math.pow(t, 2) * cp2x +
                  Math.pow(t, 3) * tail.x;

                const by = Math.pow(1 - t, 3) * head.y +
                  3 * Math.pow(1 - t, 2) * t * cp1y +
                  3 * (1 - t) * Math.pow(t, 2) * cp2y +
                  Math.pow(t, 3) * tail.y;

                return (
                  <circle
                    key={`pattern-${index}-${i}`}
                    cx={bx}
                    cy={by}
                    r="0.4"
                    fill={`hsl(${hueShift}, 80%, 70%)`}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="relative aspect-square w-full max-w-2xl border border-white border-opacity-20 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-blue-800 to-indigo-900">
      <div className="absolute inset-0 flex flex-col">
        {renderSquares()}
      </div>
      {renderSvgOverlay()}
    </div>
  );
};

export default Board;