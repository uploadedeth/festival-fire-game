// GameOverScene.js - Game over screen matching menu design

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
        
        try {
            // Create same background as menu
            this.createBackground();
            
            // Create game over title
            this.createTitle();
            
            // Create score display in center
            this.createScoreDisplay();
            
            // Create Play Again button
            this.createPlayAgainButton();
            
            // Create stats in bottom corners (like menu)
            this.createStats();
            
            // Set up input
            this.setupInput();
            
            // Fade in
            this.cameras.main.fadeIn(1000, 0, 0, 0);
            console.log('✅ Game Over Scene setup complete');
            
        } catch (e) {
            console.error('❌ Error in GameOverScene.create():', e);
        }
    }
    
    createBackground() {
        // Use the same stage background as the menu and game
        const background = this.add.image(512, 384, 'stage-background');
        
        // Scale to fit the 1024x768 canvas while maintaining aspect ratio
        const scaleX = 1024 / background.width;
        const scaleY = 768 / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);
        
        // Add the same dark overlay as the menu for consistency
        const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.6);
    }
    
    createTitle() {
        // Game over title in same style as menu
        const title = this.add.text(512, 160, 'Time\'s Up!', {
            fontSize: '64px',
            fill: '#4A90E2',  // Same blue as menu title
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
        const subtitle = this.add.text(512, 220, 'The festival has ended!', {
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
        
        // Simple title animation like menu
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
    
    createScoreDisplay() {
        // Score container in center (like menu's start button position)
        const scoreContainer = this.add.container(512, 350);
        
        // Background for score section
        const scoreBg = this.add.rectangle(0, 0, 400, 120, 0x000000, 0.8);
        scoreBg.setStrokeStyle(4, 0xFFD700);
        scoreContainer.add(scoreBg);
        
        // Final Score label
        const scoreLabel = this.add.text(0, -30, 'FINAL SCORE', {
            fontSize: '24px',
            fill: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        scoreContainer.add(scoreLabel);
        
        // Score value
        const scoreValue = this.add.text(0, 10, this.finalScore.toString(), {
            fontSize: '56px',
            fill: '#4ECDC4',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 6,
                fill: true
            }
        }).setOrigin(0.5);
        scoreContainer.add(scoreValue);
        
        // Make score glow
        this.tweens.add({
            targets: scoreValue,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createPlayAgainButton() {
        // Large play again button in same style as menu start button
        const playAgainButton = this.add.rectangle(512, 500, 300, 80, 0x4A90E2);  // Same blue as menu
        playAgainButton.setStrokeStyle(4, 0x000000);
        
        const playAgainText = this.add.text(512, 500, 'PLAY AGAIN', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Make button interactive
        playAgainButton.setInteractive({ useHandCursor: true });
        
        playAgainButton.on('pointerover', () => {
            playAgainButton.setFillStyle(0x357ABD);  // Same hover blue as menu
            this.tweens.add({
                targets: [playAgainButton, playAgainText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        playAgainButton.on('pointerout', () => {
            playAgainButton.setFillStyle(0x4A90E2);  // Original blue
            this.tweens.add({
                targets: [playAgainButton, playAgainText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        playAgainButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [playAgainButton, playAgainText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.playAgain();
                }
            });
        });
        
        // Smaller menu button below
        const menuButton = this.add.rectangle(512, 600, 200, 50, 0x666666);
        menuButton.setStrokeStyle(2, 0x999999);
        
        const menuText = this.add.text(512, 600, 'MAIN MENU', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        menuButton.setInteractive({ useHandCursor: true });
        
        menuButton.on('pointerover', () => {
            menuButton.setFillStyle(0x888888);
            this.tweens.add({
                targets: [menuButton, menuText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setFillStyle(0x666666);
            this.tweens.add({
                targets: [menuButton, menuText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        menuButton.on('pointerdown', () => {
            this.goToMenu();
        });
        
        this.playAgainButton = playAgainButton;
        this.playAgainText = playAgainText;
    }
    
    createStats() {
        // Stats in bottom right corner (like menu's points system)
        const statsContainer = this.add.container(850, 650);
        
        // Background for stats section
        const statsBg = this.add.rectangle(0, 0, 160, 100, 0x000000, 0.7);
        statsBg.setStrokeStyle(2, 0x4ECDC4);
        statsContainer.add(statsBg);
        
        // Stats title
        const statsTitle = this.add.text(0, -35, 'RESULTS', {
            fontSize: '16px',
            fill: '#4ECDC4',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        statsContainer.add(statsTitle);
        
        // Stats text
        const statsText = this.add.text(0, -5, `Fires: ${this.firesExtinguished}\nTime: ${this.timeElapsed}s\nScore: ${this.finalScore}`, {
            fontSize: '12px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        statsContainer.add(statsText);
        
        // Controls in bottom left corner (like menu)
        const controlsContainer = this.add.container(170, 650);
        
        // Background for controls section
        const controlsBg = this.add.rectangle(0, 0, 160, 100, 0x000000, 0.7);
        controlsBg.setStrokeStyle(2, 0xFFD700);
        controlsContainer.add(controlsBg);
        
        // Controls title
        const controlsTitle = this.add.text(0, -35, 'CONTROLS', {
            fontSize: '16px',
            fill: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        controlsContainer.add(controlsTitle);
        
        // Controls text
        const controlsText = this.add.text(0, -5, 'ENTER: Play Again\nESC: Main Menu\nClick buttons', {
            fontSize: '12px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        controlsContainer.add(controlsText);
    }
    
    setupInput() {
        // Enter or Space to play again
        this.input.keyboard.on('keydown-ENTER', () => {
            this.playAgain();
        });
        
        this.input.keyboard.on('keydown-SPACE', () => {
            this.playAgain();
        });
        
        // Escape to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.goToMenu();
        });
    }
    
    playAgain() {
        console.log('🔄 Starting new game...');
        
        // Play sound effect
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playMenuSound();
        }
        
        // Fade out and start new game (same functionality as menu's start game)
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
    
    goToMenu() {
        console.log('📋 Returning to menu...');
        
        // Play sound effect
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playMenuSound();
        }
        
        // Fade out and go to menu
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
} 