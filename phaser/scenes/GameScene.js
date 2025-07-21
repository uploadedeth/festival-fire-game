// GameScene.js - Main gameplay scene with enhanced Phaser features

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init() {
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
        
        // Debug tracking
        this.lastLoggedTime = -1;
    }
    
    create() {
        console.log('🎮 Game Scene started');
        
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
            window.GameManagers.audio.startAmbientSound();
        }
        
        // Fade in from black
        this.cameras.main.fadeIn(1000, 0, 0, 0);
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
        // Prevent multiple firefighter creation
        if (this.firefighter) {
            this.firefighter.destroy();
        }
        
        // Create firefighter on ground level (gray ground area at bottom) - scaled for new canvas
        this.firefighter = new Firefighter(this, 512, 680);
        
        // Clear any existing fires
        if (this.fires) {
            this.fires.clear(true, true);
        }
        
        // Create groups for game objects
        this.fires = this.physics.add.group({
            classType: Fire,
            maxSize: this.gameSettings.maxFires,
            runChildUpdate: true
        });
        
        // Track game state
        this.gameData.isActive = true;
        
        if (window.GameManagers.ui) {
            window.GameManagers.ui.setGameActive(true);
        }
        
        console.log('✅ Game entities created successfully');
    }
    
    setupCollisions() {
        // Water particles vs fires collision
        this.physics.add.overlap(
            this.firefighter.getWaterParticles(),
            this.fires,
            this.waterHitFire,
            null,
            this
        );
        
        // Firefighter vs ground collision
        this.physics.add.collider(this.firefighter, this.ground);
        
        // Water particles vs ground collision
        this.physics.add.collider(this.firefighter.getWaterParticles(), this.ground);
        
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
        
        // Random position on the stage platform area (scaled for new canvas size)
        // Expand to cover full stage width from left to right
        const stageLeft = 50;    // Much wider left edge
        const stageRight = 974;  // Much wider right edge (1024 - 50)
        const stageTop = 250;    // Top of stage area (where the palace structures are)
        const stageBottom = 450; // Bottom of stage area (platform level)
        
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
        if (!this.gameData.isActive) return;
        
        // Update entities
        if (this.firefighter) {
            this.firefighter.update(time, delta);
        }
        
        // Check game conditions
        this.checkGameConditions();
        
        // Update particle effects
        this.updateParticleEffects();
    }
    
    updateGameTimer() {
        if (!this.gameData.isActive) return;
        
        const elapsed = (this.time.now - this.startTime) / 1000;
        this.gameData.timer = Math.max(0, this.gameSettings.gameDuration - elapsed);
        
        // Debug timer every 5 seconds
        if (Math.floor(elapsed) % 5 === 0 && Math.floor(elapsed) !== this.lastLoggedTime) {
            this.lastLoggedTime = Math.floor(elapsed);
            console.log(`⏰ Timer: ${Math.ceil(this.gameData.timer)}s remaining`);
        }
        
        // Check if time is up
        if (this.gameData.timer <= 0) {
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
        
        this.gameData.isActive = false;
        
        console.log(`🏁 Game Over! Final Score: ${this.gameData.score}`);
        console.log('🏁 Preparing to show Game Over Scene...');
        
        // Stop all timers
        if (this.gameTimer) this.gameTimer.destroy();
        if (this.fireSpawnTimer) this.fireSpawnTimer.destroy();
        if (this.uiUpdateTimer) this.uiUpdateTimer.destroy();
        
        // Stop ambient sound
        if (window.GameManagers.audio) {
            window.GameManagers.audio.stopAmbientSound();
            window.GameManagers.audio.playGameOverSound();
        }
        
        // Stop all particle effects
        if (window.GameManagers.particle) {
            window.GameManagers.particle.stopAllEffects();
        }
        
        // Notify UI
        if (window.GameManagers.ui) {
            window.GameManagers.ui.setGameActive(false);
        }
        
        // Immediate transition to game over scene
        console.log('🏁 Starting GameOverScene transition...');
        this.scene.start('GameOverScene', {
            finalScore: this.gameData.score,
            firesExtinguished: Math.floor(this.gameData.score / 15), // Estimate based on average points
            timeElapsed: 60 // Fixed 60 seconds
        });
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
    
    destroy() {
        // Clean up
        if (this.gameTimer) this.gameTimer.destroy();
        if (this.fireSpawnTimer) this.fireSpawnTimer.destroy();
        if (this.uiUpdateTimer) this.uiUpdateTimer.destroy();
        
        super.destroy();
    }
} 