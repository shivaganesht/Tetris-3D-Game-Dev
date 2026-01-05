export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Position = {
  x: number;
  y: number;
};

export type Cell = TetrominoType | null;

export type Grid = Cell[][];

export type Tetromino = {
  type: TetrominoType;
  position: Position;
  rotation: number;
  shape: number[][];
};

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

export type GameStore = {
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
};
