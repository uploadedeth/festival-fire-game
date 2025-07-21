// MenuScene.js - Simple menu scene with clean layout

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Create same background as the game
        this.createBackground();
        
        // Create simple title
        this.createTitle();
        
        // Create start button
        this.createStartButton();
        
        // Create points system (bottom right)
        this.createPointsSystem();
        
        // Create controls (bottom left)
        this.createControls();
        
        // Set up input
        this.setupInput();
        
        console.log('🎪 Simple Menu Scene loaded');
    }
    
    createBackground() {
        // Use the same stage background as the game
        const background = this.add.image(512, 384, 'stage-background');
        
        // Scale to fit the 1024x768 canvas while maintaining aspect ratio
        const scaleX = 1024 / background.width;
        const scaleY = 768 / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);
        
        // Add the same dark overlay as the loading screen for consistency
        const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.6);
    }
    
    createTitle() {
        // Main game title
        const title = this.add.text(512, 200, 'Festival Fire Fighter', {
            fontSize: '64px',
            fill: '#4A90E2',  // Changed from red (#FF6B6B) to blue
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 8,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(512, 280, 'Extinguish fires and save the festival!', {
            fontSize: '24px',
            fill: '#4ECDC4',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Simple title animation
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createStartButton() {
        // Large start button in center
        const startButton = this.add.rectangle(512, 400, 300, 80, 0x4A90E2);  // Changed from red to blue
        startButton.setStrokeStyle(4, 0x000000);
        
        const startText = this.add.text(512, 400, 'START GAME', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Make button interactive
        startButton.setInteractive({ useHandCursor: true });
        
        startButton.on('pointerover', () => {
            startButton.setFillStyle(0x357ABD);  // Darker blue for hover
            this.tweens.add({
                targets: [startButton, startText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        startButton.on('pointerout', () => {
            startButton.setFillStyle(0x4A90E2);  // Original blue
            this.tweens.add({
                targets: [startButton, startText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        startButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [startButton, startText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.startGame();
                }
            });
        });
        
        this.startButton = startButton;
        this.startText = startText;
    }
    
    createPointsSystem() {
        // Points system in bottom right corner
        const pointsContainer = this.add.container(850, 650);
        
        // Background for points section
        const pointsBg = this.add.rectangle(0, 0, 160, 100, 0x000000, 0.7);
        pointsBg.setStrokeStyle(2, 0xFFD700);
        pointsContainer.add(pointsBg);
        
        // Points title
        const pointsTitle = this.add.text(0, -35, 'POINTS', {
            fontSize: '16px',
            fill: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        pointsContainer.add(pointsTitle);
        
        // Points breakdown
        const pointsText = this.add.text(0, -5, 'Small Fire: 10\nMedium Fire: 25\nLarge Fire: 50', {
            fontSize: '12px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        pointsContainer.add(pointsText);
    }
    
    createControls() {
        // Controls in bottom left corner
        const controlsContainer = this.add.container(170, 650);
        
        // Background for controls section
        const controlsBg = this.add.rectangle(0, 0, 160, 100, 0x000000, 0.7);
        controlsBg.setStrokeStyle(2, 0x4ECDC4);
        controlsContainer.add(controlsBg);
        
        // Controls title
        const controlsTitle = this.add.text(0, -35, 'CONTROLS', {
            fontSize: '16px',
            fill: '#4ECDC4',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        controlsContainer.add(controlsTitle);
        
        // Controls text
        const controlsText = this.add.text(0, -5, 'A/D: Move\nSPACE: Water\nP: Pause', {
            fontSize: '12px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        controlsContainer.add(controlsText);
        
        // Mobile hint if applicable
        if (this.isTouchDevice()) {
            const mobileHint = this.add.text(0, 25, 'Touch controls\navailable', {
                fontSize: '10px',
                fill: '#888888',
                fontFamily: 'Arial, sans-serif',
                align: 'center'
            }).setOrigin(0.5);
            controlsContainer.add(mobileHint);
        }
    }
    
    setupInput() {
        // Keyboard shortcuts
        this.input.keyboard.on('keydown-SPACE', () => {
            this.startGame();
        });
        
        this.input.keyboard.on('keydown-ENTER', () => {
            this.startGame();
        });
    }
    
    startGame() {
        // Play transition sound
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playMenuSound();
        }
        
        // Transition effect
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
} 