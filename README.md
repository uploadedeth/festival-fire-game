# 🔥 Festival Fire Fighter

A fast-paced 2D firefighting game built with Phaser 3, where players control a firefighter to extinguish fires on a festival stage within 60 seconds.

## 🎮 Game Overview

- **Objective**: Extinguish all fires before the 60-second timer expires
- **Controls**: Arrow keys/WASD to move, Spacebar to spray water
- **Scoring**: `1000 - (seconds_taken × 10)` (minimum: 0, maximum: 1000)
- **Victory**: All fires extinguished before timer expires
- **Defeat**: Timer expires with fires remaining

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/festival-fire-game.git
   cd festival-fire-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   The game will open at `http://localhost:8080`

4. **Test iframe integration**
   ```bash
   npm run test:iframe
   ```
   Opens the iframe test page at `http://localhost:8080/iframe-test.html`

## 📦 Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Install gh-pages** (if not already installed)
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update repository URL in package.json**
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/YOUR-USERNAME/festival-fire-game.git"
     }
   }
   ```

3. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages in repository settings**
   - Go to Settings → Pages
   - Select source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

### Option 2: Manual Deployment

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Deploy game to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`

3. **Access your game**
   ```
   https://YOUR-USERNAME.github.io/festival-fire-game/
   ```

## 🔗 Iframe Integration for Next.js

### Basic Integration

```jsx
// In your Next.js component
export default function GamePage() {
  const gameUrl = "https://YOUR-USERNAME.github.io/festival-fire-game/";
  
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <iframe
        src={gameUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        title="Festival Fire Fighter"
      />
    </div>
  );
}
```

### Advanced Integration with Communication

```jsx
import { useEffect, useRef, useState } from 'react';

export default function InteractiveGame() {
  const iframeRef = useRef(null);
  const [gameState, setGameState] = useState('loading');
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Listen for messages from the game
    const handleMessage = (event) => {
      if (event.data.source === 'festival-fire-fighter') {
        const { type, data } = event.data;
        
        switch (type) {
          case 'GAME_READY':
            setGameState('ready');
            break;
          case 'GAME_STARTED':
            setGameState('playing');
            break;
          case 'GAME_ENDED':
            setGameState('finished');
            setScore(data.score);
            break;
          case 'SCORE_UPDATE':
            setScore(data.score);
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendCommand = (command) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: command,
        source: 'nextjs-parent'
      }, '*');
    }
  };

  return (
    <div className="game-container">
      <div className="game-controls">
        <button onClick={() => sendCommand('PAUSE_GAME')}>Pause</button>
        <button onClick={() => sendCommand('RESUME_GAME')}>Resume</button>
        <button onClick={() => sendCommand('RESTART_GAME')}>Restart</button>
        <div>Status: {gameState} | Score: {score}</div>
      </div>
      
      <iframe
        ref={iframeRef}
        src="https://YOUR-USERNAME.github.io/festival-fire-game/"
        width="100%"
        height="600"
        frameBorder="0"
        allowFullScreen
        title="Festival Fire Fighter"
      />
    </div>
  );
}
```

## 📨 PostMessage API Reference

### Messages You Can Send to the Game

| Message Type | Description |
|--------------|-------------|
| `PAUSE_GAME` | Pauses the current game |
| `RESUME_GAME` | Resumes a paused game |
| `RESTART_GAME` | Restarts the current game |
| `GET_GAME_STATE` | Requests current game state |
| `MUTE_AUDIO` | Mutes all game audio |
| `UNMUTE_AUDIO` | Unmutes game audio |

### Messages You'll Receive from the Game

| Message Type | Data | Description |
|--------------|------|-------------|
| `GAME_READY` | `{ gameVersion, timestamp }` | Game loaded and ready |
| `GAME_STARTED` | `{}` | Game session started |
| `GAME_ENDED` | `{ victory, score, timeRemaining }` | Game session ended |
| `SCORE_UPDATE` | `{ score, points }` | Score changed |
| `FIRE_EXTINGUISHED` | `{ firesRemaining }` | Fire was extinguished |
| `GAME_STATE` | `{ score, timeRemaining, firesRemaining, gameState }` | Current game state |

### Example Message Format

```javascript
// Sending a message to the game
iframe.contentWindow.postMessage({
  type: 'PAUSE_GAME',
  data: {},
  source: 'your-app-name'
}, '*');

// Receiving a message from the game
window.addEventListener('message', (event) => {
  if (event.data.source === 'festival-fire-fighter') {
    const { type, data } = event.data;
    console.log('Received:', type, data);
  }
});
```

## 🛠️ Development

### Project Structure

```
festival-fire-game/
├── index.html              # Main game page
├── iframe-test.html         # Iframe integration test
├── style.css               # Game styling (includes iframe support)
├── package.json            # Dependencies and scripts
├── phaser/                 # Phaser game files
│   ├── main-phaser.js      # Game initialization + postMessage API
│   ├── config/
│   │   └── GameConfig.js   # Phaser configuration
│   ├── scenes/             # Game scenes
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── GameOverScene.js
│   ├── entities/           # Game entities
│   │   ├── Firefighter.js
│   │   ├── Fire.js
│   │   └── WaterParticle.js
│   └── managers/           # Game managers
│       ├── AudioManager.js
│       ├── UIManager.js
│       └── ParticleManager.js
└── assets/                 # Game assets
    └── images/
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run deploy       # Deploy to GitHub Pages
npm run test:iframe  # Test iframe integration locally
```

### Building for Production

The game is built as a static site with no build process required. All assets are loaded via CDN or relative paths.

## 🎯 Game Mechanics

### Fire System
- **Fire Types**: Small (2 hits), Medium (4 hits), Large (6 hits)
- **Fire Spreading**: Fires can spread to new locations over time
- **Random Spawning**: New fires appear at random stage positions

### Water Physics
- **Realistic Physics**: Water particles follow gravity and physics
- **Particle System**: Efficient particle management with object pooling
- **Collision Detection**: Precise water-fire collision detection

### Performance Optimization
- **60 FPS Target**: Optimized for smooth gameplay
- **Object Pooling**: Reuses water particles for performance
- **Efficient Rendering**: Minimal draw calls and optimized sprites

## 🔧 Troubleshooting

### Common Issues

1. **Game not loading in iframe**
   - Check browser console for CORS errors
   - Ensure the game URL is accessible
   - Verify iframe `src` attribute

2. **PostMessage not working**
   - Check message format matches API specification
   - Verify `source` property in messages
   - Ensure iframe is fully loaded before sending messages

3. **Audio not working**
   - Modern browsers require user interaction before playing audio
   - Check if audio is muted via postMessage API
   - Verify audio files are accessible

4. **Performance issues**
   - Reduce number of simultaneous water particles
   - Check browser developer tools for performance bottlenecks
   - Ensure hardware acceleration is enabled

### GitHub Pages Deployment Issues

1. **404 Error on GitHub Pages**
   - Verify repository name matches URL
   - Check that GitHub Pages is enabled in repository settings
   - Ensure `index.html` is in the root directory

2. **Assets not loading**
   - Use relative paths for all assets
   - Check case sensitivity in file names
   - Verify all referenced files exist in the repository

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎮 Credits

- **Game Engine**: [Phaser 3](https://phaser.io/)
- **Framework**: Vanilla JavaScript + HTML5 Canvas
- **Deployment**: GitHub Pages
- **Development**: Festival Fire Fighter Team

---

**Ready to fight some fires?** 🚒💨🔥

Deploy your game and start extinguishing those festival fires! 