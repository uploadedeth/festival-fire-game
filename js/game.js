// game.js - Game state management and core logic

// Game states
const GameStates = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

// Main game manager
const GameManager = {
    state: GameStates.MENU,
    timer: 60,
    score: 0,
    currentFPS: 60,
    startTime: 0,
    
    // Scoring system
    FIRE_SCORES: {
        small: 10,
        medium: 25,
        large: 50
    },
    
    init() {
        this.state = GameStates.MENU;
        this.timer = 60;
        this.score = 0;
        this.currentFPS = 60;
    },
    
    startGame() {
        this.state = GameStates.PLAYING;
        this.timer = 60;
        this.score = 0;
        this.startTime = Date.now();
        
        // Reset all game objects
        firefighter.reset();
        WaterSystem.reset();
        FireManager.reset();
        FireManager.startContinuousSpawning(); // Start continuous fire spawning
        
        // Update UI
        UI.updateHUD();
        UI.hideAllScreens();
        
        // Show mobile controls on touch devices
        if (this.isTouchDevice()) {
            document.getElementById('mobile-controls').classList.remove('hidden');
        }
        
        console.log('60-second Fire Fighting Challenge started!');
    },
    
    pauseGame() {
        if (this.state === GameStates.PLAYING) {
            this.state = GameStates.PAUSED;
            UI.showScreen('pause-screen');
        }
    },
    
    resumeGame() {
        if (this.state === GameStates.PAUSED) {
            this.state = GameStates.PLAYING;
            UI.hideAllScreens();
        }
    },
    
    returnToMenu() {
        this.state = GameStates.MENU;
        UI.showScreen('menu-screen');
        document.getElementById('mobile-controls').classList.add('hidden');
    },
    
    updateTimer(deltaTime) {
        if (this.state === GameStates.PLAYING) {
            this.timer -= deltaTime;
            
            // Clamp timer to 0
            if (this.timer < 0) {
                this.timer = 0;
            }
            
            // Update timer display
            UI.updateTimer();
        }
    },
    
    checkGameConditions() {
        // Check if time is up (only defeat condition now)
        if (this.timer <= 0 && this.state === GameStates.PLAYING) {
            this.gameOver();
        }
        
        // No victory condition - game continues until timer expires
    },
    
    gameOver() {
        this.state = GameStates.GAME_OVER;
        UI.showGameOverScreen();
        AudioManager.playGameOverSound();
        
        // Hide mobile controls
        document.getElementById('mobile-controls').classList.add('hidden');
        
        console.log(`Game Over! Final Score: ${this.score} points in 60 seconds`);
    },
    
    addScore(fireSize) {
        const points = this.FIRE_SCORES[fireSize] || 0;
        this.score += points;
        
        // Update score display immediately
        UI.updateScore();
        
        // Show score popup for feedback
        UI.showScorePopup(points, fireSize);
        
        console.log(`+${points} points for ${fireSize} fire! Total: ${this.score}`);
    },
    
    getTimeRemaining() {
        return Math.max(0, this.timer);
    },
    
    getTimeElapsed() {
        return Math.max(0, 60 - this.timer);
    },
    
    // Utility functions
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

// Input handler for keyboard and touch controls
const InputHandler = {
    keys: {},
    touchState: {
        left: false,
        right: false,
        spray: false
    },
    
    init() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mobile touch events
        this.setupMobileControls();
        
        // Prevent context menu on canvas
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    },
    
    handleKeyDown(e) {
        this.keys[e.code] = true;
        
        // Handle pause
        if (e.code === 'KeyP' && GameManager.state === GameStates.PLAYING) {
            GameManager.pauseGame();
        } else if (e.code === 'KeyP' && GameManager.state === GameStates.PAUSED) {
            GameManager.resumeGame();
        }
        
        // Prevent default for game keys
        if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    },
    
    handleKeyUp(e) {
        this.keys[e.code] = false;
    },
    
    setupMobileControls() {
        // Left button
        const leftBtn = document.getElementById('move-left');
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchState.left = true;
        });
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchState.left = false;
        });
        
        // Right button
        const rightBtn = document.getElementById('move-right');
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchState.right = true;
        });
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchState.right = false;
        });
        
        // Spray button
        const sprayBtn = document.getElementById('spray-water');
        sprayBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchState.spray = true;
        });
        sprayBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchState.spray = false;
        });
    },
    
    // Check if a key is currently pressed
    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    },
    
    // Check if moving left
    isMovingLeft() {
        return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA') || this.touchState.left;
    },
    
    // Check if moving right
    isMovingRight() {
        return this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD') || this.touchState.right;
    },
    
    // Check if spraying water
    isSpraying() {
        return this.isKeyPressed('Space') || this.touchState.spray;
    }
}; 