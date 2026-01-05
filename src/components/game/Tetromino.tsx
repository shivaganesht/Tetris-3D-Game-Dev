import { useMemo } from 'react';
import { Block } from './Block';
import type { Tetromino as TetrominoType } from '../../lib/types';
import { getBlockPositions } from '../../lib/grid';
import { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE } from '../../lib/constants';

interface TetrominoProps {
  piece: TetrominoType;
  isGhost?: boolean;
}

export function Tetromino({ piece, isGhost = false }: TetrominoProps) {
  const blocks = useMemo(() => getBlockPositions(piece), [piece]);
  
  // Center the grid
  const offsetX = -(GRID_WIDTH * BLOCK_SIZE) / 2 + BLOCK_SIZE / 2;
  const offsetY = (GRID_HEIGHT * BLOCK_SIZE) / 2 - BLOCK_SIZE / 2;
  
  return (
    <group>
      {blocks.map((block, index) => (
        <Block
          key={index}
          position={[
            block.x * BLOCK_SIZE + offsetX,
            -block.y * BLOCK_SIZE + offsetY,
            0,
          ]}
          type={piece.type}
          isGhost={isGhost}
        />
      ))}
    </group>
  );
}
