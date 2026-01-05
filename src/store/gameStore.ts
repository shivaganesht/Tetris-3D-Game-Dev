import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Grid, Tetromino, TetrominoType, GameState } from '../lib/types';
import { GRID_WIDTH } from '../lib/constants';
import { createEmptyGrid, isValidPosition, placePiece, clearLines, getGhostPosition } from '../lib/grid';
import { generateBag, getShape, getWallKicks, TETROMINO_SHAPES } from '../lib/tetrominos';
import { calculateScore, calculateLevel } from '../lib/scoring';

interface GameStore {
  // State
  gameState: GameState;
  grid: Grid;
  activePiece: Tetromino | null;
  nextPieces: TetrominoType[];
  holdPiece: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  combo: number;
  clearedRows: number[];
  isClearing: boolean;
  
  // Internal
  bag: TetrominoType[];
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => boolean;
  hardDrop: () => void;
  rotate: (direction: 1 | -1) => void;
  holdCurrentPiece: () => void;
  tick: () => void;
  lockPiece: () => void;
  clearAnimation: () => void;
}

function getSpawnPosition(type: TetrominoType): { x: number; y: number } {
  const shape = TETROMINO_SHAPES[type][0];
  const width = shape[0].length;
  // Find the first row with blocks to determine proper spawn offset
  let firstRowWithBlock = 0;
  for (let y = 0; y < shape.length; y++) {
    if (shape[y].some(cell => cell === 1)) {
      firstRowWithBlock = y;
      break;
    }
  }
  return {
    x: Math.floor((GRID_WIDTH - width) / 2),
    y: -firstRowWithBlock,
  };
}

function createPiece(type: TetrominoType): Tetromino {
  return {
    type,
    position: getSpawnPosition(type),
    rotation: 0,
    shape: TETROMINO_SHAPES[type][0],
  };
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: 'idle',
    grid: createEmptyGrid(),
    activePiece: null,
    nextPieces: [],
    holdPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    clearedRows: [],
    isClearing: false,
    bag: [],

    startGame: () => {
      const bag1 = generateBag();
      const bag2 = generateBag();
      const fullBag = [...bag1, ...bag2];
      
      const firstPiece = fullBag.shift()!;
      const nextPieces = fullBag.splice(0, 4);
      
      set({
        gameState: 'playing',
        grid: createEmptyGrid(),
        activePiece: createPiece(firstPiece),
        nextPieces,
        holdPiece: null,
        canHold: true,
        score: 0,
        level: 1,
        lines: 0,
        combo: 0,
        clearedRows: [],
        isClearing: false,
        bag: fullBag,
      });
    },

    pauseGame: () => {
      if (get().gameState === 'playing') {
        set({ gameState: 'paused' });
      }
    },

    resumeGame: () => {
      if (get().gameState === 'paused') {
        set({ gameState: 'playing' });
      }
    },

    endGame: () => {
      set({ gameState: 'gameover' });
    },

    moveLeft: () => {
      const { grid, activePiece, gameState } = get();
      if (gameState !== 'playing' || !activePiece) return;
      
      if (isValidPosition(grid, activePiece, -1, 0)) {
        set({
          activePiece: {
            ...activePiece,
            position: { ...activePiece.position, x: activePiece.position.x - 1 },
          },
        });
      }
    },

    moveRight: () => {
      const { grid, activePiece, gameState } = get();
      if (gameState !== 'playing' || !activePiece) return;
      
      if (isValidPosition(grid, activePiece, 1, 0)) {
        set({
          activePiece: {
            ...activePiece,
            position: { ...activePiece.position, x: activePiece.position.x + 1 },
          },
        });
      }
    },

    moveDown: () => {
      const { grid, activePiece, gameState } = get();
      if (gameState !== 'playing' || !activePiece) return false;
      
      if (isValidPosition(grid, activePiece, 0, 1)) {
        set({
          activePiece: {
            ...activePiece,
            position: { ...activePiece.position, y: activePiece.position.y + 1 },
          },
        });
        return true;
      }
      return false;
    },

    hardDrop: () => {
      const { grid, activePiece, gameState, score } = get();
      if (gameState !== 'playing' || !activePiece) return;
      
      const ghostPos = getGhostPosition(grid, activePiece);
      const dropDistance = ghostPos.y - activePiece.position.y;
      
      set({
        activePiece: {
          ...activePiece,
          position: ghostPos,
        },
        score: score + dropDistance * 2,
      });
      
      // Lock immediately after hard drop
      get().lockPiece();
    },

    rotate: (direction: 1 | -1) => {
      const { grid, activePiece, gameState } = get();
      if (gameState !== 'playing' || !activePiece) return;
      
      const fromRotation = activePiece.rotation;
      const toRotation = (fromRotation + direction + 4) % 4;
      
      const rotatedPiece: Tetromino = {
        ...activePiece,
        rotation: toRotation,
        shape: getShape(activePiece.type, toRotation),
      };
      
      // Try wall kicks
      const kicks = getWallKicks(activePiece.type, fromRotation, toRotation);
      
      for (const [kickX, kickY] of kicks) {
        if (isValidPosition(grid, rotatedPiece, kickX, -kickY)) {
          set({
            activePiece: {
              ...rotatedPiece,
              position: {
                x: rotatedPiece.position.x + kickX,
                y: rotatedPiece.position.y - kickY,
              },
            },
          });
          return;
        }
      }
    },

    holdCurrentPiece: () => {
      const { activePiece, holdPiece, canHold, gameState, nextPieces, bag } = get();
      if (gameState !== 'playing' || !activePiece || !canHold) return;
      
      if (holdPiece) {
        // Swap with held piece
        set({
          activePiece: createPiece(holdPiece),
          holdPiece: activePiece.type,
          canHold: false,
        });
      } else {
        // Hold current, spawn next
        const newBag = [...bag];
        if (newBag.length < 4) {
          newBag.push(...generateBag());
        }
        
        const nextPiece = nextPieces[0];
        const newNextPieces = [...nextPieces.slice(1), newBag.shift()!];
        
        set({
          activePiece: createPiece(nextPiece),
          holdPiece: activePiece.type,
          nextPieces: newNextPieces,
          bag: newBag,
          canHold: false,
        });
      }
    },

    tick: () => {
      const { gameState, isClearing } = get();
      if (gameState !== 'playing' || isClearing) return;
      
      const moved = get().moveDown();
      if (!moved) {
        get().lockPiece();
      }
    },

    lockPiece: () => {
      const { grid, activePiece, nextPieces, bag, score, level, lines, combo } = get();
      if (!activePiece) return;
      
      // Place piece
      let newGrid = placePiece(grid, activePiece);
      
      // Clear lines
      const { newGrid: clearedGrid, linesCleared, clearedRows } = clearLines(newGrid);
      
      // Calculate score
      const newCombo = linesCleared > 0 ? combo + 1 : 0;
      const scoreGain = linesCleared > 0 
        ? calculateScore(linesCleared, level, newCombo)
        : 0;
      
      const newLines = lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      
      // Spawn next piece
      const newBag = [...bag];
      if (newBag.length < 4) {
        newBag.push(...generateBag());
      }
      
      const nextPiece = nextPieces[0];
      const newNextPieces = [...nextPieces.slice(1), newBag.shift()!];
      const newActivePiece = createPiece(nextPiece);
      
      // Check game over
      if (!isValidPosition(clearedGrid, newActivePiece)) {
        set({ gameState: 'gameover', grid: newGrid });
        return;
      }
      
      if (linesCleared > 0) {
        // Trigger clear animation
        set({
          grid: newGrid,
          clearedRows,
          isClearing: true,
        });
        
        // After animation, update state
        setTimeout(() => {
          set({
            grid: clearedGrid,
            activePiece: newActivePiece,
            nextPieces: newNextPieces,
            bag: newBag,
            score: score + scoreGain,
            level: newLevel,
            lines: newLines,
            combo: newCombo,
            canHold: true,
            clearedRows: [],
            isClearing: false,
          });
        }, 300);
      } else {
        set({
          grid: clearedGrid,
          activePiece: newActivePiece,
          nextPieces: newNextPieces,
          bag: newBag,
          score: score + scoreGain,
          level: newLevel,
          lines: newLines,
          combo: newCombo,
          canHold: true,
        });
      }
    },

    clearAnimation: () => {
      set({ clearedRows: [], isClearing: false });
    },
  }))
);
