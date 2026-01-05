import { POINTS_PER_LINE, LINES_PER_LEVEL, BASE_DROP_INTERVAL, MIN_DROP_INTERVAL } from './constants';

export function calculateScore(linesCleared: number, level: number, combo: number): number {
  const basePoints = POINTS_PER_LINE[linesCleared] || 0;
  const levelMultiplier = level;
  const comboBonus = combo > 0 ? 50 * combo * level : 0;
  
  return basePoints * levelMultiplier + comboBonus;
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
}

export function getDropInterval(level: number): number {
  // Faster drops at higher levels
  const interval = BASE_DROP_INTERVAL * Math.pow(0.85, level - 1);
  return Math.max(interval, MIN_DROP_INTERVAL);
}
