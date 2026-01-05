import { useGameStore } from '../../store/gameStore';

export function GameOver() {
  const gameState = useGameStore((state) => state.gameState);
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  const lines = useGameStore((state) => state.lines);
  const startGame = useGameStore((state) => state.startGame);
  
  if (gameState !== 'gameover') return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
      <div className="glass-panel p-8 text-center space-y-6 max-w-sm">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-red-400">GAME OVER</h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
        </div>
        
        <div className="space-y-4 py-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-400">Final Score</div>
            <div className="text-4xl font-bold text-cyan-400 tabular-nums glow-text">
              {score.toLocaleString()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400">Level</div>
              <div className="text-2xl font-bold text-purple-400">{level}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400">Lines</div>
              <div className="text-2xl font-bold text-green-400">{lines}</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={startGame}
          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold text-lg
                     hover:from-cyan-400 hover:to-purple-400 transition-all duration-300
                     shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
