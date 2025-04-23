
import React, { useState } from 'react';
import { getColorForPlayer } from '../lib/helper';

interface PlayerSetupProps {
  onStart: (playerCount: number, difficulty: string) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<string>('normal');
  
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-md w-full border border-white border-opacity-20">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Snakes And Ladder</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">
          Number of Players (2-5):
        </label>
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            disabled={playerCount <= 2}
          >
            -
          </button>
          <span className="text-xl font-bold text-white">{playerCount}</span>
          <button
            onClick={() => setPlayerCount(Math.min(5, playerCount + 1))}
            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            disabled={playerCount >= 5}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">
          Difficulty:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['easy', 'normal', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`py-2 rounded-lg capitalize transition-colors ${difficulty === level
                ? 'bg-white bg-opacity-30 text-white font-medium'
                : 'bg-white bg-opacity-10 text-white text-opacity-70 hover:bg-opacity-20'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {[...Array(playerCount)].map((_, index) => (
          <div 
            key={index}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            style={{ backgroundColor: getColorForPlayer(`player${index + 1}`) }}
          >
            P{index + 1}
          </div>
        ))}
      </div>
      
      <div className="text-sm text-white text-opacity-80 mb-6 bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-10">
        <p className="mb-1">• 10x10 board with snakes and ladders</p>
        <p className="mb-1">• Each player gets 2 pawns</p>
        <p className="mb-1">• {difficulty === 'easy' ? 'More ladders, fewer snakes' : difficulty === 'hard' ? 'More snakes, fewer ladders' : 'Balanced snakes and ladders'}</p>
        <p>• First to reach square 100 wins!</p>
      </div>
      
      <button
        onClick={() => onStart(playerCount, difficulty)}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-medium"
      >
        Start Game
      </button>
    </div>
  );
};

export default PlayerSetup;
