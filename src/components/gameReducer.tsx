// src/reducers/gameReducer.ts
import { GameState, GameAction, DifficultyLevel, Pawn } from '../utils/gameTypes';
import {
    generateSnakes,
    generateLadders,
    createPlayers,
    calculateDestination,
    checkWinner,
    getRandomInt
} from '../utils/gameUtils';

export const DIFFICULTY_SETTINGS = {
    easy: { snakes: 6, ladders: 12 },
    normal: { snakes: 9, ladders: 9 },
    hard: { snakes: 12, ladders: 6 }
};

export const initialState: GameState = {
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
    difficulty: 'normal',
};

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_GAME': {
            const difficulty = action.difficulty || 'normal';
            const { snakes: snakeCount, ladders: ladderCount } = DIFFICULTY_SETTINGS[difficulty as DifficultyLevel];

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

            const currentPlayer = state.players[state.currentPlayerIndex];
            let selectedPawn: Pawn = {} as Pawn;
            let destinationPosition = 0;

            // Update players with the moved pawn
            const updatedPlayers = state.players.map(player => {
                const updatedPawns = player.pawns.map(pawn => {
                    if (pawn.id === state.selectedPawnId) {
                        selectedPawn = pawn;
                        destinationPosition = calculateDestination(
                            pawn.position,
                            state.diceValue as number,
                            state.snakes,
                            state.ladders
                        );
                        return { ...pawn, position: destinationPosition };
                    }
                    return pawn;
                });

                return { ...player, pawns: updatedPawns };
            });

            if (!selectedPawn) {
                return state;
            }

            // Create move history entry
            const moveEntry = {
                playerId: currentPlayer.id,
                playerName: currentPlayer.name,
                pawnId: state.selectedPawnId,
                diceValue: state.diceValue,
                fromPosition: selectedPawn.position,
                toPosition: destinationPosition,
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