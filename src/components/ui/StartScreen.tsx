import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { AuthModal } from './AuthModal';
import { Leaderboard } from './Leaderboard';

export function StartScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const gameState = useGameStore((state) => state.gameState);
  const { user, logOut, loading } = useAuthStore();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  if (gameState !== 'idle') return null;
  
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
        <div className="text-center space-y-8">
          {/* User status */}
          <div className="absolute top-4 right-4 flex items-center gap-4">
            {loading ? (
              <span className="text-gray-400 text-sm">Loading...</span>
            ) : user ? (
              <>
                <span className="text-gray-300 text-sm">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={logOut}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TETRIS
            </h1>
            <p className="text-gray-400 text-lg tracking-widest">3D EDITION</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={startGame}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold text-lg 
                         hover:from-cyan-400 hover:to-purple-400 transition-all duration-300
                         shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
            >
              <span className="relative z-10">START GAME</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </button>
            
            <button
              onClick={() => setShowLeaderboard(true)}
              className="w-full px-8 py-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg font-bold
                         hover:bg-yellow-500/30 transition-all duration-200 text-yellow-400"
            >
              🏆 Leaderboard
            </button>
            
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-medium
                           hover:bg-white/20 transition-all duration-200 text-gray-300"
              >
                Sign In to Save Scores
              </button>
            )}
          </div>
          
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
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)}
      />
    </>
  );
}
