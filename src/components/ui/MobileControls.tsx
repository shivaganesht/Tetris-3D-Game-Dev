import { useCallback, useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export function MobileControls() {
  const gameState = useGameStore((state) => state.gameState);
  const moveLeft = useGameStore((state) => state.moveLeft);
  const moveRight = useGameStore((state) => state.moveRight);
  const moveDown = useGameStore((state) => state.moveDown);
  const hardDrop = useGameStore((state) => state.hardDrop);
  const rotate = useGameStore((state) => state.rotate);
  const holdCurrentPiece = useGameStore((state) => state.holdCurrentPiece);
  const pauseGame = useGameStore((state) => state.pauseGame);
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleTouchStart = useCallback((action: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    action();
  }, []);
  
  // Auto-repeat for left/right movement
  const [repeatInterval, setRepeatInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  
  const startRepeat = useCallback((action: () => void) => {
    action(); // Immediate action
    const interval = setInterval(action, 100); // Repeat every 100ms
    setRepeatInterval(interval);
  }, []);
  
  const stopRepeat = useCallback(() => {
    if (repeatInterval) {
      clearInterval(repeatInterval);
      setRepeatInterval(null);
    }
  }, [repeatInterval]);
  
  if (!isMobile || gameState !== 'playing') return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto pb-safe">
      {/* Top controls - Hold and Pause */}
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <ControlButton 
          onTouchStart={handleTouchStart(holdCurrentPiece)}
          className="bg-yellow-500/20 border-yellow-500/50"
        >
          <span className="text-yellow-400 text-xs font-bold">HOLD</span>
        </ControlButton>
        
        <ControlButton 
          onTouchStart={handleTouchStart(pauseGame)}
          className="bg-gray-500/20 border-gray-500/50"
        >
          <PauseIcon />
        </ControlButton>
      </div>
      
      {/* Main controls grid */}
      <div className="px-4 pb-6">
        <div className="flex justify-between items-end">
          {/* Left side - D-pad */}
          <div className="grid grid-cols-3 gap-1">
            <div /> {/* Empty */}
            <ControlButton
              onTouchStart={() => startRepeat(moveLeft)}
              onTouchEnd={stopRepeat}
              className="bg-cyan-500/20 border-cyan-500/50 row-start-2"
            >
              <LeftArrow />
            </ControlButton>
            <ControlButton
              onTouchStart={handleTouchStart(moveDown)}
              className="bg-cyan-500/20 border-cyan-500/50 col-start-2 row-start-2"
            >
              <DownArrow />
            </ControlButton>
            <ControlButton
              onTouchStart={() => startRepeat(moveRight)}
              onTouchEnd={stopRepeat}
              className="bg-cyan-500/20 border-cyan-500/50 row-start-2"
            >
              <RightArrow />
            </ControlButton>
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex gap-3 items-center">
            {/* Rotate buttons */}
            <div className="flex flex-col gap-2">
              <ControlButton
                onTouchStart={handleTouchStart(() => rotate(-1))}
                className="bg-purple-500/20 border-purple-500/50"
                size="md"
              >
                <RotateCCW />
              </ControlButton>
              <ControlButton
                onTouchStart={handleTouchStart(() => rotate(1))}
                className="bg-purple-500/20 border-purple-500/50"
                size="md"
              >
                <RotateCW />
              </ControlButton>
            </div>
            
            {/* Hard drop - larger button */}
            <ControlButton
              onTouchStart={handleTouchStart(hardDrop)}
              className="bg-orange-500/20 border-orange-500/50"
              size="xl"
            >
              <HardDropIcon />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  children: React.ReactNode;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function ControlButton({ children, onTouchStart, onTouchEnd, className = '', size = 'lg' }: ControlButtonProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };
  
  return (
    <button
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-xl border-2
        backdrop-blur-sm
        active:scale-95 active:brightness-125
        transition-transform
        touch-none select-none
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Icons
function LeftArrow() {
  return (
    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function RotateCW() {
  return (
    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function RotateCCW() {
  return (
    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: 'scaleX(-1)' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function HardDropIcon() {
  return (
    <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}
