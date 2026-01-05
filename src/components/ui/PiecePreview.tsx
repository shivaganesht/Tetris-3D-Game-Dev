import { useGameStore } from '../../store/gameStore';
import { TETROMINO_COLORS } from '../../lib/constants';
import { TETROMINO_SHAPES } from '../../lib/tetrominos';
import type { TetrominoType } from '../../lib/types';

interface MiniBlockProps {
  type: TetrominoType;
}

function MiniBlock({ type }: MiniBlockProps) {
  const shape = TETROMINO_SHAPES[type][0];
  const color = TETROMINO_COLORS[type];
  
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape[0].length}, 1fr)` }}>
      {shape.flatMap((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className="w-4 h-4 rounded-sm transition-all duration-200"
            style={{
              backgroundColor: cell ? color : 'transparent',
              boxShadow: cell ? `0 0 8px ${color}40` : 'none',
            }}
          />
        ))
      )}
    </div>
  );
}

export function NextPiece() {
  const nextPieces = useGameStore((state) => state.nextPieces);
  
  return (
    <div className="glass-panel p-4">
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Next</h3>
      <div className="space-y-4">
        {nextPieces.slice(0, 3).map((type, index) => (
          <div
            key={index}
            className="flex justify-center items-center h-12 transition-opacity duration-200"
            style={{ opacity: 1 - index * 0.2 }}
          >
            <MiniBlock type={type} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HoldPiece() {
  const holdPiece = useGameStore((state) => state.holdPiece);
  const canHold = useGameStore((state) => state.canHold);
  
  return (
    <div className={`glass-panel p-4 transition-opacity duration-200 ${!canHold ? 'opacity-50' : ''}`}>
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Hold</h3>
      <div className="flex justify-center items-center h-12">
        {holdPiece ? <MiniBlock type={holdPiece} /> : <div className="text-gray-600 text-sm">-</div>}
      </div>
    </div>
  );
}
