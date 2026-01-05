import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getDropInterval } from '../lib/scoring';

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const level = useGameStore((state) => state.level);
  const gameState = useGameStore((state) => state.gameState);
  const isClearing = useGameStore((state) => state.isClearing);
  
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  
  useEffect(() => {
    if (gameState !== 'playing' || isClearing) {
      lastTickRef.current = 0;
      return;
    }
    
    const dropInterval = getDropInterval(level);
    
    const gameLoop = (timestamp: number) => {
      if (lastTickRef.current === 0) {
        lastTickRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTickRef.current;
      
      if (elapsed >= dropInterval) {
        tick();
        lastTickRef.current = timestamp;
      }
      
      rafRef.current = requestAnimationFrame(gameLoop);
    };
    
    rafRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [gameState, level, tick, isClearing]);
}
