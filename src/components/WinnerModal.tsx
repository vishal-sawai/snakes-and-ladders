
import React from 'react';
import { Player, MoveHistoryEntry } from '../utils/gameTypes';

interface WinnerModalProps {
  winner: Player;
  onRestart: () => void;
  moveHistory: MoveHistoryEntry[];
  turnCount: number;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onRestart, moveHistory, turnCount }) => {
  // Get the winning move from history
  const winningMove = moveHistory.find(move => move.playerId === winner.id && move.toPosition === 100);
  
  // Get player color
  const getPlayerColor = (playerColor: string): string => {
    const colorMap: Record<string, string> = {
      player1: '#FF5252', // red
      player2: '#4CAF50', // green
      player3: '#2196F3', // blue
      player4: '#FFC107', // yellow
      player5: '#9C27B0'  // purple
    };
    
    return colorMap[playerColor] || '#FFFFFF';
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onRestart} />
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 z-20 max-w-md w-full border border-white border-opacity-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Victory!</h2>
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 shadow-lg"
            style={{ 
              backgroundColor: `${getPlayerColor(winner.color)}25`,
              borderColor: getPlayerColor(winner.color)
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: getPlayerColor(winner.color) }}
            >
              {winner.name.charAt(0)}
            </div>
          </div>
          <p className="text-2xl mb-6 text-white font-bold">{winner.name} wins!</p>
        </div>
        
        <div className="mb-6 bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
          <h3 className="text-lg font-semibold mb-2 text-white">Game Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-white">
            <div className="col-span-1">
              <p className="text-sm text-white text-opacity-70">Total Turns</p>
              <p className="text-xl font-mono">{turnCount}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm text-white text-opacity-70">Winning Move</p>
              <p className="text-xl font-mono">{winningMove ? winningMove.fromPosition + ' → 100' : 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-medium"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
