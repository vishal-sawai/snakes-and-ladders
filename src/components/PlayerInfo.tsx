
import React from 'react';
import { Player } from '../utils/gameTypes';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
  diceValue: number | null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  player, 
  isCurrentPlayer,
  diceValue 
}) => {
  return (
    <div 
      className={`
        flex items-center space-x-2 p-2 rounded-lg
        ${isCurrentPlayer ? 'ring-2 ring-offset-2' : 'opacity-60'}
      `}
      style={{ 
        backgroundColor: `var(--${player.color})25`,
        ...(isCurrentPlayer ? { '--tw-ring-color': `var(--${player.color})` } : {})
      }}
    >
      <div 
        className="w-4 h-4 rounded-full" 
        style={{ backgroundColor: `var(--${player.color})` }}
      />
      <span className="font-medium">{player.name}</span>
      
      <div className="flex space-x-1 ml-auto">
        {player.pawns.map(pawn => (
          <div 
            key={pawn.id}
            className="flex items-center justify-center text-xs bg-white rounded px-1"
          >
            {pawn.position}
          </div>
        ))}
      </div>
      
      {isCurrentPlayer && diceValue && (
        <div className="ml-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {diceValue}
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;
