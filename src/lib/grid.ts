import type { Grid, Cell, Tetromino, Position } from './types';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';
import { getShape } from './tetrominos';

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => null)
  );
}

export function isValidPosition(grid: Grid, piece: Tetromino, offsetX = 0, offsetY = 0): boolean {
  const shape = getShape(piece.type, piece.rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;
        
        // Check bounds
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
          return false;
        }
        
        // Skip if above the grid
        if (newY < 0) continue;
        
        // Check collision with placed pieces
        if (grid[newY][newX] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placePiece(grid: Grid, piece: Tetromino): Grid {
  const newGrid = grid.map(row => [...row]);
  const shape = getShape(piece.type, piece.rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const gridY = piece.position.y + y;
        const gridX = piece.position.x + x;
        if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
          newGrid[gridY][gridX] = piece.type;
        }
      }
    }
  }
  return newGrid;
}

export function clearLines(grid: Grid): { newGrid: Grid; linesCleared: number; clearedRows: number[] } {
  const clearedRows: number[] = [];
  
  // Find full rows
  for (let y = 0; y < GRID_HEIGHT; y++) {
    if (grid[y].every(cell => cell !== null)) {
      clearedRows.push(y);
    }
  }
  
  if (clearedRows.length === 0) {
    return { newGrid: grid, linesCleared: 0, clearedRows: [] };
  }
  
  // Remove full rows and add empty ones at top
  const newGrid = grid.filter((_, index) => !clearedRows.includes(index));
  const emptyRows: Cell[][] = Array.from({ length: clearedRows.length }, () =>
    Array.from({ length: GRID_WIDTH }, () => null)
  );
  
  return {
    newGrid: [...emptyRows, ...newGrid],
    linesCleared: clearedRows.length,
    clearedRows,
  };
}

export function getGhostPosition(grid: Grid, piece: Tetromino): Position {
  let ghostY = piece.position.y;
  
  while (isValidPosition(grid, { ...piece, position: { ...piece.position, y: ghostY + 1 } })) {
    ghostY++;
  }
  
  return { x: piece.position.x, y: ghostY };
}

export function getBlockPositions(piece: Tetromino): Position[] {
  const shape = getShape(piece.type, piece.rotation);
  const positions: Position[] = [];
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        positions.push({
          x: piece.position.x + x,
          y: piece.position.y + y,
        });
      }
    }
  }
  return positions;
}
