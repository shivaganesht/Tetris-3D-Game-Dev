import { useGameStore } from '../../store/gameStore';

export function StartScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const gameState = useGameStore((state) => state.gameState);
  
  if (gameState !== 'idle') return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TETRIS
          </h1>
          <p className="text-gray-400 text-lg tracking-widest">3D EDITION</p>
        </div>
        
        <button
          onClick={startGame}
          className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold text-lg 
                     hover:from-cyan-400 hover:to-purple-400 transition-all duration-300
                     shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
        >
          <span className="relative z-10">START GAME</span>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
        </button>
        
        <div className="text-gray-500 text-sm space-y-2">
          <div className="space-x-4">
            <span><kbd className="kbd">←</kbd> <kbd className="kbd">→</kbd> Move</span>
            <span><kbd className="kbd">↓</kbd> Soft Drop</span>
          </div>
          <div className="space-x-4">
            <span><kbd className="kbd">↑</kbd> <kbd className="kbd">Z</kbd> Rotate</span>
            <span><kbd className="kbd">Space</kbd> Hard Drop</span>
          </div>
          <div className="space-x-4">
            <span><kbd className="kbd">C</kbd> Hold</span>
            <span><kbd className="kbd">P</kbd> Pause</span>
          </div>
        </div>
      </div>
    </div>
  );
}
