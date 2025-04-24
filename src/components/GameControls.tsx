import React from 'react';
import Dice from './Dice';
import { Player, } from '../utils/gameTypes';

interface GameControlsProps {
  currentPlayer: Player | undefined;
  diceValue: number | null;
  onRollDice: () => void;
  onRestart: () => void;
  canRollDice: boolean;
  gameEnded: boolean;
  onSelectPawn?: (pawnId: string) => void; // New prop for pawn selection
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  diceValue,
  onRollDice,
  onRestart,
  canRollDice,
  gameEnded,
  onSelectPawn
}) => {
  // Show pawn selection UI when dice has been rolled
  const showPawnSelection = diceValue !== null && !gameEnded && currentPlayer && onSelectPawn;

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 flex flex-col items-center animate-fade-in border border-white border-opacity-20">
      <h3 className="text-lg font-medium mb-2 text-white">
        {currentPlayer ? `${currentPlayer.name}'s Turn` : 'Roll the dice!'}
      </h3>

      {!showPawnSelection ? (
        <>
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
        </>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white">You rolled:</div>
            <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center text-xl font-bold">
              {diceValue}
            </div>
          </div>

          <div className="mb-2 text-white text-sm">Select a pawn to move:</div>
          <div className="space-y-2 mb-4">
            {currentPlayer?.pawns.map(pawn => (
              <button
                key={pawn.id}
                onClick={() => onSelectPawn?.(pawn.id)}
                className="w-full p-2 rounded-lg border border-white border-opacity-30 flex items-center justify-between transition-all hover:bg-white hover:bg-opacity-10"
              >
                <div className="flex items-center">
                  <div
                    className="w-6 h-6 rounded-full mr-2"
                    style={{ backgroundColor: `var(--${pawn.color})` }}
                  />
                  <span className="text-white">Position {pawn.position}</span>
                </div>
                <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full text-white">
                  → {Math.min(100, pawn.position + diceValue)}
                </div>
              </button>
            ))}
          </div>
        </div>
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

      {!showPawnSelection && (
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
      )}
    </div>
  );
};

export default GameControls;