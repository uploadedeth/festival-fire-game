// Fire.js - Enhanced fire entity with movement, effects, and interactions

class Fire extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, size = 'medium') {
        // Choose texture based on size
        const textureKey = `fire-${size}`;
        super(scene, x, y, textureKey);
        
        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Initialize properties
        this.fireSize = size;
        this.initProperties();
        this.setupPhysics();
        this.setupMovement();
        this.setupEffects();
        
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
        // Physics body setup - disable world bounds collision to prevent disappearing
        this.setCollideWorldBounds(false);
        this.setBounce(0.1, 0);
        this.setDragX(100); // Ground friction
        
        // Adjust hitbox based on size
        const sizeMap = {
            small: { width: 16, height: 24 },
            medium: { width: 24, height: 32 },
            large: { width: 32, height: 40 }
        };
        
        const size = sizeMap[this.fireSize];
        this.body.setSize(size.width, size.height, true);
        
        this.body.setMaxVelocity(80, 80); // Reduce max velocity to prevent fast movement
    }
    
    setupMovement() {
        // Random movement properties - reduced for stability
        this.moveTimer = 0;
        this.moveInterval = 2000 + Math.random() * 3000; // Slower movement changes
        this.moveSpeed = 10 + Math.random() * 15; // Reduced speed
        this.movementDirection = (Math.random() - 0.5) * 2; // -1 to 1
        
        // Original position for tethering
        this.originalX = this.x;
        this.originalY = this.y;
        this.maxWanderDistance = 30 + Math.random() * 20; // Reduced wander distance
        
        // Start movement with reduced intensity
        this.startRandomMovement();
    }
    
    setupEffects() {
        // Temporarily disable particle effects to fix errors
        console.log(`🔥 Fire effects setup for ${this.fireSize} fire`);
        
        // Start fire animations
        this.startFireAnimation();
        
        // Start sound loop  
        this.startFireSounds();
    }
    
    startRandomMovement() {
        // Gentle, smooth movement - less chaotic
        this.movementTween = this.scene.tweens.add({
            targets: this,
            x: this.originalX + (Math.random() - 0.5) * 40, // Small movement range
            duration: 3000 + Math.random() * 2000, // Slow movement
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 1000 // Random start delay
        });
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
        
        // Simplified update - only essential updates to prevent glitching
        this.updateEffects(delta);
        this.updateHealthBar(); // Update health bar position
        this.constrainPosition(); // Keep in bounds
        
        // Much reduced fire spreading chance
        if (Math.random() < this.spreadChance * 0.01) { // Very infrequent spreading
            this.attemptSpread();
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
        // Keep fire within expanded stage area bounds (full width)
        const stageLeft = 50;
        const stageRight = 974;
        const stageTop = 250;
        const stageBottom = 450;
        
        if (this.x < stageLeft) {
            this.setX(stageLeft);
            this.setVelocityX(Math.abs(this.body.velocity.x));
        } else if (this.x > stageRight - 40) {
            this.setX(stageRight - 40);
            this.setVelocityX(-Math.abs(this.body.velocity.x));
        }
        
        if (this.y < stageTop) {
            this.setY(stageTop);
            this.setVelocityY(Math.abs(this.body.velocity.y));
        } else if (this.y > stageBottom - 30) {
            this.setY(stageBottom - 30);
            this.setVelocityY(-Math.abs(this.body.velocity.y));
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
        
        // Physical reaction - keep minimal and reduce jumping
        const reactionForce = (Math.random() - 0.5) * 30; // Reduced horizontal force
        this.setVelocity(reactionForce, -5); // Much reduced vertical jump
        
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
        
        // Check if position is valid within expanded stage bounds
        const stageLeft = 50;
        const stageRight = 974;
        const stageTop = 250;
        const stageBottom = 450;
        
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
        // Return collision bounds
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
        // Clean up effects
        this.stopAllTweens();
        
        // Stop particle effects
        if (window.GameManagers.particle && !this.isExtinguished) {
            window.GameManagers.particle.stopFireEffect(this.x, this.y);
        }
        
        // Clean up health bar
        if (this.healthBarBg) {
            this.healthBarBg.destroy();
        }
        if (this.healthBarFill) {
            this.healthBarFill.destroy();
        }
        
        super.destroy();
    }
} 