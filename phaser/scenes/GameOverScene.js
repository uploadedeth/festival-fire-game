// GameOverScene.js - Game over screen with final score and restart

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        console.log('🎯 GameOverScene.init() called with data:', data);
        this.finalScore = data.finalScore || 0;
        this.firesExtinguished = data.firesExtinguished || 0;
        this.timeElapsed = data.timeElapsed || 60;
        console.log('🎯 GameOverScene init complete');
    }
    
    create() {
        console.log('🏁 GameOverScene.create() starting...');
        console.log('📊 Final Score received:', this.finalScore);
        console.log('🔥 Fires Extinguished:', this.firesExtinguished);
        
        try {
            // Create background
            this.createBackground();
            console.log('✅ Background created');
            
            // Create UI elements
            this.createUI();
            console.log('✅ UI created');
            
            // Set up input
            this.setupInput();
            console.log('✅ Input setup');
            
            // Fade in
            this.cameras.main.fadeIn(1000, 0, 0, 0);
            console.log('✅ Fade in started');
            
            console.log('✅ Game Over Scene setup complete');
        } catch (e) {
            console.error('❌ Error in GameOverScene.create():', e);
        }
    }
    
    createBackground() {
        // Dark overlay
        this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.7);
        
        // Game Over title
        const title = this.add.text(512, 200, 'TIME\'S UP!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            fill: '#ff6b6b',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 8,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Make title pulse
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createUI() {
        // Final Score display
        this.add.text(512, 300, 'FINAL SCORE', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(512, 350, this.finalScore.toString(), {
            fontSize: '72px',
            fontFamily: 'Arial',
            fill: '#4ecdc4',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 6,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Make score glow
        this.tweens.add({
            targets: scoreText,
            alpha: 0.8,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Stats
        this.add.text(512, 420, `Fires Extinguished: ${this.firesExtinguished}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Play Again button
        this.createPlayAgainButton();
        
        // Menu button
        this.createMenuButton();
    }
    
    createPlayAgainButton() {
        const buttonBg = this.add.rectangle(512, 520, 250, 60, 0xff6b6b);
        buttonBg.setStrokeStyle(3, 0xffffff);
        
        const buttonText = this.add.text(512, 520, 'PLAY AGAIN', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Make button interactive
        buttonBg.setInteractive({ useHandCursor: true });
        
        // Button effects
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0xee5a52);
            buttonBg.setScale(1.05);
            buttonText.setScale(1.05);
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0xff6b6b);
            buttonBg.setScale(1);
            buttonText.setScale(1);
        });
        
        buttonBg.on('pointerdown', () => {
            this.playAgain();
        });
        
        // Store references
        this.playAgainButton = { bg: buttonBg, text: buttonText };
    }
    
    createMenuButton() {
        const buttonBg = this.add.rectangle(512, 600, 200, 50, 0x555555);
        buttonBg.setStrokeStyle(2, 0xaaaaaa);
        
        const buttonText = this.add.text(512, 600, 'MAIN MENU', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Make button interactive
        buttonBg.setInteractive({ useHandCursor: true });
        
        // Button effects
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x777777);
            buttonBg.setScale(1.05);
            buttonText.setScale(1.05);
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x555555);
            buttonBg.setScale(1);
            buttonText.setScale(1);
        });
        
        buttonBg.on('pointerdown', () => {
            this.goToMenu();
        });
    }
    
    setupInput() {
        // Enter or Space to play again
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.enterKey.on('down', () => this.playAgain());
        this.spaceKey.on('down', () => this.playAgain());
        
        // Escape to menu
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escapeKey.on('down', () => this.goToMenu());
    }
    
    playAgain() {
        console.log('🔄 Starting new game...');
        
        // Play sound effect
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playButtonSound();
        }
        
        // Fade out and start new game
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
    
    goToMenu() {
        console.log('📋 Returning to menu...');
        
        // Play sound effect
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playButtonSound();
        }
        
        // Fade out and go to menu
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
} 