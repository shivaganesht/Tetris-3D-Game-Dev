import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Board } from './game/Board';
import { Tetromino } from './game/Tetromino';
import { GhostPiece } from './game/GhostPiece';
import { useGameStore } from '../store/gameStore';

export function Scene() {
  const activePiece = useGameStore((state) => state.activePiece);
  const gameState = useGameStore((state) => state.gameState);
  const groupRef = useRef<THREE.Group>(null);
  
  // Subtle camera sway for premium feel
  useFrame(({ clock }) => {
    if (groupRef.current && gameState === 'playing') {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.02;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.01;
    }
  });
  
  // Camera positioned to fit the entire board with padding
  const cameraDistance = 28;
  
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, cameraDistance]}
        fov={45}
        near={0.1}
        far={100}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#bf00ff" />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Game elements */}
      <group ref={groupRef}>
        <Board />
        <GhostPiece />
        {activePiece && <Tetromino piece={activePiece} />}
      </group>
      
      {/* Background particles/stars effect */}
      <Stars />
    </>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 30;
    }
    return pos;
  }, []);
  
  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
