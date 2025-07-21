# TASKS.md - Festival Fire Fighter Development Tasks

## Milestone 1: Project Setup & Basic Structure ✓
**Goal**: Initialize project with basic HTML/CSS/JS structure and rendering pipeline

### Setup Tasks
- [ ] Create project directory structure
- [ ] Initialize Git repository
- [ ] Create README.md with project description
- [ ] Set up .gitignore file
- [ ] Create index.html with canvas element
- [ ] Create style.css with basic responsive layout
- [ ] Create main.js entry point
- [ ] Set up development server (Live Server/http-server)

### Canvas Foundation
- [ ] Initialize canvas with proper dimensions (800x600)
- [ ] Implement responsive canvas scaling
- [ ] Create basic game loop with requestAnimationFrame
- [ ] Add FPS counter for performance monitoring
- [ ] Implement deltaTime calculation
- [ ] Create clear/redraw cycle
- [ ] Test canvas rendering with simple shapes

## Milestone 2: Core Game Loop & State Management ✓
**Goal**: Implement game states and basic flow control

### State Management
- [ ] Create GameStates enum (MENU, PLAYING, PAUSED, VICTORY, DEFEAT)
- [ ] Implement state machine for game flow
- [ ] Create state transition functions
- [ ] Add basic menu screen rendering
- [ ] Implement game start functionality
- [ ] Add pause/resume functionality (P key)
- [ ] Create game over screens (victory/defeat)

### Timer System
- [ ] Implement 60-second countdown timer
- [ ] Create timer display UI
- [ ] Add timer update logic in game loop
- [ ] Implement defeat condition when timer reaches zero
- [ ] Add timer pause during game pause
- [ ] Format timer display (MM:SS)

## Milestone 3: Player Character Implementation ✓
**Goal**: Create controllable firefighter with smooth movement

### Firefighter Entity
- [ ] Create Firefighter class/object structure
- [ ] Define firefighter properties (position, speed, dimensions)
- [ ] Implement keyboard input handler
- [ ] Add left/right movement (Arrow keys and A/D)
- [ ] Implement movement boundaries (stage limits)
- [ ] Add character sprite rendering (placeholder rectangle)
- [ ] Implement smooth movement with deltaTime

### Character Polish
- [ ] Add facing direction tracking
- [ ] Create idle and walking states
- [ ] Implement movement acceleration/deceleration
- [ ] Add visual feedback for movement
- [ ] Test movement on different frame rates

## Milestone 4: Water System Implementation ✓
**Goal**: Create water spray mechanics with realistic physics

### Water Particles
- [ ] Create WaterParticle class
- [ ] Implement particle spawn system
- [ ] Add initial upward velocity
- [ ] Implement gravity physics
- [ ] Add horizontal spread variation
- [ ] Create particle rendering (blue circles)
- [ ] Link water spawn to spacebar input

### Water System Optimization
- [ ] Implement object pooling for particles
- [ ] Add particle lifecycle management
- [ ] Remove off-screen particles
- [ ] Limit maximum active particles (100)
- [ ] Add continuous spray while holding spacebar
- [ ] Optimize particle update loop
- [ ] Test performance with max particles

## Milestone 5: Fire System & Stage Layout ✓
**Goal**: Implement fire entities and stage structure

### Stage Design
- [ ] Create stage background rendering
- [ ] Define stage boundaries and platforms
- [ ] Add visual stage elements (speakers, DJ booth)
- [ ] Implement multiple height levels
- [ ] Create ground level for firefighter
- [ ] Add stage depth layers

### Fire Implementation
- [ ] Create Fire class with properties
- [ ] Define fire sizes (small, medium, large)
- [ ] Implement fire health system
- [ ] Create fire spawn manager
- [ ] Add random spawn positions on stage
- [ ] Implement fire rendering (red/orange shapes)
- [ ] Add fire animation (flickering effect)

### Fire Behavior
- [ ] Implement fire spread timer
- [ ] Add fire spread mechanics
- [ ] Create new fire spawn logic
- [ ] Balance spawn rates for difficulty
- [ ] Test fire distribution on stage

## Milestone 6: Collision Detection & Game Mechanics ✓
**Goal**: Connect all systems with collision detection and scoring

### Collision System
- [ ] Implement water-fire collision detection
- [ ] Add collision response (damage fire)
- [ ] Create fire extinguish logic
- [ ] Remove extinguished fires
- [ ] Add visual feedback for hits
- [ ] Implement efficient collision checking

### Victory Conditions
- [ ] Track active fires count
- [ ] Implement victory check (no fires remaining)
- [ ] Stop timer on victory
- [ ] Calculate final score: 1000 - (seconds × 10)
- [ ] Trigger victory state and display
- [ ] Add score to victory screen

## Milestone 7: User Interface & HUD ✓
**Goal**: Create all UI elements and menus

### HUD Elements
- [ ] Create timer display (large, prominent)
- [ ] Add active fires counter
- [ ] Implement score display
- [ ] Add pause button/indicator
- [ ] Style HUD with CSS
- [ ] Ensure HUD doesn't block gameplay

### Menu Screens
- [ ] Design main menu layout
- [ ] Create "Play" button functionality
- [ ] Add difficulty selection (Easy/Normal/Hard)
- [ ] Implement high score display
- [ ] Create credits screen
- [ ] Add navigation between screens

### Game Over Screens
- [ ] Design victory screen with score
- [ ] Create defeat screen with retry option
- [ ] Add performance indicators
- [ ] Implement "Play Again" functionality
- [ ] Add "Return to Menu" option
- [ ] Include gameplay tips on defeat

## Milestone 8: Visual Polish & Effects ✓
**Goal**: Enhance visual appeal with animations and effects

### Sprite Creation
- [ ] Create/obtain firefighter sprite
- [ ] Design fire sprites (3 sizes)
- [ ] Create stage background art
- [ ] Add water particle variations
- [ ] Design UI button sprites
- [ ] Create logo/title graphics

### Visual Effects
- [ ] Add particle effects for water splash
- [ ] Implement fire extinguish animation
- [ ] Create smoke effects
- [ ] Add stage lighting effects
- [ ] Implement screen transitions
- [ ] Add victory celebration effects

### Animations
- [ ] Animate firefighter walking
- [ ] Add fire flickering animation
- [ ] Implement water spray animation
- [ ] Create menu transition animations
- [ ] Add button hover effects

## Milestone 9: Audio Implementation ✓
**Goal**: Add sound effects and background music

### Sound Effects
- [ ] Source/create fire crackling sound
- [ ] Add water spray sound effect
- [ ] Create fire extinguish sound
- [ ] Add victory fanfare
- [ ] Implement defeat sound
- [ ] Add UI interaction sounds
- [ ] Create movement sound effects

### Audio System
- [ ] Implement audio manager
- [ ] Add sound loading system
- [ ] Create volume controls
- [ ] Add mute/unmute functionality
- [ ] Implement sound pooling
- [ ] Test audio on different browsers

### Background Music
- [ ] Source appropriate background track
- [ ] Implement music looping
- [ ] Add music fade in/out
- [ ] Create tension increase near timeout
- [ ] Ensure music doesn't interfere with SFX

## Milestone 10: Mobile Optimization ✓
**Goal**: Ensure game works well on mobile devices

### Touch Controls
- [ ] Implement touch event handlers
- [ ] Create on-screen control buttons
- [ ] Add touch areas for left/right movement
- [ ] Implement touch-to-spray mechanic
- [ ] Ensure touch targets are large enough
- [ ] Add visual feedback for touches

### Mobile UI
- [ ] Create responsive canvas scaling
- [ ] Adjust UI element sizes for mobile
- [ ] Optimize HUD for small screens
- [ ] Test on various screen sizes
- [ ] Implement landscape orientation lock
- [ ] Add mobile-specific instructions

### Performance
- [ ] Profile performance on mobile devices
- [ ] Optimize render calls for mobile
- [ ] Reduce particle count if needed
- [ ] Test on older devices
- [ ] Implement quality settings

## Milestone 11: Testing & Bug Fixes ✓
**Goal**: Ensure game is stable and polished

### Functionality Testing
- [ ] Test all control schemes
- [ ] Verify collision detection accuracy
- [ ] Check timer accuracy
- [ ] Validate score calculations
- [ ] Test state transitions
- [ ] Verify win/lose conditions

### Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Fix browser-specific issues
- [ ] Verify audio compatibility

### Performance Testing
- [ ] Monitor FPS across different scenarios
- [ ] Check memory usage over time
- [ ] Test with maximum particles/fires
- [ ] Optimize bottlenecks
- [ ] Verify 60 FPS target

### Bug Fixes
- [ ] Fix edge case bugs
- [ ] Resolve visual glitches
- [ ] Fix input handling issues
- [ ] Address timing problems
- [ ] Polish rough edges

## Milestone 12: Documentation & Deployment ✓
**Goal**: Prepare for release and deployment

### Documentation
- [ ] Write comprehensive README
- [ ] Create gameplay instructions
- [ ] Document controls clearly
- [ ] Add screenshots/GIFs
- [ ] Write code comments
- [ ] Create API documentation

### Build Process
- [ ] Minify JavaScript files
- [ ] Optimize CSS
- [ ] Compress images
- [ ] Create production build
- [ ] Test production build
- [ ] Verify file sizes < 1MB

### Deployment
- [ ] Choose hosting platform
- [ ] Set up GitHub Pages/Netlify
- [ ] Configure custom domain (optional)
- [ ] Deploy game
- [ ] Test deployed version
- [ ] Share game link

### Marketing Materials
- [ ] Create game trailer/GIF
- [ ] Write game description
- [ ] Design thumbnail/cover image
- [ ] Prepare social media posts
- [ ] Submit to game directories

## Bonus Milestone: Future Enhancements 🎯
**Goal**: Additional features for post-launch updates

### Gameplay Enhancements
- [ ] Add power-ups (water bombs, time freeze)
- [ ] Implement combo system
- [ ] Create multiple stage layouts
- [ ] Add weather effects (wind)
- [ ] Implement difficulty progression

### Social Features
- [ ] Add local high score table
- [ ] Implement online leaderboards
- [ ] Add social media sharing
- [ ] Create achievement system
- [ ] Add player statistics

### Technical Improvements
- [ ] Convert to TypeScript
- [ ] Add unit tests
- [ ] Implement save system
- [ ] Add PWA features
- [ ] Create level editor

## Progress Tracking

### Week 1
- Milestone 1: Project Setup ✓
- Milestone 2: Game Loop ✓
- Milestone 3: Player Character ✓

### Week 2
- Milestone 4: Water System ✓
- Milestone 5: Fire System ✓
- Milestone 6: Collision Detection ✓

### Week 3
- Milestone 7: UI & HUD ✓
- Milestone 8: Visual Polish ✓
- Milestone 9: Audio ✓

### Week 4
- Milestone 10: Mobile ✓
- Milestone 11: Testing ✓
- Milestone 12: Deployment ✓

## Notes
- Each milestone should be completed before moving to the next
- Tasks within milestones can be worked on in parallel
- Testing should be ongoing, not just in Milestone 11
- Keep the game playable at the end of each milestone
- Document progress and blockers regularly