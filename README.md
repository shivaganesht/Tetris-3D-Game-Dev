# TETRIS 3D Game Development

A modern, premium 3D Tetris game built with React, Three.js, and TypeScript.

![Tetris 3D](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-r161-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Features

- **True 3D Rendering** - Blocks with depth, lighting, shadows, and reflections
- **Classic Tetris Mechanics** - All 7 tetrominoes with SRS (Super Rotation System)
- **Wall Kicks** - Proper wall kick implementation for smooth rotation
- **Ghost Piece** - Shows where the piece will land
- **Hold System** - Hold a piece for later use (C key)
- **Next Piece Preview** - See the next 3 pieces
- **Combo System** - Chain line clears for bonus points
- **Difficulty Progression** - Speed increases with level
- **Premium UI/UX** - Glassmorphism design, neon accents, smooth animations
- **60 FPS Performance** - Optimized rendering with minimal re-renders

## 🎮 Controls

| Key | Action |
|-----|--------|
| ← → | Move left/right |
| ↓ | Soft drop |
| ↑ / X | Rotate clockwise |
| Z | Rotate counter-clockwise |
| Space | Hard drop |
| C / Shift | Hold piece |
| P / Escape | Pause |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Architecture

```
src/
├── components/
│   ├── game/           # 3D game components
│   │   ├── Block.tsx       # Individual 3D block with materials
│   │   ├── Board.tsx       # Game board with grid lines
│   │   ├── Tetromino.tsx   # Active falling piece
│   │   └── GhostPiece.tsx  # Drop preview
│   ├── ui/             # 2D UI overlays
│   │   ├── HUD.tsx         # Score, level, lines display
│   │   ├── PiecePreview.tsx # Next/Hold piece previews
│   │   ├── StartScreen.tsx  # Start menu
│   │   ├── PauseMenu.tsx    # Pause overlay
│   │   └── GameOver.tsx     # Game over screen
│   └── Scene.tsx       # Main 3D scene with camera/lights
├── hooks/
│   ├── useKeyboard.ts  # Keyboard input with DAS/ARR
│   └── useGameLoop.ts  # Game tick timing
├── store/
│   └── gameStore.ts    # Zustand state management
├── lib/
│   ├── constants.ts    # Game configuration
│   ├── types.ts        # TypeScript definitions
│   ├── tetrominos.ts   # Piece shapes & wall kicks
│   ├── grid.ts         # Grid logic & collision
│   └── scoring.ts      # Score calculation
└── App.tsx             # Main application
```

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **3D Engine:** Three.js via @react-three/fiber
- **State:** Zustand
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

## 📋 TODO - Future Enhancements

### Sound & Audio
- [ ] Background music (synthwave/chiptune)
- [ ] Sound effects (move, rotate, drop, clear, level up)
- [ ] Volume controls

### Gameplay
- [ ] T-Spin detection and bonus scoring
- [ ] Back-to-back bonus for consecutive Tetrises
- [ ] Perfect clear bonus
- [ ] Marathon/Sprint/Ultra game modes
- [ ] Adjustable starting level

### Visual Effects
- [ ] Particle effects on line clear
- [ ] Screen shake on hard drop
- [ ] More dramatic Tetris (4-line) clear animation
- [ ] Dynamic lighting based on score/combo

### Persistence
- [ ] Local high score leaderboard
- [ ] Cloud sync with user accounts
- [ ] Replay system

### Multiplayer
- [ ] 1v1 online battles
- [ ] Garbage line mechanics
- [ ] Spectator mode

### Customization
- [ ] Block skins/themes
- [ ] Custom color palettes
- [ ] Board backgrounds
- [ ] Ghost piece styles

### Accessibility
- [ ] Touch/swipe controls for mobile
- [ ] Customizable key bindings
- [ ] Colorblind mode
- [ ] Screen reader support

### Performance
- [ ] WebGL instanced rendering for blocks
- [ ] Level-of-detail for distant elements
- [ ] Memory pooling for block objects

## 📄 License

MIT
