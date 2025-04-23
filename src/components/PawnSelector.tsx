
import React from 'react';
import { Pawn } from '../utils/gameTypes';

interface PawnSelectorProps {
  pawns: Pawn[];
  onSelect: (pawnId: string) => void;
  diceValue: number;
}

const PawnSelector: React.FC<PawnSelectorProps> = ({ pawns, onSelect, diceValue }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="bg-white rounded-lg shadow-xl p-4 z-20 max-w-xs w-full animate-fade-in">
        <h3 className="text-lg font-bold mb-4">Select a pawn to move {diceValue} spaces</h3>
        <div className="space-y-2">
          {pawns.map(pawn => (
            <button
              key={pawn.id}
              onClick={() => onSelect(pawn.id)}
              className="w-full p-3 rounded-lg border flex items-center"
              style={{ backgroundColor: `var(--${pawn.color})15` }}
            >
              <div 
                className="w-4 h-4 rounded-full mr-3" 
                style={{ backgroundColor: `var(--${pawn.color})` }}
              />
              <span>Pawn at position {pawn.position}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PawnSelector;
