// GameScene.js - Main gameplay scene with enhanced Phaser features

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init() {
        console.log('🔄 GameScene.init() - Resetting scene state...');
        
        // Reset ALL scene state completely
        this.gameEnding = false;
        this.transitionInProgress = false;
        
        // Initialize game data
        this.gameData = {
            score: 0,
            timer: 60,
            fireCount: 0,
            isActive: false
        };
        
        // Game settings
        this.gameSettings = {
            maxFires: 15,
            initialSpawnRate: 3000, // 3 seconds
            minSpawnRate: 1500, // 1.5 seconds minimum
            gameDuration: 60 // seconds
        };
        
        // Reset timers
        this.gameTimer = null;
        this.fireSpawnTimer = null;
        this.uiUpdateTimer = null;
        
        // Reset entities
        this.firefighter = null;
        this.fires = null;
        this.ground = null;
        
        // Reset collision tracking
        this.collisionObjects = [];
        
        // Reset debug tracking
        this.lastLoggedTime = -1;
        
        // Reset milestone flags
        this.showedHighFireWarning = false;
        this.showed100Milestone = false;
        
        console.log('✅ GameScene.init() complete - Scene state reset');
    }
    
    create() {
        console.log('🎮 Game Scene started');
        
        try {
            // Initialize game ending flag
            this.gameEnding = false;
            this.transitionInProgress = false;
            
            // Create background
            this.createBackground();
            
            // Create game entities
            this.createEntities();
            
            // Set up physics collisions
            this.setupCollisions();
            
            // Set up input
            this.setupInput();
            
            // Start game timer
            this.startGameTimer();
            
            // Start fire spawning
            this.startFireSpawning();
            
            // Set up UI updates
            this.setupUIUpdates();
            
            // Camera effects
            this.setupCamera();
            
            // Start ambient effects
            if (window.GameManagers.audio) {
                try {
                    window.GameManagers.audio.startAmbientSound();
                } catch (e) {
                    console.warn('Audio start error:', e);
                }
            }
            
            // Fade in from black
            this.cameras.main.fadeIn(1000, 0, 0, 0);
            
            console.log('✅ GameScene created successfully');
            
        } catch (error) {
            console.error('❌ Fatal error in GameScene.create():', error);
            
            // Emergency cleanup
            this.gameEnding = true;
            this.gameData.isActive = false;
            
            // Try to return to menu
            this.time.delayedCall(1000, () => {
                try {
                    this.scene.start('MenuScene');
                } catch (e) {
                    console.error('Failed to return to menu after error:', e);
                }
            });
        }
    }
    
    createBackground() {
        // Add the stage background image and scale it to fit the new canvas size
        const background = this.add.image(512, 384, 'stage-background');
        
        // Scale to fit the new 1024x768 canvas while maintaining aspect ratio
        const scaleX = 1024 / background.width;
        const scaleY = 768 / background.height;
        const scale = Math.max(scaleX, scaleY); // Use larger scale to fill canvas
        background.setScale(scale);
        
        // Set up collision areas based on the new canvas size and background layout
        // Ground level collision (gray ground area at bottom)
        this.ground = this.add.rectangle(512, 720, 1024, 100, 0x000000, 0); // Invisible collision
        this.physics.add.existing(this.ground, true); // Static body
        
        console.log('🏟️ Stage background loaded with scale:', scale);
    }
    
    createEntities() {
        console.log('🏗️ Creating game entities...');
        
        // Clean up any existing entities completely
        try {
            if (this.firefighter) {
                console.log('🧹 Destroying existing firefighter...');
                this.firefighter.destroy();
                this.firefighter = null;
            }
            
            if (this.fires) {
                console.log('🧹 Clearing existing fires...');
                this.fires.clear(true, true);
                this.fires.destroy();
                this.fires = null;
            }
        } catch (e) {
            console.warn('Entity cleanup warning:', e);
        }
        
        // Create firefighter on ground level (lower position on canvas)
        try {
            this.firefighter = new Firefighter(this, 512, 720);
            console.log('✅ Firefighter created');
        } catch (e) {
            console.error('Failed to create firefighter:', e);
            return;
        }
        
        // Create groups for game objects
        try {
            this.fires = this.physics.add.group({
                classType: Fire,
                maxSize: this.gameSettings.maxFires,
                runChildUpdate: true
            });
            console.log('✅ Fire group created');
        } catch (e) {
            console.error('Failed to create fire group:', e);
            return;
        }
        
        // Track game state
        this.gameData.isActive = true;
        
        if (window.GameManagers.ui) {
            window.GameManagers.ui.setGameActive(true);
        }
        
        console.log('✅ Game entities created successfully');
    }
    
    setupCollisions() {
        console.log('⚡ Setting up physics collisions...');
        
        // Clear any existing collision objects first
        if (this.collisionObjects && this.collisionObjects.length > 0) {
            this.collisionObjects.forEach(obj => {
                if (obj && obj.destroy) {
                    try {
                        obj.destroy();
                    } catch (e) {
                        console.warn('Old collision cleanup warning:', e);
                    }
                }
            });
        }
        
        // Reset collision tracking
        this.collisionObjects = [];
        
        // Safety check - make sure entities exist before setting up collisions
        if (!this.firefighter || !this.fires || !this.ground) {
            console.error('Cannot setup collisions - missing entities');
            return;
        }
        
        const waterParticles = this.firefighter.getWaterParticles();
        if (!waterParticles) {
            console.error('Cannot setup collisions - missing water particles');
            return;
        }
        
        try {
            // Water particles vs fires collision
            const waterFireOverlap = this.physics.add.overlap(
                waterParticles,
                this.fires,
                this.waterHitFire,
                null,
                this
            );
            this.collisionObjects.push(waterFireOverlap);
            
            // Firefighter vs ground collision
            const firefighterGroundCollider = this.physics.add.collider(this.firefighter, this.ground);
            this.collisionObjects.push(firefighterGroundCollider);
            
            // Water particles vs ground collision
            const waterGroundCollider = this.physics.add.collider(waterParticles, this.ground);
            this.collisionObjects.push(waterGroundCollider);
            
            console.log('✅ Physics collisions setup complete');
        } catch (e) {
            console.error('Failed to setup collisions:', e);
        }
        
        // NO fire vs ground collision - fires stay in black backdrop area
    }
    
    setupInput() {
        // Pause functionality
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.pauseKey.on('down', () => {
            this.togglePause();
        });
        
        // Debug keys (remove in production)
        if (window.debugGame) {
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F1).on('down', () => {
                window.debugGame.enablePhysicsDebug();
            });
        }
    }
    
    startGameTimer() {
        // Main game timer
        this.gameTimer = this.time.addEvent({
            delay: 100, // Update every 100ms for smooth timer
            callback: this.updateGameTimer,
            callbackScope: this,
            repeat: -1
        });
        
        this.startTime = this.time.now;
    }
    
    startFireSpawning() {
        // Initial fires
        this.spawnInitialFires();
        
        // Continuous fire spawning
        this.fireSpawnTimer = this.time.addEvent({
            delay: this.gameSettings.initialSpawnRate,
            callback: this.spawnRandomFire,
            callbackScope: this,
            repeat: -1
        });
    }
    
    spawnInitialFires() {
        // Spawn 2-4 initial fires
        const initialCount = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                this.spawnRandomFire();
            }, i * 800);
        }
    }
    
    spawnRandomFire() {
        if (this.fires.getLength() >= this.gameSettings.maxFires) {
            return; // Too many fires
        }
        
        // Random position ONLY on the actual stage platform (not sky/mountains)
        // Based on the image, the stage platform is roughly in the center area
        const stageLeft = 200;   // Start of actual stage platform
        const stageRight = 824;  // End of actual stage platform  
        const stageTop = 320;    // Top of stage platform (below the palace structures)
        const stageBottom = 420; // Bottom of stage platform (above the ground)
        
        const x = stageLeft + Math.random() * (stageRight - stageLeft - 40);
        const y = stageTop + Math.random() * (stageBottom - stageTop - 30);
        
        // Dynamic fire size based on time elapsed
        const timeElapsed = (this.time.now - this.startTime) / 1000;
        const difficultyFactor = Math.min(timeElapsed / 40, 1); // Max difficulty at 40 seconds
        
        let fireSize = 'small';
        const rand = Math.random();
        
        if (rand < 0.3 + (difficultyFactor * 0.3)) {
            fireSize = 'medium';
        }
        if (rand < 0.1 + (difficultyFactor * 0.2)) {
            fireSize = 'large';
        }
        
        // Create fire
        const fire = new Fire(this, x, y, fireSize);
        this.fires.add(fire);
        
        // Update fire count
        this.gameData.fireCount = this.fires.getLength();
        
        // Dynamic spawn rate (faster as time goes on)
        const newSpawnRate = Math.max(
            this.gameSettings.minSpawnRate,
            this.gameSettings.initialSpawnRate - (difficultyFactor * 1500)
        );
        
        if (this.fireSpawnTimer) {
            this.fireSpawnTimer.delay = newSpawnRate;
        }
        
        console.log(`🔥 Spawned ${fireSize} fire at (${Math.round(x)}, ${Math.round(y)}). Total fires: ${this.fires.getLength()}`);
    }
    
    setupUIUpdates() {
        // Regular UI updates
        this.uiUpdateTimer = this.time.addEvent({
            delay: 100,
            callback: this.updateUI,
            callbackScope: this,
            repeat: -1
        });
    }
    
    setupCamera() {
        // Camera setup - keep static like vanilla game
        this.cameras.main.setBounds(0, 0, 1024, 768);
        // No camera follow or effects - keep it static
    }
    
    update(time, delta) {
        // Primary safety check - if game is ending, don't do anything
        if (this.gameEnding) return;
        
        if (!this.gameData.isActive) return;
        
        // Update entities with safety checks
        if (this.firefighter && this.firefighter.update) {
            this.firefighter.update(time, delta);
        }
        
        // Check game conditions
        this.checkGameConditions();
        
        // Update particle effects
        this.updateParticleEffects();
    }
    
    updateGameTimer() {
        if (!this.gameData.isActive || this.gameEnding) return;
        
        const elapsed = (this.time.now - this.startTime) / 1000;
        this.gameData.timer = Math.max(0, this.gameSettings.gameDuration - elapsed);
        
        // Debug timer every 5 seconds
        if (Math.floor(elapsed) % 5 === 0 && Math.floor(elapsed) !== this.lastLoggedTime) {
            this.lastLoggedTime = Math.floor(elapsed);
            console.log(`⏰ Timer: ${Math.ceil(this.gameData.timer)}s remaining`);
        }
        
        // Check if time is up - with extra safety checks
        if (this.gameData.timer <= 0 && !this.gameEnding) {
            console.log('⏰ Time is up! Calling gameOver...');
            this.gameOver();
        }
    }
    
    updateUI() {
        if (!window.GameManagers.ui) return;
        
        // Update fire count
        this.gameData.fireCount = this.fires.getLength();
        
        // Send data to UI manager
        window.GameManagers.ui.updateGameData({
            score: this.gameData.score,
            timer: this.gameData.timer,
            fireCount: this.gameData.fireCount
        });
    }
    
    updateParticleEffects() {
        // No particle effects or camera shake - keep it static like vanilla
        const fireCount = this.fires.getLength();
        // Remove all camera effects to match vanilla game
    }
    
    waterHitFire(waterParticle, fire) {
        // Safety check - don't process collisions if game is ending
        if (this.gameEnding || !this.gameData.isActive) return;
        
        if (!waterParticle.active || !fire.active) return;
        
        // Water hits fire
        const wasExtinguished = fire.takeDamage(1);
        
        // Deactivate water particle
        waterParticle.hitFire(fire);
        
        if (wasExtinguished) {
            // Award points
            this.gameData.score += fire.getScoreValue();
            
            // Show score popup
            if (window.GameManagers.ui) {
                window.GameManagers.ui.showScorePopup(fire.getScoreValue(), fire.getFireSize());
            }
            
            // Remove fire from group
            this.fires.remove(fire);
            fire.destroy();
            
            // Update fire count
            this.gameData.fireCount = this.fires.getLength();
            
            console.log(`💧 Fire extinguished! Score: ${this.gameData.score}`);
        }
    }
    
    checkGameConditions() {
        // Only lose condition is time running out
        if (this.gameData.timer <= 0 && this.gameData.isActive) {
            this.gameOver();
        }
        
        // Achievement messages
        const fireCount = this.fires.getLength();
        if (fireCount >= 10 && !this.showedHighFireWarning) {
            this.showedHighFireWarning = true;
            if (window.GameManagers.ui) {
                window.GameManagers.ui.showNotification('🚨 Fire situation critical! 🚨', 2000);
            }
        }
        
        // Score milestones
        if (this.gameData.score >= 100 && !this.showed100Milestone) {
            this.showed100Milestone = true;
            if (window.GameManagers.ui) {
                window.GameManagers.ui.showNotification('🎉 100 Points! Great job! 🎉', 1500);
            }
        }
    }
    
    gameOver() {
        if (!this.gameData.isActive) return;
        
        // Set ending flag to prevent further updates
        this.gameEnding = true;
        this.gameData.isActive = false;
        
        console.log(`🏁 Game Over! Final Score: ${this.gameData.score}`);
        console.log('🏁 Showing Game Over Overlay...');
        
        // IMMEDIATE physics shutdown to prevent errors
        this.cleanupCollisions();
        
        // Stop all timers immediately
        if (this.gameTimer) {
            this.gameTimer.destroy();
            this.gameTimer = null;
        }
        if (this.fireSpawnTimer) {
            this.fireSpawnTimer.destroy();
            this.fireSpawnTimer = null;
        }
        if (this.uiUpdateTimer) {
            this.uiUpdateTimer.destroy();
            this.uiUpdateTimer = null;
        }
        
        // Stop audio
        if (window.GameManagers.audio) {
            try {
                window.GameManagers.audio.stopAmbientSound();
                window.GameManagers.audio.playGameOverSound();
            } catch (e) {
                console.warn('Audio cleanup failed:', e);
            }
        }
        
        // Notify UI to hide game elements
        if (window.GameManagers.ui) {
            try {
                window.GameManagers.ui.setGameActive(false);
            } catch (e) {
                console.warn('UI cleanup failed:', e);
            }
        }
        
        // Show game over overlay
        this.showGameOverOverlay();
    }
    
    showGameOverOverlay() {
        // Create dark overlay
        const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.8);
        overlay.setDepth(1000); // On top of everything
        
        // Game Over Title
        const gameOverTitle = this.add.text(512, 200, 'Time\'s Up!', {
            fontSize: '64px',
            fill: '#4A90E2',
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
        }).setOrigin(0.5).setDepth(1001);
        
        // Subtitle
        const subtitle = this.add.text(512, 260, 'The festival has ended!', {
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
        }).setOrigin(0.5).setDepth(1001);
        
        // Score container
        const scoreBg = this.add.rectangle(512, 350, 400, 120, 0x000000, 0.9);
        scoreBg.setStrokeStyle(4, 0xFFD700);
        scoreBg.setDepth(1001);
        
        // Final Score label
        const scoreLabel = this.add.text(512, 320, 'FINAL SCORE', {
            fontSize: '24px',
            fill: '#FFD700',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1002);
        
        // Score value
        const scoreValue = this.add.text(512, 360, this.gameData.score.toString(), {
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
        }).setOrigin(0.5).setDepth(1002);
        
        // Play Again button
        const playAgainButton = this.add.rectangle(412, 480, 200, 60, 0x4A90E2);
        playAgainButton.setStrokeStyle(4, 0x000000);
        playAgainButton.setDepth(1001);
        
        const playAgainText = this.add.text(412, 480, 'PLAY AGAIN', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1002);
        
        // Main Menu button
        const menuButton = this.add.rectangle(612, 480, 200, 60, 0x666666);
        menuButton.setStrokeStyle(4, 0x999999);
        menuButton.setDepth(1001);
        
        const menuText = this.add.text(612, 480, 'MAIN MENU', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1002);
        
        // Make buttons interactive
        playAgainButton.setInteractive({ useHandCursor: true });
        menuButton.setInteractive({ useHandCursor: true });
        
        // Play Again button interactions
        playAgainButton.on('pointerover', () => {
            playAgainButton.setFillStyle(0x357ABD);
            this.tweens.add({
                targets: [playAgainButton, playAgainText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        playAgainButton.on('pointerout', () => {
            playAgainButton.setFillStyle(0x4A90E2);
            this.tweens.add({
                targets: [playAgainButton, playAgainText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        playAgainButton.on('pointerdown', () => {
            if (!this.transitionInProgress) {
                this.restartGame();
            }
        });
        
        // Main Menu button interactions
        menuButton.on('pointerover', () => {
            menuButton.setFillStyle(0x888888);
            this.tweens.add({
                targets: [menuButton, menuText],
                scaleX: 1.1,
                scaleY: 1.1,
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
            if (!this.transitionInProgress) {
                this.goToMainMenu();
            }
        });
        
        // Keyboard controls
        this.input.keyboard.once('keydown-ENTER', () => {
            if (!this.transitionInProgress) {
                this.restartGame();
            }
        });
        
        this.input.keyboard.once('keydown-ESC', () => {
            if (!this.transitionInProgress) {
                this.goToMainMenu();
            }
        });
        
        // Add glow effect to score
        this.tweens.add({
            targets: scoreValue,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Title animation
        this.tweens.add({
            targets: gameOverTitle,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    restartGame() {
        if (this.transitionInProgress) return;
        
        this.transitionInProgress = true;
        console.log('🔄 Restarting game...');
        
        // Play sound effect
        if (window.GameManagers.audio) {
            try {
                window.GameManagers.audio.playMenuSound();
            } catch (e) {
                console.warn('Audio error during restart:', e);
            }
        }
        
        // Clean up collision system before restart
        this.cleanupCollisions();
        
        try {
            // Restart the current scene immediately
            this.scene.restart();
        } catch (e) {
            console.error('Scene restart error:', e);
            // Reset flag if restart fails
            this.transitionInProgress = false;
        }
    }
    
    goToMainMenu() {
        if (this.transitionInProgress) return;
        
        this.transitionInProgress = true;
        console.log('📋 Going to main menu...');
        
        // Play sound effect
        if (window.GameManagers.audio) {
            try {
                window.GameManagers.audio.playMenuSound();
            } catch (e) {
                console.warn('Audio error during menu transition:', e);
            }
        }
        
        // Clean up collision system before transition
        this.cleanupCollisions();
        
        try {
            // Go to menu scene immediately
            this.scene.start('MenuScene');
        } catch (e) {
            console.error('Menu scene start error:', e);
            // Reset flag if scene start fails
            this.transitionInProgress = false;
        }
    }
    
    togglePause() {
        if (this.scene.isPaused()) {
            this.scene.resume();
            if (window.GameManagers.ui) {
                window.GameManagers.ui.hidePauseScreen();
            }
        } else {
            this.scene.pause();
            if (window.GameManagers.ui) {
                window.GameManagers.ui.showPauseScreen();
            }
        }
    }
    
    // Public method for fire spreading
    trySpawnFire(x, y, size = 'small') {
        if (this.fires.getLength() >= this.gameSettings.maxFires) {
            return false; // Can't spawn more fires
        }
        
        // Check distance from existing fires
        let tooClose = false;
        this.fires.children.entries.forEach(fire => {
            const distance = Phaser.Math.Distance.Between(x, y, fire.x, fire.y);
            if (distance < 60) {
                tooClose = true;
            }
        });
        
        if (!tooClose) {
            const fire = new Fire(this, x, y, size);
            this.fires.add(fire);
            this.gameData.fireCount = this.fires.getLength();
            return true;
        }
        
        return false;
    }
    
    getGameData() {
        return this.gameData;
    }
    
    cleanupCollisions() {
        console.log('🧹 Cleaning up collision system...');
        
        // Set ending flag FIRST to prevent any further updates
        this.gameEnding = true;
        this.gameData.isActive = false;
        
        // Stop entities from updating BEFORE stopping physics
        try {
            if (this.fires && this.fires.children && this.fires.children.entries) {
                this.fires.children.entries.forEach(fire => {
                    if (fire) {
                        // Mark fire as inactive to stop its update loop
                        fire.setActive(false);
                        fire.setVisible(false);
                        // Remove physics body safely
                        if (fire.body) {
                            fire.body.enable = false;
                        }
                    }
                });
                console.log('✅ Fire entities deactivated');
            }
            
            if (this.firefighter) {
                this.firefighter.setActive(false);
                // Deactivate water particles group to prevent updates
                const waterParticles = this.firefighter.getWaterParticles();
                if (waterParticles && waterParticles.children && waterParticles.children.entries) {
                    waterParticles.children.entries.forEach(particle => {
                        if (particle) {
                            particle.setActive(false);
                            if (particle.body) {
                                particle.body.enable = false;
                            }
                        }
                    });
                }
                if (this.firefighter.body) {
                    this.firefighter.body.enable = false;
                }
                console.log('✅ Firefighter and water particles deactivated');
            }
            
            if (this.ground && this.ground.body) {
                this.ground.body.enable = false;
                console.log('✅ Ground physics disabled');
            }
        } catch (e) {
            console.warn('Entity deactivation warning:', e);
        }
        
        // Now safely pause physics after entities are inactive
        if (this.physics && this.physics.world) {
            try {
                this.physics.pause();
                console.log('✅ Physics paused successfully');
            } catch (e) {
                console.warn('Physics pause warning:', e);
            }
        }
        
        // Destroy stored collision objects (our manual tracking)
        if (this.collisionObjects) {
            this.collisionObjects.forEach(collisionObject => {
                if (collisionObject && collisionObject.destroy) {
                    try {
                        collisionObject.destroy();
                    } catch (e) {
                        console.warn('Collision object cleanup warning:', e);
                    }
                }
            });
            this.collisionObjects = [];
            console.log('✅ Collision objects cleared');
        }
    }
} 