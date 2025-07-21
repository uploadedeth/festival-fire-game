// main-phaser.js - Phaser Game Initialization

class FestivalFireFighterGame {
    constructor() {
        // Initialize global managers object
        window.GameManagers = {};
        
        // Get loading screen elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.querySelector('.loading-progress');
        this.loadingText = document.querySelector('.loading-text');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.loadingSteps = document.querySelectorAll('.loading-step');
        
        // Initialize iframe communication
        this.isInIframe = window.self !== window.top;
        this.setupCommunication();
        
        // Initialize game
        this.init();
    }
    
    init() {
        // Show loading screen
        this.showLoadingScreen();
        
        // Initialize the game after a short delay for loading screen
        setTimeout(() => {
            this.createGame();
        }, 500);
    }
    
    setupCommunication() {
        if (this.isInIframe) {
            // Listen for messages from parent window
            window.addEventListener('message', (event) => {
                // Security check - ensure message is from expected origin
                // In production, replace with your domain
                if (event.origin !== window.location.origin && event.origin !== 'https://your-nextjs-app.com') {
                    return;
                }
                
                const { type, data } = event.data;
                
                switch (type) {
                    case 'PAUSE_GAME':
                        this.pause();
                        break;
                    case 'RESUME_GAME':
                        this.resume();
                        break;
                    case 'RESTART_GAME':
                        this.restart();
                        break;
                    case 'GET_GAME_STATE':
                        this.sendGameState();
                        break;
                    case 'MUTE_AUDIO':
                        if (window.GameManagers.audio) {
                            window.GameManagers.audio.mute();
                        }
                        break;
                    case 'UNMUTE_AUDIO':
                        if (window.GameManagers.audio) {
                            window.GameManagers.audio.unmute();
                        }
                        break;
                }
            });
            
            // Send initial ready message to parent
            this.postMessageToParent('GAME_READY', {
                gameVersion: '2.0.0',
                timestamp: Date.now()
            });
        }
    }
    
    postMessageToParent(type, data = {}) {
        if (this.isInIframe && window.parent) {
            window.parent.postMessage({
                type: type,
                data: data,
                source: 'festival-fire-fighter'
            }, '*');
        }
    }
    
    sendGameState() {
        if (this.game && this.game.scene.isActive('GameScene')) {
            const gameScene = this.game.scene.getScene('GameScene');
            this.postMessageToParent('GAME_STATE', {
                score: gameScene.score || 0,
                timeRemaining: gameScene.timeRemaining || 60,
                firesRemaining: gameScene.fires ? gameScene.fires.children.entries.length : 0,
                gameState: 'playing'
            });
        } else if (this.game && this.game.scene.isActive('GameOverScene')) {
            const gameOverScene = this.game.scene.getScene('GameOverScene');
            this.postMessageToParent('GAME_STATE', {
                score: gameOverScene.finalScore || 0,
                gameState: 'game_over',
                victory: gameOverScene.victory || false
            });
        } else {
            this.postMessageToParent('GAME_STATE', {
                gameState: 'menu'
            });
        }
    }
    
    setupGameEventListeners() {
        if (this.isInIframe) {
            // Listen for custom game events and send to parent
            document.addEventListener('gameStart', () => {
                this.postMessageToParent('GAME_STARTED');
            });
            
            document.addEventListener('gameEnd', (event) => {
                this.postMessageToParent('GAME_ENDED', {
                    victory: event.detail.victory,
                    score: event.detail.score,
                    timeRemaining: event.detail.timeRemaining
                });
            });
            
            document.addEventListener('scoreUpdate', (event) => {
                this.postMessageToParent('SCORE_UPDATE', {
                    score: event.detail.score,
                    points: event.detail.points
                });
            });
            
            document.addEventListener('fireExtinguished', (event) => {
                this.postMessageToParent('FIRE_EXTINGUISHED', {
                    firesRemaining: event.detail.firesRemaining
                });
            });
        }
    }
    
    createGame() {
        try {
            // Check if all required scene classes are available
            console.log('Checking scene classes...');
            console.log('BootScene:', typeof BootScene);
            console.log('MenuScene:', typeof MenuScene);
            console.log('GameScene:', typeof GameScene);
            console.log('GameOverScene:', typeof GameOverScene);
            console.log('GameConfig:', typeof GameConfig);
            
            // Create the Phaser game instance
            this.game = new Phaser.Game(GameConfig);
            
            // Set up global game reference
            window.phaserGame = this.game;
            
            // Set up game event listeners for iframe communication
            this.setupGameEventListeners();
            
            // Set up loading progress tracking
            this.setupLoadingTracking();
            
            console.log('🎮 Festival Fire Fighter - Phaser Edition initialized!');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            console.error('Error stack:', error.stack);
            this.showError('Failed to load game. Please refresh and try again.');
        }
    }
    
    setupLoadingTracking() {
        // Track loading progress across all scenes with festival branding
        let currentStep = 0;
        let loadingSteps = [
            { text: 'Setting up the festival stage...', progress: 15, stepIndex: 0 },
            { text: 'Igniting the fires...', progress: 35, stepIndex: 1 },
            { text: 'Charging the water cannons...', progress: 60, stepIndex: 2 },
            { text: 'Preparing the firefighter...', progress: 85, stepIndex: 3 },
            { text: 'Festival Fire Fighter ready!', progress: 100, stepIndex: 3 }
        ];

        const updateLoading = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                this.updateLoadingProgress(step.progress, step.text);
                this.updateLoadingSteps(step.stepIndex);
                currentStep++;
                
                if (currentStep < loadingSteps.length) {
                    setTimeout(updateLoading, 800); // Slightly slower for better UX
                } else {
                    setTimeout(() => this.hideLoadingScreen(), 1000);
                }
            }
        };

        // Start loading animation
        setTimeout(updateLoading, 500);
    }
    
    updateLoadingSteps(activeIndex) {
        if (this.loadingSteps) {
            this.loadingSteps.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index < activeIndex) {
                    step.classList.add('completed');
                } else if (index === activeIndex) {
                    step.classList.add('active');
                }
            });
        }
    }
    
    showLoadingScreen() {
        this.loadingScreen.classList.remove('hidden');
        this.updateLoadingProgress(0, 'Initializing game...');
    }
    
    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        
        // Enable mobile controls if on touch device
        if (this.isTouchDevice()) {
            document.getElementById('mobile-controls').classList.remove('hidden');
        }
    }
    
    updateLoadingProgress(percentage, text) {
        if (this.loadingProgress) {
            this.loadingProgress.style.width = `${percentage}%`;
        }
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
        if (this.loadingPercentage) {
            this.loadingPercentage.textContent = `${percentage}%`;
        }
    }
    
    showError(message) {
        if (this.loadingText) {
            this.loadingText.textContent = message;
            this.loadingText.style.color = '#ff6b6b';
        }
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Game control methods
    restart() {
        if (this.game && this.game.scene.isActive('GameScene')) {
            this.game.scene.restart('GameScene');
        } else {
            this.game.scene.start('GameScene');
        }
    }
    
    pause() {
        if (this.game && this.game.scene.isActive('GameScene')) {
            this.game.scene.pause('GameScene');
        }
    }
    
    resume() {
        if (this.game && this.game.scene.isPaused('GameScene')) {
            this.game.scene.resume('GameScene');
        }
    }
    
    destroy() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
    }
}

// Global game managers and utilities
window.GameManagers = {
    particle: null,
    audio: null,
    ui: null
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.festivalFireGame = new FestivalFireFighterGame();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.festivalFireGame && window.festivalFireGame.game) {
        if (document.hidden) {
            window.festivalFireGame.pause();
        } else {
            window.festivalFireGame.resume();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.festivalFireGame && window.festivalFireGame.game) {
        window.festivalFireGame.game.scale.refresh();
    }
});

// Expose global functions for debugging
window.debugGame = {
    restart: () => window.festivalFireGame.restart(),
    pause: () => window.festivalFireGame.pause(),
    resume: () => window.festivalFireGame.resume(),
    getGame: () => window.festivalFireGame.game,
    enablePhysicsDebug: () => {
        if (window.phaserGame && window.phaserGame.scene.isActive('GameScene')) {
            const scene = window.phaserGame.scene.getScene('GameScene');
            scene.physics.world.debugGraphic.setVisible(true);
        }
    }
}; 