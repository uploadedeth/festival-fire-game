// MenuScene.js - Enhanced menu scene with Phaser UI

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Create background
        this.createBackground();
        
        // Create title and UI elements
        this.createTitle();
        this.createMenu();
        this.createInstructions();
        
        // Create ambient effects
        this.createAmbientEffects();
        
        // Set up input
        this.setupInput();
        
        console.log('🎪 Menu Scene loaded');
    }
    
    createBackground() {
        // Festival stage background
        const backdrop = this.add.image(400, 225, 'stage-backdrop').setOrigin(0.5, 0.5);
        backdrop.setScale(1.4);
        backdrop.setTint(0x444466);
        
        // Stage platform
        const platform = this.add.image(400, 525, 'stage-platform').setOrigin(0.5, 0.5);
        platform.setScale(1.3);
        
        // DJ booth
        const djBooth = this.add.image(400, 200, 'dj-booth').setOrigin(0.5, 0.5);
        djBooth.setScale(1.2);
        
        // Speakers
        const leftSpeaker = this.add.image(150, 300, 'speaker').setOrigin(0.5, 0.5);
        const rightSpeaker = this.add.image(650, 300, 'speaker').setOrigin(0.5, 0.5);
        
        // Add some visual effects to speakers
        this.tweens.add({
            targets: [leftSpeaker, rightSpeaker],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createTitle() {
        // Main title
        const title = this.add.text(400, 80, 'Festival Fire Fighter', {
            fontSize: '52px',
            fill: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(400, 130, 'Phaser Edition with Amazing Effects!', {
            fontSize: '24px',
            fill: '#4ECDC4',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Animate title
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Pulsing glow effect for subtitle
        this.tweens.add({
            targets: subtitle,
            alpha: 0.7,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createMenu() {
        // Challenge description
        const challengeText = this.add.text(400, 200, 'Survive 60 seconds of non-stop fire fighting!\nExtinguish fires to earn points:', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        // Scoring info
        const scoringInfo = this.add.text(400, 260, '🔥 Small Fire: 10 points\n🔥🔥 Medium Fire: 25 points\n🔥🔥🔥 Large Fire: 50 points', {
            fontSize: '18px',
            fill: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        
        // Start button
        const startButton = this.add.image(400, 350, 'button-bg').setOrigin(0.5);
        const startButtonHover = this.add.image(400, 350, 'button-hover').setOrigin(0.5).setVisible(false);
        const startText = this.add.text(400, 350, 'START CHALLENGE', {
            fontSize: '28px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Make button interactive
        startButton.setInteractive({ useHandCursor: true });
        
        startButton.on('pointerover', () => {
            startButton.setVisible(false);
            startButtonHover.setVisible(true);
            this.tweens.add({
                targets: [startButtonHover, startText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        startButton.on('pointerout', () => {
            startButton.setVisible(true);
            startButtonHover.setVisible(false);
            this.tweens.add({
                targets: [startButton, startText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        startButton.on('pointerdown', () => {
            // Button press effect
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
        
        // Store for hover effects
        this.startButton = startButton;
        this.startButtonHover = startButtonHover;
        this.startText = startText;
    }
    
    createInstructions() {
        // Controls section
        const controlsTitle = this.add.text(400, 420, 'CONTROLS:', {
            fontSize: '22px',
            fill: '#FF6B6B',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const controlsText = this.add.text(400, 470, '← → or A/D: Move    |    SPACEBAR: Spray Water    |    P: Pause', {
            fontSize: '18px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            align: 'center'
        }).setOrigin(0.5);
        
        // Mobile controls hint
        if (this.isTouchDevice()) {
            const mobileHint = this.add.text(400, 510, 'Touch controls will appear during gameplay', {
                fontSize: '16px',
                fill: '#4ECDC4',
                fontFamily: 'Arial, sans-serif',
                alpha: 0.8
            }).setOrigin(0.5);
        }
        
        // Version info
        const versionText = this.add.text(400, 550, 'Phaser Edition v2.0 - Enhanced with Particle Effects', {
            fontSize: '14px',
            fill: '#888888',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);
    }
    
    createAmbientEffects() {
        // Temporarily disable menu particle effects to prevent errors
        console.log('🎪 Menu ambient effects disabled temporarily');
        
        /* 
        // Create some menu-specific particle effects
        if (window.GameManagers.particle) {
            // Ambient sparkles around the title
            const sparkleConfig = {
                frame: 'spark-particle',
                x: { min: 200, max: 600 },
                y: { min: 50, max: 150 },
                speed: { min: 10, max: 30 },
                scale: { start: 0.3, end: 0 },
                alpha: { start: 0.8, end: 0 },
                tint: [0xFFD700, 0xFF6B6B, 0x4ECDC4],
                lifespan: { min: 2000, max: 4000 },
                quantity: 1,
                frequency: 1500,
                gravityY: -20
            };
            
            const menuSparkles = this.add.particles(400, 100, 'spark-particle', sparkleConfig);
            menuSparkles.start();
        }
        
        // Floating embers around the stage
        const emberConfig = {
            frame: 'ember-particle',
            x: { min: 100, max: 700 },
            y: 600,
            speed: { min: 5, max: 20 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.6, end: 0 },
            tint: [0xFF6347, 0xFF4500],
            lifespan: { min: 3000, max: 6000 },
            quantity: 1,
            frequency: 2000,
            gravityY: -15
        };
        
        const menuEmbers = this.add.particles(400, 600, 'ember-particle', emberConfig);
        menuEmbers.start();
        */
    }
    
    setupInput() {
        // Keyboard input
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