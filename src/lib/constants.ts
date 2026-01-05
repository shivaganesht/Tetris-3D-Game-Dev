// Grid dimensions
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const BLOCK_SIZE = 1;

// Timing (ms)
export const BASE_DROP_INTERVAL = 1000;
export const MIN_DROP_INTERVAL = 50;
export const SOFT_DROP_INTERVAL = 50;
export const LOCK_DELAY = 500;

// Scoring
export const POINTS_PER_LINE: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};
export const LINES_PER_LEVEL = 10;

// Controls
export const DAS_DELAY = 170; // Delayed Auto Shift initial delay
export const ARR_DELAY = 50;  // Auto Repeat Rate

// Colors - Futuristic neon palette
export const TETROMINO_COLORS: Record<string, string> = {
  I: '#00f5ff', // Cyan
  O: '#ffd700', // Gold
  T: '#bf00ff', // Purple
  S: '#39ff14', // Neon Green
  Z: '#ff073a', // Neon Red
  J: '#1e90ff', // Dodger Blue
  L: '#ff6600', // Orange
};

export const GHOST_OPACITY = 0.2;
export const BOARD_COLOR = '#0a0a0f';
export const GRID_LINE_COLOR = '#1a1a2e';
