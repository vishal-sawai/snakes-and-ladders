// Game.tsx
import React, { useEffect } from 'react';
import Board from './Board';
import PlayerInfo from './PlayerInfo';
import WinnerModal from './WinnerModal';
import PlayerSetup from './PlayerSetup';
import GameStats from './GameStats';
import GameControls from './GameControls';
import { useGameState } from '../hooks/useGameState';
import { saveGameState } from '../utils/helper';
import { Player } from '../utils/gameTypes';

const Game: React.FC = () => {
  const {
    state,
    handleStartGame,
    handleRollDice,
    handlePawnSelect,
    handleRestart,
    allPawns
  } = useGameState();

  const {
    players,
    currentPlayerIndex,
    diceValue,
    snakes,
    ladders,
    winner,
    gameStarted,
    gameEnded,
    moveHistory,
    turnCount,
    difficulty
  } = state;

  // Save game state whenever it changes
  useEffect(() => {
    if (gameStarted) {
      saveGameState(state);
    }
  }, [gameStarted, state]);

  // Get current player
  const currentPlayer = players[currentPlayerIndex];

  // Determine if the current player can roll the dice
  const canRollDice = gameStarted && !gameEnded && diceValue === null;

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 p-4">
        <PlayerSetup onStart={handleStartGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-900 to-indigo-800 p-4 game-container">
      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Left sidebar - Game stats */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <GameStats
            players={players}
            moveHistory={moveHistory.slice(-5)}
            turnCount={turnCount}
            difficulty={difficulty}
          />
        </div>

        {/* Game board - Center */}
        <div className="flex-1 flex items-center justify-center p-2 game-board">
          <Board
            snakes={snakes}
            ladders={ladders}
            pawns={allPawns}
          />
        </div>

        {/* Right sidebar - Game controls */}
        <div className="w-full md:w-72 flex flex-col gap-4 game-controls">
          <PlayersPanel
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            diceValue={diceValue}
          />

          <GameControls
            currentPlayer={currentPlayer}
            diceValue={diceValue}
            onRollDice={handleRollDice}
            onRestart={handleRestart}
            canRollDice={canRollDice}
            gameEnded={gameEnded}
            onSelectPawn={diceValue !== null ? handlePawnSelect : undefined}
          />
        </div>
      </div>

      {/* Winner modal */}
      {winner && (
        <WinnerModal
          winner={winner}
          onRestart={handleRestart}
          moveHistory={moveHistory}
          turnCount={turnCount}
        />
      )}
    </div>
  );
};

// Extract players panel into its own component
const PlayersPanel: React.FC<{
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
}> = ({ players, currentPlayerIndex, diceValue }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 mb-4 animate-fade-in border border-white border-opacity-20">
      <h2 className="text-xl font-bold mb-4 text-white">Players</h2>
      <div className="space-y-2">
        {players.map((player, index) => (
          <PlayerInfo
            key={player.id}
            player={player}
            isCurrentPlayer={index === currentPlayerIndex}
            diceValue={index === currentPlayerIndex ? diceValue : null}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;