import { useMemo } from 'react';
import { Block } from './Block';
import type { Tetromino } from '../../lib/types';
import { getGhostPosition, getBlockPositions } from '../../lib/grid';
import { useGameStore } from '../../store/gameStore';
import { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE } from '../../lib/constants';

export function GhostPiece() {
  const grid = useGameStore((state) => state.grid);
  const activePiece = useGameStore((state) => state.activePiece);
  
  const ghostBlocks = useMemo(() => {
    if (!activePiece) return [];
    
    const ghostPos = getGhostPosition(grid, activePiece);
    
    // Don't show ghost if it's in the same position
    if (ghostPos.y === activePiece.position.y) return [];
    
    const ghostPiece: Tetromino = {
      ...activePiece,
      position: ghostPos,
    };
    
    return getBlockPositions(ghostPiece);
  }, [grid, activePiece]);
  
  if (!activePiece || ghostBlocks.length === 0) return null;
  
  const offsetX = -(GRID_WIDTH * BLOCK_SIZE) / 2 + BLOCK_SIZE / 2;
  const offsetY = (GRID_HEIGHT * BLOCK_SIZE) / 2 - BLOCK_SIZE / 2;
  
  return (
    <group>
      {ghostBlocks.map((block, index) => (
        <Block
          key={index}
          position={[
            block.x * BLOCK_SIZE + offsetX,
            -block.y * BLOCK_SIZE + offsetY,
            0,
          ]}
          type={activePiece.type}
          isGhost
        />
      ))}
    </group>
  );
}
