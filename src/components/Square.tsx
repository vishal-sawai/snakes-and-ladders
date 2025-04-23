import React from 'react';
import { Pawn as PawnType } from '../utils/gameTypes';
import { getPawnSize, getPawnGridClasses } from '../lib/helper';

interface SquareProps {
  number: number;
  isSnakeHead?: boolean;
  isSnakeTail?: boolean;
  isLadderBottom?: boolean;
  isLadderTop?: boolean;
  pawns: PawnType[];
}

const Square: React.FC<SquareProps> = ({
  number,
  isSnakeHead,
  isSnakeTail,
  isLadderBottom,
  isLadderTop,
  pawns,
}) => {
  const isDark = (Math.floor((number - 1) / 10) % 2 === 0) ? 
                 ((number - 1) % 2 === 0) : 
                 ((number - 1) % 2 !== 0);
  
  return (
    <div 
      className={`
        relative aspect-square border border-gray-200 flex items-center justify-center
        ${isDark ? 'bg-boardDark' : 'bg-boardLight'}
        ${number === 1 ? 'bg-green-100' : ''}
        ${number === 100 ? 'bg-yellow-100' : ''}
      `}
    >
      <span className="absolute top-1 left-1 text-xs md:text-sm font-medium square-number">{number}</span>
      
      {/* Snake indicators */}
      {isSnakeHead && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full opacity-50" />
        </div>
      )}
      {isSnakeTail && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full opacity-50" />
        </div>
      )}
      
      {/* Ladder indicators */}
      {isLadderBottom && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-1 md:w-6 md:h-2 bg-green-500 opacity-100" />
        </div>
      )}
      {isLadderTop && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-1 md:w-6 md:h-2 bg-green-500 opacity-100" />
        </div>
      )}
      
      {/* Pawns container with dynamic grid sizing */}
      {pawns.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`grid ${getPawnGridClasses(pawns)} gap-0.5 p-1 w-full h-full`}>
            {pawns.map((pawn) => (
              <div
                key={pawn.id}
                className={`${getPawnSize(pawns)} rounded-full border border-white pawn animate-pawn-bounce z-50 shadow-sm`}
                style={{ backgroundColor: `var(--${pawn.color})` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Square;