import React from 'react';
import { Player, MoveHistoryEntry } from '../utils/gameTypes';
import { getColorForPlayer } from '../utils/helper';

interface GameStatsProps {
  players: Player[];
  moveHistory: MoveHistoryEntry[];
  turnCount: number;
  difficulty: string;
}

const GameStats: React.FC<GameStatsProps> = ({
  players,
  moveHistory,
  turnCount,
  difficulty
}) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 animate-fade-in border border-white border-opacity-20">
      <h2 className="text-xl font-bold mb-4 text-white">Game Stats</h2>

      <div className="mb-4">
        <div className="flex justify-between text-white">
          <span>Turn:</span>
          <span className="font-bold">{turnCount}</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Difficulty:</span>
          <span className="font-bold capitalize">{difficulty}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-white">Recent Moves</h3>
        {moveHistory.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...moveHistory].reverse().map((move, index) => (
              <div
                key={index}
                className="text-xs p-2 rounded bg-white bg-opacity-5 text-white border border-white border-opacity-10"
              >
                <div className="font-semibold">{move.playerName}</div>
                <div className="flex justify-between">
                  <span>Rolled:</span>
                  <span className="font-mono">{move.diceValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Moved:</span>
                  <span className="font-mono">{move.fromPosition} → {move.toPosition}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white text-opacity-70">No moves yet</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Player Rankings</h3>
        <div className="space-y-1">
          {[...players]
            .sort((a, b) => {
              const aMaxPos = Math.max(...a.pawns.map(p => p.position));
              const bMaxPos = Math.max(...b.pawns.map(p => p.position));
              return bMaxPos - aMaxPos;
            })
            .map((player, index) => {
              const maxPosition = Math.max(...player.pawns.map(p => p.position));
              const progress = Math.min(100, maxPosition);

              return (
                <div key={player.id} className="text-white">
                  <div className="flex justify-between items-center">
                    <span className={`${index === 0 ? 'font-bold' : ''}`}>
                      {index + 1}. {player.name}
                    </span>
                    <span className="text-xs">{progress}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full bg-${player.color}`}
                      style={{
                        width: `${progress}%`,
                        backgroundColor: getColorForPlayer(player.color)
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default GameStats;
