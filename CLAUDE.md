# CLAUDE.md - Festival Fire Fighter Game Development Guide

## Project Overview
A 2D browser-based firefighting game where players control a firefighter to extinguish fires on a festival stage within 60 seconds.

## Core Game Rules
1. **Timer**: 60-second countdown (game over if reaches 0)
2. **Victory**: All fires extinguished before timer expires
3. **Defeat**: Timer expires with fires remaining
4. **Score**: `1000 - (seconds_taken × 10)` (min: 0, max: 1000)

## Technical Stack
- **Primary**: Vanilla JavaScript with HTML5 Canvas
- **Alternative**: Phaser 3.x
- **Build**: Simple HTML/CSS/JS (no complex tooling required)
- **Target**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Performance**: 60 FPS target

## Game Mechanics Implementation

### Player Character
```javascript
// Firefighter properties
{
  x: canvas.width / 2,      // Starting position
  y: ground_level,          // Fixed Y position
  width: 32,                // Sprite width
  height: 48,               // Sprite height
  speed: 200,               // pixels per second
  facing: 'right',          // Direction facing
  isSprayingWater: false    // Current state
}
```

### Controls
- **Left Arrow / A**: Move left
- **Right Arrow / D**: Move right  
- **Spacebar**: Spray water (hold for continuous)
- **P**: Pause game

### Water Physics
```javascript
// Water particle properties
{
  x: firefighter.x,         // Spawn at firefighter position
  y: firefighter.y - 10,    // Slightly above firefighter
  vx: random(-20, 20),      // Slight horizontal spread
  vy: -300,                 // Initial upward velocity
  gravity: 500,             // Pixels/second²
  size: 4                   // Particle radius
}

// Update water particle
particle.vy += gravity * deltaTime;
particle.x += particle.vx * deltaTime;
particle.y += particle.vy * deltaTime;
```

### Fire System
```javascript
// Fire properties
{
  x: random(stageLeft, stageRight),
  y: random(stageBottom, stageTop),
  size: 'small',            // 'small', 'medium', 'large'
  health: 2,                // Hits needed to extinguish
  spreadTimer: 5000,        // ms until spreading
  id: unique_id
}

// Fire sizes and health
const FIRE_CONFIG = {
  small: { health: 2, width: 20, height: 30 },
  medium: { health: 4, width: 30, height: 40 },
  large: { health: 6, width: 40, height: 50 }
};
```

### Collision Detection
```javascript
// Water-Fire collision (circle-rectangle)
function checkWaterFireCollision(water, fire) {
  return water.x > fire.x && 
         water.x < fire.x + fire.width &&
         water.y > fire.y && 
         water.y < fire.y + fire.height;
}
```

## Game States
```javascript
const GameStates = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  VICTORY: 'victory',
  DEFEAT: 'defeat'
};
```

## Essential Features Priority

### Phase 1 - Core (Must Have)
1. Canvas setup and game loop
2. Firefighter movement (left/right)
3. Water spray mechanics with gravity
4. Basic fire spawning (static positions)
5. Water-fire collision detection
6. 60-second timer
7. Victory/defeat conditions

### Phase 2 - Polish
1. Fire spreading mechanic
2. Random fire spawning
3. Simple animations (fire, water, character)
4. Basic sound effects
5. Score display
6. Pause functionality

### Phase 3 - Enhancement
1. Multiple fire sizes
2. Particle effects
3. Background music
4. Menu system
5. Mobile touch controls

## Code Structure
```
festival-fire-fighter/
├── index.html           # Game container
├── style.css           # Basic styling
├── js/
│   ├── main.js         # Entry point, game loop
│   ├── game.js         # Game state management
│   ├── firefighter.js  # Player character logic
│   ├── fire.js         # Fire entity and spawning
│   ├── water.js        # Water particles system
│   ├── collision.js    # Collision detection
│   ├── ui.js           # HUD, menus, timer
│   └── audio.js        # Sound effects handler
└── assets/
    ├── sprites/        # Character, fire, stage
    └── sounds/         # SFX files
```

## Key Implementation Notes

### Game Loop
```javascript
let lastTime = 0;
function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  
  update(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}
```

### Timer Management
```javascript
let timeRemaining = 60; // seconds

function updateTimer(deltaTime) {
  if (gameState === GameStates.PLAYING) {
    timeRemaining -= deltaTime;
    if (timeRemaining <= 0) {
      gameState = GameStates.DEFEAT;
    }
  }
}
```

### Performance Optimization
- Use object pooling for water particles
- Limit active water particles (max ~100)
- Simple sprite rendering (no complex shaders)
- Efficient collision detection (spatial partitioning if needed)

## Visual Style Guidelines
- **Simple shapes**: Rectangles for firefighter, circles for water
- **Clear colors**: Red/orange for fire, blue for water, distinct character
- **Readable UI**: Large timer display, clear score text
- **Stage layout**: Side-view with visible height levels

## Common Pitfalls to Avoid
1. Don't create water particles every frame - use intervals
2. Remove off-screen water particles to prevent memory leaks
3. Pause all timers when game is paused
4. Clear all game objects when restarting
5. Test collision detection at screen edges

## Testing Checklist
- [ ] Player can move smoothly left/right
- [ ] Water sprays upward and falls naturally
- [ ] Fires spawn at different stage heights
- [ ] Collision detection works reliably
- [ ] Timer counts down correctly
- [ ] Score calculation is accurate
- [ ] Victory triggers when all fires extinguished
- [ ] Defeat triggers when timer hits zero
- [ ] Game can be paused/resumed
- [ ] No memory leaks during extended play

## Quick Start Code Template
```javascript
// Basic game skeleton
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = {
  state: GameStates.MENU,
  timer: 60,
  score: 0,
  fires: [],
  waterParticles: []
};

function init() {
  // Setup canvas size
  canvas.width = 800;
  canvas.height = 600;
  
  // Initialize game objects
  // Start game loop
  requestAnimationFrame(gameLoop);
}

// Start when DOM loaded
document.addEventListener('DOMContentLoaded', init);
```

## Remember
- Keep code clean and well-commented
- Test frequently during development
- Start simple, add complexity gradually
- Prioritize gameplay over visuals
- 60-second timer is non-negotiable
- Score formula: 1000 - (seconds × 10)