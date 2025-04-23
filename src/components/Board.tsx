import React from 'react';
import Square from './Square';
import { Snake, Ladder, Pawn as PawnType } from '../utils/gameTypes';
import { getSquareCoordinates } from '../lib/helper';

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
        const isLadderBottom = ladders.some(l => l.bottom === squareNumber);
        const isLadderTop = ladders.some(l => l.top === squareNumber);
        
        // Filter pawns on this square
        const squarePawns = pawns.filter(p => p.position === squareNumber);
        
        currentRow.push(
          <Square
            key={squareNumber}
            number={squareNumber}
            isSnakeHead={isSnakeHead}
            isSnakeTail={isSnakeTail}
            isLadderBottom={isLadderBottom}
            isLadderTop={isLadderTop}
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

  // Completely revised SVG overlay for snakes and ladders
  const renderSvgOverlay = () => {

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Draw ladders first (so they appear behind snakes) */}
        {ladders.map((ladder, index) => {
          const bottom = getSquareCoordinates(ladder.bottom);
          const top = getSquareCoordinates(ladder.top);
          
          // Draw ladder with parallel lines and rungs
          const angle = Math.atan2(top.y - bottom.y, top.x - bottom.x);
          // const distance = Math.sqrt(Math.pow(top.x - bottom.x, 2) + Math.pow(top.y - bottom.y, 2));
          const offset = 0.5; // Offset for parallel lines
          
          // Calculate offsets for parallel lines
          const dx = offset * Math.sin(angle);
          const dy = offset * Math.cos(angle);
          
          // Calculate endpoints for both sides of ladder
          const x1 = bottom.x - dx;
          const y1 = bottom.y + dy;
          const x2 = bottom.x + dx;
          const y2 = bottom.y - dy;
          const x3 = top.x - dx;
          const y3 = top.y + dy;
          const x4 = top.x + dx;
          const y4 = top.y - dy;
          
          return (
            <g key={`ladder-${index}`}>
              {/* Ladder rails */}
              <line 
                x1={x1} y1={y1} 
                x2={x3} y2={y3} 
                stroke="var(--ladder, #e9b949)" 
                strokeWidth="0.5" 
              />
              <line 
                x1={x2} y1={y2} 
                x2={x4} y2={y4} 
                stroke="var(--ladder, #e9b949)" 
                strokeWidth="0.5" 
              />
            </g>
          );
        })}
        
        {/* Draw snakes with bezier curves */}
        {snakes.map((snake, index) => {
          const head = getSquareCoordinates(snake.head);
          const tail = getSquareCoordinates(snake.tail);
          
          // Create a more snake-like curve with multiple control points
          const dx = tail.x - head.x;
          const dy = tail.y - head.y;
          // const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create wiggly snake path
          const cp1x = head.x + dx * 0.25 + (index % 2 ? 5 : -5);
          const cp1y = head.y + dy * 0.25;
          
          const cp2x = head.x + dx * 0.75 + (index % 2 ? -5 : 5);
          const cp2y = head.y + dy * 0.75;
          
          return (
            <path
              key={`snake-${index}`}
              d={`M ${head.x},${head.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${tail.x},${tail.y}`}
              stroke="var(--snake, #e06c75)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
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