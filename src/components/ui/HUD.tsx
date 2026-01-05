import { useGameStore } from '../../store/gameStore';

export function HUD() {
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  const lines = useGameStore((state) => state.lines);
  const combo = useGameStore((state) => state.combo);
  
  return (
    <div className="glass-panel p-4 space-y-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-gray-400">Score</div>
        <div className="text-2xl font-bold text-cyan-400 tabular-nums glow-text">
          {score.toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Level</div>
          <div className="text-xl font-bold text-purple-400 tabular-nums">{level}</div>
        </div>
        
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Lines</div>
          <div className="text-xl font-bold text-green-400 tabular-nums">{lines}</div>
        </div>
      </div>
      
      {combo > 1 && (
        <div className="text-center py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
          <div className="text-xs uppercase tracking-widest text-yellow-400">Combo</div>
          <div className="text-xl font-bold text-yellow-400">x{combo}</div>
        </div>
      )}
    </div>
  );
}
