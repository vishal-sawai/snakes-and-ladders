// src/hooks/useGameState.ts
import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { loadSavedGameState, removeSavedGameState } from '../utils/helper';
import { gameReducer, initialState } from '../components/gameReducer';

export const MOVE_DELAY = 500; // milliseconds

export function useGameState() {
    // Initialize with saved state or initial state
    const [state, dispatch] = useReducer(gameReducer, undefined, () => {
        return loadSavedGameState() || initialState;
    });

    const {
        players,
        selectedPawnId,
        gameEnded,
    } = state;

    // Memoize all pawns to prevent unnecessary recalculation
    const allPawns = useMemo(() =>
        players.flatMap(player => player.pawns),
        [players]
    );

    // Auto-move pawn and advance to next turn after pawn selection
    useEffect(() => {
        if (!selectedPawnId) return;

        // Small delay for better UX
        const moveTimer = setTimeout(() => {
            dispatch({ type: 'MOVE_PAWN' });

            // Check if game ended after move and advance to next turn if not
            if (!gameEnded) {
                const nextTurnTimer = setTimeout(() => {
                    dispatch({ type: 'NEXT_TURN' });
                }, MOVE_DELAY);

                return () => clearTimeout(nextTurnTimer);
            }
        }, MOVE_DELAY);

        return () => clearTimeout(moveTimer);
    }, [selectedPawnId, gameEnded]);

    // Use callbacks for event handlers to prevent unnecessary re-renders
    const handleStartGame = useCallback((playerCount: number, difficulty: string) => {
        dispatch({ type: 'START_GAME', players: playerCount, difficulty });
    }, []);

    const handleRollDice = useCallback(() => {
        dispatch({ type: 'ROLL_DICE' });
    }, []);

    const handlePawnSelect = useCallback((pawnId: string) => {
        dispatch({ type: 'SELECT_PAWN', pawnId });
    }, []);

    const handleRestart = useCallback(() => {
        removeSavedGameState();
        dispatch({ type: 'RESET_GAME' });
    }, []);

    return {
        state,
        dispatch,
        handleStartGame,
        handleRollDice,
        handlePawnSelect,
        handleRestart,
        allPawns,
    };
}