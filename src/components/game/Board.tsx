import { useMemo } from 'react';
import * as THREE from 'three';
import { Block } from './Block';
import { useGameStore } from '../../store/gameStore';
import { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE, BOARD_COLOR, GRID_LINE_COLOR } from '../../lib/constants';

export function Board() {
  const grid = useGameStore((state) => state.grid);
  const clearedRows = useGameStore((state) => state.clearedRows);
  
  const boardGeometry = useMemo(() => {
    const width = GRID_WIDTH * BLOCK_SIZE;
    const height = GRID_HEIGHT * BLOCK_SIZE;
    const depth = BLOCK_SIZE;
    return new THREE.BoxGeometry(width + 0.2, height + 0.2, depth);
  }, []);
  
  // Grid lines geometry
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[] = [];
    const width = GRID_WIDTH * BLOCK_SIZE;
    const height = GRID_HEIGHT * BLOCK_SIZE;
    const offsetX = -width / 2;
    const offsetY = -height / 2;
    
    // Vertical lines
    for (let x = 0; x <= GRID_WIDTH; x++) {
      lines.push(new THREE.Vector3(offsetX + x * BLOCK_SIZE, offsetY, 0.5));
      lines.push(new THREE.Vector3(offsetX + x * BLOCK_SIZE, offsetY + height, 0.5));
    }
    
    // Horizontal lines
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      lines.push(new THREE.Vector3(offsetX, offsetY + y * BLOCK_SIZE, 0.5));
      lines.push(new THREE.Vector3(offsetX + width, offsetY + y * BLOCK_SIZE, 0.5));
    }
    
    return lines;
  }, []);
  
  const offsetX = -(GRID_WIDTH * BLOCK_SIZE) / 2 + BLOCK_SIZE / 2;
  const offsetY = (GRID_HEIGHT * BLOCK_SIZE) / 2 - BLOCK_SIZE / 2;
  
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, 0, -BLOCK_SIZE / 2]} geometry={boardGeometry} receiveShadow>
        <meshStandardMaterial color={BOARD_COLOR} metalness={0.5} roughness={0.8} />
      </mesh>
      
      {/* Grid lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(gridLines.flatMap(v => [v.x, v.y, v.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={GRID_LINE_COLOR} transparent opacity={0.3} />
      </lineSegments>
      
      {/* Placed blocks */}
      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;
          const isClearing = clearedRows.includes(y);
          return (
            <Block
              key={`${x}-${y}`}
              position={[
                x * BLOCK_SIZE + offsetX,
                -y * BLOCK_SIZE + offsetY,
                0,
              ]}
              type={cell}
              isClearing={isClearing}
            />
          );
        })
      )}
      
      {/* Side walls */}
      <mesh position={[-(GRID_WIDTH * BLOCK_SIZE) / 2 - 0.15, 0, 0]}>
        <boxGeometry args={[0.1, GRID_HEIGHT * BLOCK_SIZE + 0.2, BLOCK_SIZE * 1.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[(GRID_WIDTH * BLOCK_SIZE) / 2 + 0.15, 0, 0]}>
        <boxGeometry args={[0.1, GRID_HEIGHT * BLOCK_SIZE + 0.2, BLOCK_SIZE * 1.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Bottom wall */}
      <mesh position={[0, -(GRID_HEIGHT * BLOCK_SIZE) / 2 - 0.15, 0]}>
        <boxGeometry args={[GRID_WIDTH * BLOCK_SIZE + 0.5, 0.1, BLOCK_SIZE * 1.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}
