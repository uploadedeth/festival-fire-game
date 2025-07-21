# Festival Fire Fighter

A 2D browser-based firefighting game where players control a firefighter to extinguish fires on a festival stage within 60 seconds.

![Game Screenshot](https://via.placeholder.com/800x400/87CEEB/000000?text=Festival+Fire+Fighter)

## 🎮 Game Overview

Festival Fire Fighter is an action-packed game where you must race against time to extinguish all fires on a festival stage before the 60-second timer runs out. Use your water spray to put out fires, but watch out - fires can spread if left unattended!

### 🎯 Objective
- Extinguish all fires before the timer reaches zero
- Achieve the highest score possible
- Quick reflexes and strategic thinking required!

### 🏆 Scoring
- **Score Formula**: 1000 - (seconds_taken × 10)
- **Maximum Score**: 1000 points (instant completion)
- **Minimum Score**: 0 points

## 🕹️ Controls

### Keyboard Controls
- **Arrow Keys** or **A/D**: Move left and right
- **Spacebar**: Spray water (hold for continuous spray)
- **P**: Pause/Resume game
- **M**: Mute/Unmute audio

### Mobile Controls
On touch devices, on-screen buttons will appear:
- **←**: Move left
- **💧**: Spray water
- **→**: Move right

## 🎮 How to Play

1. **Start the Game**: Click "Start Game" from the main menu
2. **Move Around**: Use arrow keys or A/D to move your firefighter
3. **Spray Water**: Hold spacebar to spray water at fires
4. **Extinguish Fires**: Hit fires with water to damage them
5. **Watch the Timer**: You have 60 seconds to extinguish all fires
6. **Prevent Spreading**: Fires can spread to new locations if left burning
7. **Win**: Extinguish all fires before time runs out!

## 🔥 Game Mechanics

### Fire Types
- **Small Fires**: 2 hits to extinguish (20×30 pixels)
- **Medium Fires**: 4 hits to extinguish (30×40 pixels)  
- **Large Fires**: 6 hits to extinguish (40×50 pixels)

### Fire Behavior
- Fires spawn randomly on the festival stage
- After 8-15 seconds, fires may spread to nearby locations
- New fires can spawn every 12 seconds
- Maximum of 8 fires can exist at once

### Water Physics
- Water particles have realistic gravity
- Horizontal spread for natural spray pattern
- Limited particle count for optimal performance
- Visual feedback when hitting fires

## 🛠️ Technical Features

### Performance Optimized
- **60 FPS target** on modern browsers
- **Object pooling** for water particles
- **Efficient collision detection**
- **Canvas 2D rendering** with hardware acceleration

### Browser Compatibility
- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

### Mobile Support
- Responsive design
- Touch controls
- Optimized performance for mobile devices

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- No additional installations required!

### Running Locally
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start playing immediately!

### Using a Local Server (Optional)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
festival-fire-fighter/
├── index.html           # Main game page
├── style.css           # Game styling and responsive design
├── js/
│   ├── main.js         # Game initialization and main loop
│   ├── game.js         # Game state management
│   ├── firefighter.js  # Player character logic
│   ├── fire.js         # Fire entities and spawning
│   ├── water.js        # Water particle system
│   ├── collision.js    # Collision detection
│   ├── ui.js           # User interface management
│   └── audio.js        # Procedural sound effects
├── assets/
│   ├── sprites/        # Game sprites (unused - uses shapes)
│   └── sounds/         # Sound files (unused - uses Web Audio API)
├── README.md           # This file
├── CLAUDE.md           # Development specifications
├── PLANNING.md         # Project planning document
└── TASKS.md            # Development task breakdown
```

## 🎨 Features

### Visual Effects
- **Animated fires** with flickering flames
- **Particle effects** for water spray and smoke
- **Health bars** for fires showing damage
- **Visual feedback** when fires are hit
- **Dynamic lighting** effects

### Audio Effects
- **Procedural sound generation** using Web Audio API
- **Water spray** sound effects
- **Fire hit** and **extinguish** sounds
- **Victory** and **defeat** music
- **Mute/unmute** functionality

### User Interface
- **Responsive design** for all screen sizes
- **Real-time HUD** showing timer, fires, and score
- **Multiple game screens** (menu, victory, defeat, pause)
- **Smooth transitions** and animations
- **Mobile-friendly** touch controls

## 🔧 Debug Mode

Add `#debug` to the URL to enable debug features:
```
file:///path/to/index.html#debug
```

Debug features include:
- FPS counter display
- Console logging for game events
- Performance monitoring

## 🎯 Tips and Strategy

1. **Prioritize Large Fires**: They take more hits to extinguish
2. **Watch for Spread**: Keep fires from spreading by extinguishing quickly
3. **Use Spray Efficiently**: Don't waste water on empty areas
4. **Move Strategically**: Position yourself for optimal spray coverage
5. **Monitor Timer**: Keep an eye on remaining time
6. **Learn Fire Patterns**: Understand where fires tend to spawn

## 📱 Mobile Experience

The game is fully optimized for mobile devices:
- **Responsive canvas** scaling
- **Touch-friendly** controls
- **Optimized performance** for mobile browsers
- **Landscape orientation** recommended

## 🏗️ Development

### Built With
- **Vanilla JavaScript** (ES6+)
- **HTML5 Canvas** for rendering
- **CSS3** for styling and animations
- **Web Audio API** for sound effects

### Architecture
- **Modular design** with separate concerns
- **Entity-component system** for game objects
- **Object pooling** for performance
- **Event-driven** state management

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🆘 Support

Having issues? Check these common solutions:

### Audio Not Working
- Click on the game area to enable audio (browser security requirement)
- Press 'M' to unmute if audio is disabled
- Check browser audio settings

### Performance Issues
- Close other browser tabs
- Try a different browser
- Ensure hardware acceleration is enabled

### Mobile Controls Not Appearing
- Try refreshing the page
- Ensure you're on a touch device
- Check that JavaScript is enabled

## 🎉 Acknowledgments

- Inspired by classic arcade firefighting games
- Built following modern web development best practices
- Uses procedural audio generation for universal compatibility

---

**Enjoy fighting the festival fires! 🔥🚒💧** 