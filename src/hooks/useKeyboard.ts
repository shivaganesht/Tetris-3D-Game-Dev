import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { DAS_DELAY, ARR_DELAY } from '../lib/constants';

type KeyAction = 'left' | 'right' | 'down' | 'rotate_cw' | 'rotate_ccw' | 'hard_drop' | 'hold' | 'pause';

const KEY_MAP: Record<string, KeyAction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowUp: 'rotate_cw',
  KeyX: 'rotate_cw',
  KeyZ: 'rotate_ccw',
  Space: 'hard_drop',
  KeyC: 'hold',
  ShiftLeft: 'hold',
  KeyP: 'pause',
  Escape: 'pause',
};

export function useKeyboard() {
  const moveLeft = useGameStore((state) => state.moveLeft);
  const moveRight = useGameStore((state) => state.moveRight);
  const moveDown = useGameStore((state) => state.moveDown);
  const rotate = useGameStore((state) => state.rotate);
  const hardDrop = useGameStore((state) => state.hardDrop);
  const holdCurrentPiece = useGameStore((state) => state.holdCurrentPiece);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const gameState = useGameStore((state) => state.gameState);
  
  const pressedKeys = useRef<Set<string>>(new Set());
  const dasTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const arrIntervals = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  
  const clearKeyTimers = useCallback((key: string) => {
    const dasTimer = dasTimers.current.get(key);
    if (dasTimer) {
      clearTimeout(dasTimer);
      dasTimers.current.delete(key);
    }
    
    const arrInterval = arrIntervals.current.get(key);
    if (arrInterval) {
      clearInterval(arrInterval);
      arrIntervals.current.delete(key);
    }
  }, []);
  
  const executeAction = useCallback((action: KeyAction) => {
    switch (action) {
      case 'left':
        moveLeft();
        break;
      case 'right':
        moveRight();
        break;
      case 'down':
        moveDown();
        break;
      case 'rotate_cw':
        rotate(1);
        break;
      case 'rotate_ccw':
        rotate(-1);
        break;
      case 'hard_drop':
        hardDrop();
        break;
      case 'hold':
        holdCurrentPiece();
        break;
      case 'pause':
        if (gameState === 'playing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        }
        break;
    }
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, holdCurrentPiece, pauseGame, resumeGame, gameState]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const action = KEY_MAP[e.code];
    if (!action) return;
    
    // Prevent default for game keys
    e.preventDefault();
    
    // Prevent key repeat from triggering multiple presses
    if (pressedKeys.current.has(e.code)) return;
    pressedKeys.current.add(e.code);
    
    // Execute action immediately
    executeAction(action);
    
    // Setup DAS for movement keys
    if (action === 'left' || action === 'right' || action === 'down') {
      const moveAction = action === 'left' ? moveLeft : action === 'right' ? moveRight : moveDown;
      
      // DAS delay before auto-repeat starts
      const dasTimer = setTimeout(() => {
        // ARR interval for continuous movement
        const arrInterval = setInterval(() => {
          moveAction();
        }, action === 'down' ? ARR_DELAY / 2 : ARR_DELAY);
        
        arrIntervals.current.set(e.code, arrInterval);
      }, DAS_DELAY);
      
      dasTimers.current.set(e.code, dasTimer);
    }
  }, [executeAction, moveLeft, moveRight, moveDown]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    pressedKeys.current.delete(e.code);
    clearKeyTimers(e.code);
  }, [clearKeyTimers]);
  
  // Cleanup on blur
  const handleBlur = useCallback(() => {
    pressedKeys.current.clear();
    dasTimers.current.forEach((_, key) => clearKeyTimers(key));
    arrIntervals.current.forEach((_, key) => clearKeyTimers(key));
  }, [clearKeyTimers]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      handleBlur();
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);
}
