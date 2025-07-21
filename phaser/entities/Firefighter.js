// Firefighter.js - Enhanced firefighter entity with Phaser physics

class Firefighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'firefighter');
        
        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Scale the firefighter image appropriately - 50% bigger
        this.setScale(1.5); // Changed from 1.0 to 1.5 for 50% increase
        
        // Initialize properties
        this.initProperties();
        this.setupPhysics();
        this.setupAnimations();
        this.setupInput();
        
        console.log('🚒 Firefighter entity created');
    }
    
    initProperties() {
        // Movement properties
        this.moveSpeed = 200;
        this.facing = 'right';
        this.isMoving = false;
        this.isSpraying = false;
        
        // Water spray properties
        this.sprayTimer = 0;
        this.sprayInterval = 100; // ms between water particles
        this.sprayDuration = 0;
        this.maxSprayDuration = 2000; // 2 seconds max continuous spray
        
        // Visual properties
        this.originalScale = 1;
        this.flashTint = false;
        
        // Input state
        this.inputState = {
            left: false,
            right: false,
            spray: false
        };
        
        // Water particles group
        this.waterParticles = this.scene.physics.add.group({
            classType: WaterParticle,
            maxSize: 30,
            runChildUpdate: true
        });
    }
    
    setupPhysics() {
        // Physics body setup
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(800); // Ground friction
        
        // Adjust hitbox for the 64x64 frame size with 1.5x scale
        const baseFrameSize = 64; // Back to 64x64 frame size
        const scaledSize = baseFrameSize * 1.5; // 96x96 for the scaled firefighter
        this.body.setSize(scaledSize * 0.8, scaledSize * 0.9, true); // Most of the scaled image size
        this.body.setMaxVelocity(this.moveSpeed, 1000);
        
        // Ground level constraint - position lower on screen (closer to bottom)
        this.groundY = 720; // Lower position (was 680) - closer to bottom of 768px canvas
        this.setY(this.groundY);
    }
    
    setupAnimations() {
        // Set up animation state tracking
        this.currentAnimation = null;
        this.facing = 'right';
        
        // Ensure proper scale is set before starting animations
        this.setScale(1.5); // Maintain the 50% bigger size
        
        // Ensure clean visual state
        this.setAlpha(1);
        this.setVisible(true);
        this.setTint(0xffffff);
        
        // Start with idle animation
        this.playAnimation('firefighter-idle-right');
        
        console.log('🚒 Firefighter animations setup complete');
    }
    
    playAnimation(animationKey) {
        try {
            // Check if the animation exists
            if (!this.scene.anims.exists(animationKey)) {
                console.warn(`⚠️ Animation '${animationKey}' does not exist`);
                console.log('Available animations:', Object.keys(this.scene.anims.anims.entries));
                return;
            }
            
            if (this.currentAnimation !== animationKey) {
                this.currentAnimation = animationKey;
                
                // Ensure firefighter is in good state before playing animation
                this.setScale(1.5);
                this.setAlpha(1);
                this.setVisible(true);
                this.setTint(0xffffff);
                
                this.play(animationKey);
                console.log(`🎭 Playing animation: ${animationKey}`);
            }
        } catch (error) {
            console.error(`❌ Error playing animation '${animationKey}':`, error);
            // Fallback: ensure firefighter is visible and set to first frame
            this.setScale(1.5);
            this.setAlpha(1);
            this.setVisible(true);
            this.setTint(0xffffff);
            this.setFrame(0);
        }
    }
    
    setupInput() {
        // Get cursor keys
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // WASD keys
        this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');
        
        // Space for water spray
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Test keys to cycle through specific animation rows
        this.testKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.testKeyY = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.testKeyU = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.testKeyPressed = false;
        this.testKeyYPressed = false;
        this.testKeyUPressed = false;
        
        // Mobile control integration
        this.setupMobileControls();
    }
    
    setupMobileControls() {
        // Connect to mobile UI buttons
        const moveLeft = document.getElementById('move-left');
        const moveRight = document.getElementById('move-right');
        const sprayWater = document.getElementById('spray-water');
        
        if (moveLeft) {
            moveLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.inputState.left = true;
                moveLeft.classList.add('pressed');
            });
            
            moveLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.inputState.left = false;
                moveLeft.classList.remove('pressed');
            });
        }
        
        if (moveRight) {
            moveRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.inputState.right = true;
                moveRight.classList.add('pressed');
            });
            
            moveRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.inputState.right = false;
                moveRight.classList.remove('pressed');
            });
        }
        
        if (sprayWater) {
            sprayWater.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.inputState.spray = true;
                sprayWater.classList.add('pressed');
            });
            
            sprayWater.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.inputState.spray = false;
                sprayWater.classList.remove('pressed');
            });
        }
    }
    
    update(time, delta) {
        this.handleInput();
        this.updateMovement(delta);
        this.updateWaterSpray(delta);
        this.updateAnimations();
        this.constrainPosition();
    }
    
    handleInput() {
        // Reset input state from keyboard first
        const leftPressed = this.cursors.left.isDown || this.wasd.A.isDown;
        const rightPressed = this.cursors.right.isDown || this.wasd.D.isDown;
        const sprayPressed = this.spaceKey.isDown;
        
        // Test keys for different animation rows
        const testPressed = this.testKey.isDown;
        const testYPressed = this.testKeyY.isDown;
        const testUPressed = this.testKeyU.isDown;
        
        if (testPressed && !this.testKeyPressed) {
            console.log('🎬 Testing Row 1 idle animation (frames 0,2)...');
            this.playAnimation('firefighter-test-row1-idle');
        }
        if (testYPressed && !this.testKeyYPressed) {
            console.log('🎬 Testing Row 2 right animation (frames 4-7)...');
            this.playAnimation('firefighter-test-row2-right');
        }
        if (testUPressed && !this.testKeyUPressed) {
            console.log('🎬 Testing Row 4 left animation (frames 12-15)...');
            this.playAnimation('firefighter-test-row4-left');
        }
        
        this.testKeyPressed = testPressed;
        this.testKeyYPressed = testYPressed;
        this.testKeyUPressed = testUPressed;
        
        // Override with mobile controls if active
        this.inputState.left = leftPressed || this.inputState.left;
        this.inputState.right = rightPressed || this.inputState.right;
        this.inputState.spray = sprayPressed || this.inputState.spray;
        
        // Reset mobile state after processing to prevent sticking
        if (!leftPressed) this.inputState.left = false;
        if (!rightPressed) this.inputState.right = false;
        if (!sprayPressed) this.inputState.spray = false;
    }
    
    updateMovement(delta) {
        let velocityX = 0;
        this.isMoving = false;
        
        // Left movement
        if (this.inputState.left) {
            velocityX = -this.moveSpeed;
            this.facing = 'left';
            this.isMoving = true;
            this.playAnimation('firefighter-walk-left');
        }
        
        // Right movement
        if (this.inputState.right) {
            velocityX = this.moveSpeed;
            this.facing = 'right';
            this.isMoving = true;
            this.playAnimation('firefighter-walk-right');
        }
        
        // If not moving, play idle animation
        if (!this.isMoving) {
            if (this.facing === 'left') {
                this.playAnimation('firefighter-idle-left');
            } else {
                this.playAnimation('firefighter-idle-right');
            }
        }
        
        // Apply movement
        this.setVelocityX(velocityX);
        
        // No screen shake - keep it static like vanilla
    }
    
    updateWaterSpray(delta) {
        // Handle water spraying
        if (this.inputState.spray && this.sprayDuration < this.maxSprayDuration) {
            this.isSpraying = true;
            this.sprayDuration += delta;
            this.sprayTimer += delta;
            
            // Spawn water particles
            if (this.sprayTimer >= this.sprayInterval) {
                this.createWaterParticle();
                this.sprayTimer = 0;
                
                // Temporarily disable water spray particle effects
                console.log('💧 Water spray (effects disabled temporarily)');
                
                /*
                // Create water spray particle effect
                if (window.GameManagers.particle) {
                    const sprayX = this.x + (this.facing === 'right' ? 20 : -20);
                    const sprayY = this.y - 10;
                    window.GameManagers.particle.createWaterSpray(sprayX, sprayY, this.facing);
                }
                */
            }
        } else {
            this.isSpraying = false;
            
            // Reset spray duration when not spraying
            if (!this.inputState.spray) {
                this.sprayDuration = Math.max(0, this.sprayDuration - delta * 2);
            }
        }
    }
    
    createWaterParticle() {
        // Get or create water particle
        let waterParticle = this.waterParticles.getFirstDead();
        
        if (!waterParticle) {
            waterParticle = new WaterParticle(this.scene, 0, 0);
            this.waterParticles.add(waterParticle);
        }
        
        // Position and launch water particle - from the middle of the smaller firefighter
        const sprayX = this.x; // Center of firefighter (no offset)
        const sprayY = this.y - 20; // Slightly above center of firefighter
        
        waterParticle.launch(sprayX, sprayY, this.facing);
        
        // Play water spray sound
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playSpraySound();
        }
    }
    
    updateAnimations() {
        // Animation logic is now handled in updateMovement
        // This method can be used for additional animation effects if needed
        return;
    }
    
    // Removed animation methods to keep firefighter clean and static
    
    constrainPosition() {
        // Keep firefighter on ground
        if (this.y > this.groundY) {
            this.setY(this.groundY);
            this.setVelocityY(0);
        }
        
        // Keep within screen bounds with appropriate padding for bigger firefighter
        const padding = 60; // Increased padding for 50% bigger firefighter
        if (this.x < padding) {
            this.setX(padding);
        } else if (this.x > 1024 - padding) { // Updated for new canvas width
            this.setX(1024 - padding);
        }
    }
    
    // Public methods
    reset() {
        // Reset firefighter to starting position and state
        this.setPosition(512, 720); // Lower ground level position
        this.setVelocity(0, 0);
        this.facing = 'right';
        this.isMoving = false;
        this.isSpraying = false;
        this.sprayDuration = 0;
        this.sprayTimer = 0;
        
        // Clear all water particles
        this.waterParticles.clear(true, true);
        
        // Reset visual state completely
        this.setScale(1.5); // Maintain the 50% bigger firefighter image scale
        this.setAlpha(1);
        this.setVisible(true);
        this.setTint(0xffffff);
        this.currentAnimation = null; // Reset animation state
        
        // Reset to idle animation
        this.playAnimation('firefighter-idle-right');
        
        console.log('🚒 Firefighter reset - scale: 1.5, alpha: 1, visible: true');
    }
    
    takeDamage() {
        // Minimal damage feedback - just brief red tint
        this.setTint(0xff0000);
        
        // Quick restore to normal
        this.scene.time.delayedCall(100, () => {
            this.setTint(0xffffff);
            this.setAlpha(1);
        });
        
        // No screen shake - keep it static like vanilla
    }
    
    getWaterParticles() {
        return this.waterParticles;
    }
    
    getSprayOverheat() {
        return this.sprayDuration / this.maxSprayDuration;
    }
    
    destroy() {
        // Clean up water particles
        this.waterParticles.clear(true, true);
        
        // Remove mobile event listeners
        this.removeMobileControls();
        
        super.destroy();
    }
    
    removeMobileControls() {
        const buttons = ['move-left', 'move-right', 'spray-water'];
        buttons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.removeEventListener('touchstart', () => {});
                button.removeEventListener('touchend', () => {});
                button.classList.remove('pressed');
            }
        });
    }
} 