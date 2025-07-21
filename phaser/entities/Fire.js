// Fire.js - Enhanced fire entity with movement, effects, and interactions

class Fire extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, size = 'medium') {
        // Use the fire sprite sheet
        super(scene, x, y, 'fire');
        
        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Initialize properties
        this.fireSize = size;
        this.initProperties();
        this.setupPhysics();
        this.setupMovement();
        this.setupEffects();
        this.setupAnimation();
        
        console.log(`🔥 ${size} fire created at (${x}, ${y})`);
    }
    
    initProperties() {
        // Health system based on size
        const healthMap = {
            small: 2,
            medium: 4,
            large: 6
        };
        
        this.maxHealth = healthMap[this.fireSize];
        this.health = this.maxHealth;
        
        // Points awarded when extinguished
        const scoreMap = {
            small: 10,
            medium: 25,
            large: 50
        };
        
        this.scoreValue = scoreMap[this.fireSize];
        
        // Visual properties - ensure visibility
        this.originalScale = 1;
        this.setScale(1); // Ensure proper scale
        this.setAlpha(1); // Ensure fully visible
        this.setVisible(true); // Ensure visible
        this.isFlickering = false;
        this.damageFlash = false;
        
        // State tracking
        this.isExtinguished = false;
        this.lastHitTime = 0;
        this.lastDamageTime = 0; // Initialize damage timer
        this.hitCooldown = 200; // ms between hits
        
        // Danger properties - reduced
        this.burnRadius = this.fireSize === 'large' ? 40 : this.fireSize === 'medium' ? 30 : 20;
        this.spreadChance = this.fireSize === 'large' ? 0.001 : this.fireSize === 'medium' ? 0.0005 : 0.0001; // Much reduced
        
        // Create health bar
        this.createHealthBar();
    }
    
    setupPhysics() {
        // Physics body setup - fires fall down slowly
        this.setCollideWorldBounds(false);
        this.setBounce(0, 0); // No bouncing at all
        this.setDragX(0); // No horizontal drag
        this.setDragY(0); // No vertical drag initially
        
        // Enable gravity for falling effect - but use custom gravity
        this.body.setGravityY(0); // Disable scene gravity, we'll handle our own
        
        // Make fire immovable to other objects but allow falling
        this.body.setImmovable(false);
        
        // Adjust hitbox based on size
        const sizeMap = {
            small: { width: 16, height: 24 },
            medium: { width: 24, height: 32 },
            large: { width: 32, height: 40 }
        };
        
        const size = sizeMap[this.fireSize];
        this.body.setSize(size.width, size.height, true);
        
        // Set max velocity - allow vertical movement for falling
        this.body.setMaxVelocity(0, 100); // No horizontal movement, moderate falling speed
        
        // Set up custom falling behavior
        this.setupFalling();
    }
    
    setupFalling() {
        // Random falling speed for each fire
        this.fallSpeed = 15 + Math.random() * 25; // Random speed between 15-40 pixels/second
        this.targetY = 600; // Bottom area where fires should settle
        this.hasFallen = false;
        this.fallStartDelay = Math.random() * 1000; // Random delay before starting to fall (0-1 second)
        
        // Start falling after delay
        this.scene.time.delayedCall(this.fallStartDelay, () => {
            this.startFalling();
        });
        
        console.log(`🍃 Fire will fall at ${this.fallSpeed} px/s after ${this.fallStartDelay}ms delay`);
    }
    
    startFalling() {
        this.isFalling = true;
        console.log(`🍃 Fire starts falling from Y: ${this.y} to Y: ${this.targetY}`);
    }
    
    setupMovement() {
        // Remove all movement - fires stay static
        this.moveTimer = 0;
        this.moveInterval = 0;
        this.moveSpeed = 0;
        this.movementDirection = 0;
        
        // Original position for reference
        this.originalX = this.x;
        this.originalY = this.y;
        this.maxWanderDistance = 0; // No wandering
        
        // No movement - fires are completely static
        console.log('🔥 Fire movement disabled - static fire');
    }
    
    setupEffects() {
        // Temporarily disable particle effects to fix errors
        console.log(`🔥 Fire effects setup for ${this.fireSize} fire`);
        
        // Start fire animations
        this.startFireAnimation();
        
        // Start sound loop  
        this.startFireSounds();
    }
    
    setupAnimation() {
        // Start the appropriate fire animation based on size
        const animationKey = `fire-${this.fireSize}`;
        
        // Check if animation exists
        if (this.scene.anims.exists(animationKey)) {
            this.play(animationKey);
            console.log(`🎭 Playing fire animation: ${animationKey}`);
        } else {
            console.warn(`⚠️ Fire animation '${animationKey}' does not exist - creating fallback`);
            // Try to create animations if they don't exist
            this.createFallbackFireAnimations();
            
            // Try again after creating fallback
            if (this.scene.anims.exists(animationKey)) {
                this.play(animationKey);
            } else {
                // Ultimate fallback to first frame
                this.setFrame(0);
            }
        }
        
        // Set consistent scale for all fire sizes - no size variation to prevent glitching
        this.setScale(2.0); // Fixed scale for all fires for clean appearance
        
        // Ensure fire is fully visible and clean
        this.setAlpha(1);
        this.setVisible(true);
        this.setTint(0xffffff);
        
        // Fix origin for consistent positioning
        this.setOrigin(0.5, 1); // Bottom center origin for ground placement
    }
    
    createFallbackFireAnimations() {
        // Create simple animations using the first few frames
        if (!this.textures.exists('fire')) {
            console.warn('⚠️ Fire texture does not exist');
            return;
        }
        
        try {
            const texture = this.textures.get('fire');
            const frameCount = texture.frameTotal;
            console.log(`🔥 Creating fallback fire animations with ${frameCount} frames`);
            
            // Create basic animations using available frames
            if (frameCount >= 4) {
                this.scene.anims.create({
                    key: 'fire-small',
                    frames: this.scene.anims.generateFrameNumbers('fire', { start: 0, end: Math.min(3, frameCount - 1) }),
                    frameRate: 8,
                    repeat: -1
                });
                
                this.scene.anims.create({
                    key: 'fire-medium',
                    frames: this.scene.anims.generateFrameNumbers('fire', { start: 0, end: Math.min(3, frameCount - 1) }),
                    frameRate: 8,
                    repeat: -1
                });
                
                this.scene.anims.create({
                    key: 'fire-large',
                    frames: this.scene.anims.generateFrameNumbers('fire', { start: 0, end: Math.min(3, frameCount - 1) }),
                    frameRate: 8,
                    repeat: -1
                });
                
                console.log('✅ Fallback fire animations created');
            }
        } catch (error) {
            console.error('❌ Error creating fallback fire animations:', error);
        }
    }
    
    startRandomMovement() {
        // No movement - fires are completely static
        console.log('🔥 Fire is static - no movement tweens');
        // Remove all movement tweens
    }
    
    startFireAnimation() {
        // Remove all visual effects - keep fire static and clean
        this.setAlpha(1);
        this.setVisible(true);
        this.setScale(1);
        this.setTint(0xffffff); // No tint effects
    }
    
    startFireSounds() {
        // Remove ambient fire crackling - keep sounds minimal
        return;
    }
    
    update(time, delta) {
        if (this.isExtinguished) return;
        
        // Handle falling behavior
        this.updateFalling(delta);
        
        // Simplified update - only essential updates to prevent glitching
        this.updateEffects(delta);
        this.updateHealthBar(); // Update health bar position
        this.constrainPosition(); // Keep in bounds
        
        // Much reduced fire spreading chance
        if (Math.random() < this.spreadChance * 0.01) { // Very infrequent spreading
            this.attemptSpread();
        }
    }
    
    updateFalling(delta) {
        if (this.isFalling && !this.hasFallen) {
            // Check if fire has reached the bottom
            if (this.y >= this.targetY) {
                // Fire has reached the bottom, stop falling
                this.setY(this.targetY);
                this.setVelocityY(0);
                this.hasFallen = true;
                this.isFalling = false;
                console.log(`🔥 Fire settled at bottom Y: ${this.y}`);
            } else {
                // Continue falling at custom speed
                this.setVelocityY(this.fallSpeed);
            }
        } else if (this.hasFallen) {
            // Fire has settled, keep it static
            this.setVelocity(0, 0);
        } else {
            // Fire hasn't started falling yet, keep it static
            this.setVelocity(0, 0);
        }
    }
    
    // Removed updateMovement method - movement now handled only by tweens
    
    updateEffects(delta) {
        // Remove all visual effects - keep fire clean and static
        this.setAlpha(1);
        this.setScale(1);
        this.setTint(0xffffff);
        
        // Remove damage flash effect
        this.damageFlash = 0;
    }
    
    updateDanger(delta) {
        // Check if firefighter is too close (damage dealer)
        if (this.scene.firefighter) {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y,
                this.scene.firefighter.x, this.scene.firefighter.y
            );
            
            if (distance < this.burnRadius && this.scene.time.now - this.lastDamageTime > 1000) {
                this.burnFirefighter();
                this.lastDamageTime = this.scene.time.now;
            }
        }
    }
    
    constrainPosition() {
        // Keep fire within the actual stage platform bounds horizontally
        // But allow vertical falling until they reach the bottom
        const stageLeft = 200;   // Start of actual stage platform
        const stageRight = 824;  // End of actual stage platform
        
        // Only constrain horizontally, let fires fall vertically
        if (this.x < stageLeft) {
            this.setX(stageLeft);
        } else if (this.x > stageRight - 40) {
            this.setX(stageRight - 40);
        }
        
        // Don't constrain Y position while falling - let gravity work
        // Only stop horizontal movement, preserve vertical falling
        if (!this.isFalling || this.hasFallen) {
            this.setVelocityX(0); // No horizontal movement
        }
    }
    
    takeDamage(amount = 1) {
        if (this.isExtinguished) return false;
        
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastHitTime < this.hitCooldown) {
            return false; // Hit too soon
        }
        
        this.lastHitTime = currentTime;
        this.health -= amount;
        
        // Visual feedback - keep minimal
        this.damageFlash = 0; // No flash
        this.setTint(0xffffff); // No blue flash
        
        // Don't interfere with falling behavior
        // Only stop horizontal movement, preserve vertical falling if active
        if (!this.isFalling || this.hasFallen) {
            this.setVelocity(0, 0); // Only stop movement if not falling
        } else {
            this.setVelocityX(0); // Stop horizontal, preserve falling
        }
        
        // No screen shake - keep it static like vanilla
        
        // Sound effect when water hits fire
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playFireHitSound();
        }
        
        // Update flicker intensity
        this.updateFlickerIntensity();
        
        // Update health bar display
        this.updateHealthBar();
        
        // Check if extinguished
        if (this.health <= 0) {
            this.extinguish();
            return true; // Fire extinguished
        }
        
        console.log(`🔥 Fire hit! Health: ${this.health}/${this.maxHealth}`);
        return false; // Fire still burning
    }
    
    updateFlickerIntensity() {
        // More intense flickering as health decreases
        const healthPercent = this.health / this.maxHealth;
        const flickerSpeed = 100 + (1 - healthPercent) * 200;
        
        if (this.flickerTween) {
            this.flickerTween.timeScale = 1 + (1 - healthPercent);
        }
    }
    
    extinguish() {
        if (this.isExtinguished) return;
        
        this.isExtinguished = true;
        
        console.log(`🌊 Fire extinguished! +${this.scoreValue} points`);
        
        // Stop particle effects and start extinguish effect
        if (window.GameManagers.particle) {
            window.GameManagers.particle.stopFireEffect(this.x, this.y);
            window.GameManagers.particle.createExtinguishEffect(this.x, this.y);
        }
        
        // Play extinguish sound
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playFireExtinguishSound();
        }
        
        // Award points
        if (this.scene.gameData) {
            this.scene.gameData.score += this.scoreValue;
            
            // Show score popup
            if (window.GameManagers.ui) {
                window.GameManagers.ui.showScorePopup(this.scoreValue, this.fireSize);
            }
        }
        
        // Simple extinguish animation - minimal effects
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 300, // Faster, simpler fade
            ease: 'Linear',
            onComplete: () => {
                this.destroy();
            }
        });
        
        // No tweens to stop anymore
        
        // No screen effect - keep it static like vanilla
    }
    
    burnFirefighter() {
        if (this.scene.firefighter) {
            this.scene.firefighter.takeDamage();
            
            // Create burn effect
            if (window.GameManagers.particle) {
                window.GameManagers.particle.createBurnEffect(
                    this.scene.firefighter.x, 
                    this.scene.firefighter.y
                );
            }
        }
    }
    
    attemptSpread() {
        // Try to spawn a new fire nearby within stage area
        const spreadDistance = 80 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        const newX = this.x + Math.cos(angle) * spreadDistance;
        const newY = this.y + Math.sin(angle) * spreadDistance;
        
        // Check if position is valid within the actual stage platform bounds
        const stageLeft = 200;   // Start of actual stage platform
        const stageRight = 824;  // End of actual stage platform
        const stageTop = 320;    // Top of stage platform (below palace structures)
        const stageBottom = 420; // Bottom of stage platform (above ground)
        
        if (newX >= stageLeft && newX <= stageRight - 40 && 
            newY >= stageTop && newY <= stageBottom - 30) {
            // Notify scene to try spawning new fire
            if (this.scene.trySpawnFire) {
                this.scene.trySpawnFire(newX, newY, 'small');
            }
        }
    }
    
    stopAllTweens() {
        if (this.movementTween) this.movementTween.stop();
        if (this.jitterTween) this.jitterTween.stop();
        if (this.flickerTween) this.flickerTween.stop();
        
        if (this.soundTimer) {
            this.soundTimer.destroy();
        }
    }
    
    getBounds() {
        // Return collision bounds - with safety checks
        if (!this.body) {
            // Return default bounds based on fire size
            const defaultSize = this.fireSize === 'large' ? 32 : this.fireSize === 'medium' ? 24 : 16;
            return new Phaser.Geom.Rectangle(
                this.x - defaultSize / 2,
                this.y - defaultSize / 2,
                defaultSize,
                defaultSize
            );
        }
        
        return new Phaser.Geom.Rectangle(
            this.x - this.body.width / 2,
            this.y - this.body.height / 2,
            this.body.width,
            this.body.height
        );
    }
    
    getFireSize() {
        return this.fireSize;
    }
    
    getScoreValue() {
        return this.scoreValue;
    }
    
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
    
    createHealthBar() {
        // Create health bar background
        this.healthBarBg = this.scene.add.rectangle(this.x, this.y - 40, 32, 4, 0x000000, 0.8);
        this.healthBarBg.setOrigin(0, 0.5);
        
        // Create health bar fill
        this.healthBarFill = this.scene.add.rectangle(this.x, this.y - 40, 32, 4, 0xff0000, 1);
        this.healthBarFill.setOrigin(0, 0.5);
        
        // Update health bar display
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        if (this.healthBarBg && this.healthBarFill) {
            // Position health bar above fire
            const barX = this.x - 16; // Center the bar
            const barY = this.y - 40;
            
            this.healthBarBg.setPosition(barX, barY);
            this.healthBarFill.setPosition(barX, barY);
            
            // Update health bar width based on current health
            const healthPercent = this.health / this.maxHealth;
            this.healthBarFill.setScale(healthPercent, 1);
            
            // Change color based on health
            if (healthPercent > 0.6) {
                this.healthBarFill.setFillStyle(0x00ff00); // Green
            } else if (healthPercent > 0.3) {
                this.healthBarFill.setFillStyle(0xffff00); // Yellow
            } else {
                this.healthBarFill.setFillStyle(0xff0000); // Red
            }
        }
    }
    
    destroy() {
        try {
            // Clean up effects
            this.stopAllTweens();
            
            // Stop particle effects
            if (window.GameManagers.particle && !this.isExtinguished) {
                window.GameManagers.particle.stopFireEffect(this.x, this.y);
            }
            
            // Clean up health bar
            if (this.healthBarBg) {
                this.healthBarBg.destroy();
                this.healthBarBg = null;
            }
            if (this.healthBarFill) {
                this.healthBarFill.destroy();
                this.healthBarFill = null;
            }
        } catch (e) {
            console.warn('Fire cleanup warning:', e);
        }
        
        super.destroy();
    }
} 