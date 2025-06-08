import React from "react";
import { Pawn as PawnType } from "../utils/gameTypes";
import { getPawnSize, getPawnGridClasses } from "../utils/helper";

interface SquareProps {
  number: number;
  isSnakeHead?: boolean;
  isSnakeTail?: boolean;
  pawns: PawnType[];
}

const Square: React.FC<SquareProps> = ({
  number,
  isSnakeHead,
  isSnakeTail,
  pawns,
}) => {
  const isDark =
    Math.floor((number - 1) / 10) % 2 === 0
      ? (number - 1) % 2 === 0
      : (number - 1) % 2 !== 0;

  return (
    <div
      className={`
        relative aspect-square border border-gray-200 flex items-center justify-center
        ${isDark ? "bg-boardDark" : "bg-boardLight"}
        ${number === 1 ? "bg-green-100" : ""}
        ${number === 100 ? "bg-yellow-100" : ""}
      `}
    >
      <span className="absolute top-1 left-1 text-xs md:text-sm font-medium square-number">
        {number}
      </span>

      {/* Snake indicators */}
      {isSnakeHead && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full opacity-50" />
        </div>
      )}
      {isSnakeTail && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full opacity-50" />
        </div>
      )}

      {/* Pawns container with dynamic grid sizing */}
      {pawns.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`grid ${getPawnGridClasses(
              pawns
            )} gap-0.5 p-1 w-full h-full`}
          >
            {pawns.map((pawn) => (
              <svg
                key={pawn.id}
                className={`${getPawnSize(pawns)} z-50 animate-pawn-bounce`}
                viewBox="0 0 32 40"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Pawn base shadow */}
                <ellipse
                  cx="16"
                  cy="36"
                  rx="10"
                  ry="4"
                  fill="#000"
                  opacity="0.12"
                />
                {/* Pawn base */}
                <ellipse
                  cx="16"
                  cy="30"
                  rx="11"
                  ry="7"
                  fill={`var(--${pawn.color})`}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Pawn neck */}
                <rect
                  x="12.5"
                  y="16"
                  width="7"
                  height="14"
                  rx="3.5"
                  fill={`var(--${pawn.color})`}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Pawn head */}
                <circle
                  cx="16"
                  cy="10"
                  r="7"
                  fill={`var(--${pawn.color})`}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Pawn highlight */}
                <ellipse
                  cx="13"
                  cy="7.5"
                  rx="2.2"
                  ry="1.1"
                  fill="#fff"
                  opacity="0.35"
                />
              </svg>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Square;
