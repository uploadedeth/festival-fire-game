// Firefighter.js - Enhanced firefighter entity with Phaser physics

class Firefighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'firefighter');
        
        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
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
        this.body.setSize(24, 40, true); // Adjust hitbox
        this.body.setMaxVelocity(this.moveSpeed, 1000);
        
        // Ground level constraint - gray ground area at bottom (scaled for 1024x768)
        this.groundY = 680; // Ground level based on new canvas size
        this.setY(this.groundY);
    }
    
    setupAnimations() {
        // Remove all animations - keep firefighter clean and stable
        this.walkFrames = [];
        this.walkTween = null;
        this.idleTween = null;
        this.sprayTween = null;
        
        // No animations - just static sprite
    }
    
    setupInput() {
        // Get cursor keys
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // WASD keys
        this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');
        
        // Space for water spray
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
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
            this.setFlipX(true);
            this.isMoving = true;
        }
        
        // Right movement
        if (this.inputState.right) {
            velocityX = this.moveSpeed;
            this.facing = 'right';
            this.setFlipX(false);
            this.isMoving = true;
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
        
        // Position and launch water particle
        const sprayX = this.x + (this.facing === 'right' ? 20 : -20);
        const sprayY = this.y - 10;
        
        waterParticle.launch(sprayX, sprayY, this.facing);
        
        // Play water spray sound
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playSpraySound();
        }
    }
    
    updateAnimations() {
        // No animations - keep firefighter static and clean
        return;
    }
    
    // Removed animation methods to keep firefighter clean and static
    
    constrainPosition() {
        // Keep firefighter on ground
        if (this.y > this.groundY) {
            this.setY(this.groundY);
            this.setVelocityY(0);
        }
        
        // Keep within screen bounds with padding
        const padding = 20;
        if (this.x < padding) {
            this.setX(padding);
        } else if (this.x > 1024 - padding) { // Updated for new canvas width
            this.setX(1024 - padding);
        }
    }
    
    // Public methods
    reset() {
        // Reset firefighter to starting position and state
        this.setPosition(512, 680); // Ground level based on new canvas size
        this.setVelocity(0, 0);
        this.facing = 'right';
        this.setFlipX(false);
        this.isSpraying = false;
        this.isMoving = false;
        this.sprayDuration = 0;
        this.sprayTimer = 0;
        
        // Clear all water particles
        this.waterParticles.clear(true, true);
        
        // Reset animations
        this.setScale(1, 1);
        this.setTint(0xffffff);
        
        console.log('🚒 Firefighter reset');
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