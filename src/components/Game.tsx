import React, { useReducer, useEffect } from 'react';
import Board from './Board';
import PlayerInfo from './PlayerInfo';
import PawnSelector from './PawnSelector';
import WinnerModal from './WinnerModal';
import PlayerSetup from './PlayerSetup';
import GameStats from './GameStats';
import GameControls from './GameControls';
import { GameState, GameAction } from '../utils/gameTypes';
import {
  generateSnakes,
  generateLadders,
  createPlayers,
  calculateDestination,
  checkWinner,
  getRandomInt
} from '../utils/gameUtils';

// Keys for localStorage
const GAME_STATE_KEY = 'Snakes-and-ladders';

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  diceValue: null,
  snakes: [],
  ladders: [],
  selectedPawnId: null,
  winner: null,
  gameStarted: false,
  gameEnded: false,
  moveHistory: [],
  turnCount: 0,
  difficulty: 'normal'
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      // Adjust number of snakes and ladders based on difficulty
      const difficulty = action.difficulty || 'normal';
      let snakeCount = 9;
      let ladderCount = 9;
      
      if (difficulty === 'easy') {
        snakeCount = 6;
        ladderCount = 12;
      } else if (difficulty === 'hard') {
        snakeCount = 12;
        ladderCount = 6;
      }
      
      const snakes = generateSnakes(snakeCount);
      const ladders = generateLadders(ladderCount, snakes);
      const players = createPlayers(action.players);
      
      return {
        ...state,
        players,
        snakes,
        ladders,
        gameStarted: true,
        gameEnded: false,
        winner: null,
        currentPlayerIndex: 0,
        diceValue: null,
        selectedPawnId: null,
        moveHistory: [],
        turnCount: 0,
        difficulty
      };
    }
    
    case 'ROLL_DICE': {
      return {
        ...state,
        diceValue: getRandomInt(1, 6)
      };
    }
    
    case 'SELECT_PAWN': {
      return {
        ...state,
        selectedPawnId: action.pawnId
      };
    }
    
    case 'MOVE_PAWN': {
      if (!state.selectedPawnId || state.diceValue === null) {
        return state;
      }
      
      // Find the current player and selected pawn
      const currentPlayer = state.players[state.currentPlayerIndex];
      let selectedPawn = null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let selectedPawnIndex = -1;
      
      // Find and update the selected pawn
      const updatedPlayers = state.players.map(player => {
        const updatedPawns = player.pawns.map((pawn, index) => {
          if (pawn.id === state.selectedPawnId) {
            selectedPawn = pawn;
            selectedPawnIndex = index;
            const newPosition = calculateDestination(
              pawn.position,
              state.diceValue as number,
              state.snakes,
              state.ladders
            );
            return { ...pawn, position: newPosition };
          }
          return pawn;
        });
        
        return { ...player, pawns: updatedPawns };
      });
      
      // Create move history entry
      const moveEntry = {
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        pawnId: state.selectedPawnId,
        diceValue: state.diceValue,
        fromPosition: selectedPawn ? selectedPawn.position : 0,
        toPosition: selectedPawn ? calculateDestination(
          selectedPawn.position,
          state.diceValue as number,
          state.snakes,
          state.ladders
        ) : 0,
        turn: state.turnCount
      };
      
      const winner = checkWinner(updatedPlayers);
      
      return {
        ...state,
        players: updatedPlayers,
        selectedPawnId: null,
        winner,
        gameEnded: winner !== null,
        moveHistory: [...state.moveHistory, moveEntry]
      };
    }
    
    case 'NEXT_TURN': {
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        diceValue: null,
        turnCount: state.turnCount + 1
      };
    }
    
    case 'RESET_GAME': {
      return initialState;
    }
    
    default:
      return state;
  }
}

// Function to load saved game state
const loadSavedGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading saved game:', error);
  }
  return null;
};

// Function to save game state
const saveGameState = (state: GameState) => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game:', error);
  }
};

const Game: React.FC = () => {
  // Initialize with saved state or initial state
  const [state, dispatch] = useReducer(gameReducer, loadSavedGameState() || initialState);
  
  const {
    players,
    currentPlayerIndex,
    diceValue,
    snakes,
    ladders,
    selectedPawnId,
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
  }, [state]);
  
  // Get all pawns for all players
  const allPawns = players.flatMap(player => player.pawns);
  
  // Get current player
  const currentPlayer = players[currentPlayerIndex];
  
  // Auto-move pawn and advance to next turn after pawn selection
  useEffect(() => {
    if (selectedPawnId) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        dispatch({ type: 'MOVE_PAWN' });
        
        // Check if game ended after move
        if (!gameEnded) {
          const nextTurnTimer = setTimeout(() => {
            dispatch({ type: 'NEXT_TURN' });
          }, 500);
          
          return () => clearTimeout(nextTurnTimer);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedPawnId, gameEnded]);
  
  // Handle game start
  const handleStartGame = (playerCount: number, difficulty: string) => {
    dispatch({ type: 'START_GAME', players: playerCount, difficulty });
  };
  
  // Handle dice roll
  const handleRollDice = () => {
    dispatch({ type: 'ROLL_DICE' });
  };
  
  // Handle pawn selection
  const handlePawnSelect = (pawnId: string) => {
    dispatch({ type: 'SELECT_PAWN', pawnId });
  };
  
  // Handle game restart
  const handleRestart = () => {
    localStorage.removeItem(GAME_STATE_KEY);
    dispatch({ type: 'RESET_GAME' });
  };
  
  // Determine if the current player can roll the dice
  const canRollDice = gameStarted && !gameEnded && diceValue === null;
  
  // Get the current player's pawns for selection
  const currentPlayerPawns = currentPlayer?.pawns || [];
  
  // Show pawn selector if dice has been rolled but no pawn selected yet
  const showPawnSelector = diceValue !== null && selectedPawnId === null && !gameEnded;
  
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
            currentPlayerIndex={currentPlayerIndex}
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
          
          <GameControls
            currentPlayer={currentPlayer}
            diceValue={diceValue}
            onRollDice={handleRollDice}
            onRestart={handleRestart}
            canRollDice={canRollDice}
            gameEnded={gameEnded}
          />
        </div>
      </div>
      
      {/* Pawn selector modal */}
      {showPawnSelector && (
        <PawnSelector
          pawns={currentPlayerPawns}
          onSelect={handlePawnSelect}
          diceValue={diceValue as number}
        />
      )}
      
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

export default Game;
