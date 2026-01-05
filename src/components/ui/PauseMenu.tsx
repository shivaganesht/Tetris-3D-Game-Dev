import { useGameStore } from '../../store/gameStore';

export function PauseMenu() {
  const gameState = useGameStore((state) => state.gameState);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const startGame = useGameStore((state) => state.startGame);
  
  if (gameState !== 'paused') return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="glass-panel p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">PAUSED</h2>
        
        <div className="space-y-3">
          <button
            onClick={resumeGame}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg font-bold
                       hover:from-cyan-400 hover:to-cyan-500 transition-all duration-200
                       shadow-lg shadow-cyan-500/25"
          >
            RESUME
          </button>
          
          <button
            onClick={startGame}
            className="w-full px-6 py-3 bg-gray-700 rounded-lg font-bold
                       hover:bg-gray-600 transition-all duration-200"
          >
            RESTART
          </button>
        </div>
        
        <p className="text-gray-400 text-sm">Press P to resume</p>
      </div>
    </div>
  );
}
