import React from 'react';
import Dice from './Dice';
import { Player } from '../utils/gameTypes';

interface GameControlsProps {
  currentPlayer: Player | undefined;
  diceValue: number | null;
  onRollDice: () => void;
  onRestart: () => void;
  canRollDice: boolean;
  gameEnded: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  diceValue,
  onRollDice,
  onRestart,
  canRollDice,
  gameEnded
}) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 flex flex-col items-center animate-fade-in border border-white border-opacity-20">
      <h3 className="text-lg font-medium mb-2 text-white">
        {currentPlayer ? `${currentPlayer.name}'s Turn` : 'Roll the dice!'}
      </h3>
      
      <Dice
        value={diceValue}
        onRoll={onRollDice}
        disabled={!canRollDice}
      />
      
      {diceValue === null && (
        <p className="text-sm text-white text-opacity-70 mt-2">
          {gameEnded ? '' : 'Roll the dice to play'}
        </p>
      )}
      
      <div className="mt-6 w-full flex flex-col gap-2">
        <button
          onClick={onRestart}
          className="w-full px-4 py-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-all text-white font-medium"
        >
          Restart Game
        </button>
        
        <button
          onClick={() => {
            // Toggle fullscreen
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
              });
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }
          }}
          className="w-full px-4 py-2 bg-white bg-opacity-10 rounded-md hover:bg-opacity-20 transition-all text-white"
        >
          Toggle Fullscreen
        </button>
      </div>
      
      <div className="mt-6 w-full">
        <h4 className="text-sm font-medium mb-2 text-white">Game Rules</h4>
        <ul className="text-xs text-white text-opacity-80 list-disc pl-4 space-y-1">
          <li>Roll the dice on your turn</li>
          <li>Select a pawn to move</li>
          <li>Climb up ladders when you land on them</li>
          <li>Slide down when you land on a snake</li>
          <li>First player to reach square 100 wins!</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
