// main-phaser.js - Phaser Game Initialization

class FestivalFireFighterGame {
    constructor() {
        this.game = null;
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.querySelector('.loading-progress');
        this.loadingText = document.querySelector('.loading-text');
        
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
        // Track loading progress across all scenes
        let totalProgress = 0;
        let loadingSteps = [
            { text: 'Loading fire textures...', progress: 20 },
            { text: 'Creating particle effects...', progress: 40 },
            { text: 'Setting up physics...', progress: 60 },
            { text: 'Initializing audio...', progress: 80 },
            { text: 'Ready to fight fires!', progress: 100 }
        ];
        
        let currentStep = 0;
        
        const updateLoading = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                this.updateLoadingProgress(step.progress, step.text);
                currentStep++;
                
                if (currentStep < loadingSteps.length) {
                    setTimeout(updateLoading, 600);
                } else {
                    setTimeout(() => this.hideLoadingScreen(), 800);
                }
            }
        };
        
        // Start loading animation
        setTimeout(updateLoading, 300);
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