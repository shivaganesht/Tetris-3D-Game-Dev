import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { HUD } from './components/ui/HUD';
import { NextPiece, HoldPiece } from './components/ui/PiecePreview';
import { StartScreen } from './components/ui/StartScreen';
import { PauseMenu } from './components/ui/PauseMenu';
import { GameOver } from './components/ui/GameOver';
import { useKeyboard } from './hooks/useKeyboard';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameStore } from './store/gameStore';

function GameUI() {
  const gameState = useGameStore((state) => state.gameState);
  
  if (gameState === 'idle') return null;
  
  return (
    <>
      {/* Left Panel - Hold */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-10">
        <HoldPiece />
      </div>
      
      {/* Right Panel - Next pieces and HUD */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10 space-y-4">
        <NextPiece />
        <HUD />
      </div>
      
      {/* Controls hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 text-gray-600 text-xs space-x-6">
        <span>← → Move</span>
        <span>↑ Z Rotate</span>
        <span>↓ Soft Drop</span>
        <span>Space Hard Drop</span>
        <span>C Hold</span>
        <span>P Pause</span>
      </div>
    </>
  );
}

function App() {
  useKeyboard();
  useGameLoop();
  
  return (
    <div className="w-full h-full relative bg-[#050508]">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        className="game-canvas"
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      
      {/* UI Overlays */}
      <GameUI />
      <StartScreen />
      <PauseMenu />
      <GameOver />
    </div>
  );
}

export default App;
