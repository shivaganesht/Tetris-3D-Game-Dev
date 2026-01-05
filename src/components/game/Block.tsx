import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TETROMINO_COLORS, BLOCK_SIZE } from '../../lib/constants';
import type { TetrominoType } from '../../lib/types';

interface BlockProps {
  position: [number, number, number];
  type: TetrominoType;
  isGhost?: boolean;
  isClearing?: boolean;
}

export function Block({ position, type, isGhost = false, isClearing = false }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const color = TETROMINO_COLORS[type];
  
  const geometry = useMemo(() => new THREE.BoxGeometry(
    BLOCK_SIZE * 0.92,
    BLOCK_SIZE * 0.92,
    BLOCK_SIZE * 0.92
  ), []);
  
  // Reset scale when not clearing
  useEffect(() => {
    if (!isClearing && meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
    if (!isClearing && materialRef.current) {
      materialRef.current.emissiveIntensity = 0.15;
    }
  }, [isClearing]);
  
  useFrame((_, delta) => {
    if (isClearing && meshRef.current) {
      meshRef.current.scale.y = Math.max(0.01, meshRef.current.scale.y - delta * 5);
      meshRef.current.scale.x = Math.max(0.01, meshRef.current.scale.x - delta * 5);
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = Math.min(3, (materialRef.current.emissiveIntensity || 0) + delta * 10);
      }
    }
  });

  if (isGhost) {
    return (
      <mesh position={position} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={isClearing ? 1 : 0.15}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}
