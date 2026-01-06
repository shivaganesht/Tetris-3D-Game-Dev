import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const { leaderboard, leaderboardLoading, fetchLeaderboard, user } = useAuthStore();
  
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, fetchLeaderboard]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-[100]">
      <div className="glass-panel p-8 w-full max-w-lg relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          🏆 Leaderboard
        </h2>
        
        {leaderboardLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No scores yet. Be the first!
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-widest text-gray-500 pb-2 border-b border-white/10">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-3 text-right">Score</div>
              <div className="col-span-2 text-right">Level</div>
              <div className="col-span-1 text-right">Lines</div>
            </div>
            
            {/* Entries */}
            {leaderboard.map((entry) => {
              const isCurrentUser = user?.uid === entry.id;
              const rankColors: Record<number, string> = {
                1: 'text-yellow-400',
                2: 'text-gray-300',
                3: 'text-amber-600',
              };
              
              return (
                <div 
                  key={entry.id}
                  className={`grid grid-cols-12 gap-2 py-2 rounded-lg transition-colors
                    ${isCurrentUser ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-white/5'}`}
                >
                  <div className={`col-span-1 font-bold ${rankColors[entry.rank] || 'text-gray-400'}`}>
                    {entry.rank}
                  </div>
                  <div className={`col-span-5 truncate ${isCurrentUser ? 'text-cyan-400' : ''}`}>
                    {entry.displayName}
                    {isCurrentUser && <span className="ml-2 text-xs text-gray-500">(You)</span>}
                  </div>
                  <div className="col-span-3 text-right font-bold text-cyan-400 tabular-nums">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="col-span-2 text-right text-purple-400 tabular-nums">
                    {entry.level}
                  </div>
                  <div className="col-span-1 text-right text-green-400 tabular-nums">
                    {entry.lines}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-700 rounded-lg font-bold
                     hover:bg-gray-600 transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
