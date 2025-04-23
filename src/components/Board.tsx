
import React from 'react';
import Square from './Square';
import { Snake, Ladder, Pawn as PawnType } from '../utils/gameTypes';

interface BoardProps {
  snakes: Snake[];
  ladders: Ladder[];
  pawns: PawnType[];
}

const Board: React.FC<BoardProps> = ({ snakes, ladders, pawns }) => {
  // Add animation class to pawns that have moved recently
  const animatedPawns: string[] = [];
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
        const squareNumber = (9 - row) % 2 === 0
          ? (10 * (9 - row)) + col + 1
          : (10 * (9 - row)) + (9 - col) + 1;
        
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

  // SVG overlay for snakes and ladders
  const renderSvgOverlay = () => {
    const getCoordinates = (position: number) => {
      const row = 9 - Math.floor((position - 1) / 10);
      let col;
      
      if (row % 2 === 0) {
        // Even rows (0, 2, 4, 6, 8) go left to right
        col = (position - 1) % 10;
      } else {
        // Odd rows (1, 3, 5, 7, 9) go right to left
        col = 9 - ((position - 1) % 10);
      }
      
      // Return center of the square as percentage (for responsive SVG)
      return {
        x: (col * 10) + 5,
        y: (row * 10) + 5
      };
    };
    
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Snakes */}
        {snakes.map((snake, index) => {
          const head = getCoordinates(snake.head);
          const tail = getCoordinates(snake.tail);
          
          // Create a smooth curve for the snake
          const midX = (head.x + tail.x) / 2;
          const midY = (head.y + tail.y) / 2;
          const controlPoint = `${midX + (index % 2 ? 5 : -5)},${midY + (index % 3 ? 5 : -5)}`;
          
          return (
            <path
              key={`snake-${index}`}
              d={`M${head.x},${head.y} Q${controlPoint} ${tail.x},${tail.y}`}
              stroke="var(--snake)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1 1"
              opacity="0.7"
            />
          );
        })}
        
        {/* Ladders */}
        {ladders.map((ladder, index) => {
          const bottom = getCoordinates(ladder.bottom);
          const top = getCoordinates(ladder.top);
          
          return (
            <line
              key={`ladder-${index}`}
              x1={bottom.x}
              y1={bottom.y}
              x2={top.x}
              y2={top.y}
              stroke="var(--ladder)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          );
        })}
      </svg>
    );
  };
  
  return (
    <div className="relative aspect-square w-full max-w-lg border border-white border-opacity-20 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-blue-800 to-indigo-900">
      <div className="absolute inset-0 flex flex-col">
        {renderSquares()}
      </div>
      {renderSvgOverlay()}
      
      {/* Board title overlay */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm px-4 py-1 rounded-b-lg border-t-0 border border-white border-opacity-20 shadow-lg">
          <h2 className="text-white font-bold text-sm">CLIMB & SLITHER</h2>
        </div>
      </div>
    </div>
  );
};

export default Board;
