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
        
        // Water tank properties
        this.maxWater = 100; // Total water capacity
        this.currentWater = 100; // Current water amount
        this.waterRegenRate = 15; // Water regen per second when not spraying
        this.waterConsumptionRate = 30; // Water consumption per second when spraying
        
        // Create water bar UI
        this.createWaterBar();
        
        // Visual properties
        this.originalScale = 1;
        this.flashTint = false;
        
        // Input state - separate mobile and keyboard states
        this.mobileInputState = {
            left: false,
            right: false,
            spray: false
        };
        
        // Combined input state for processing
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
        
        // Store event listeners for proper cleanup
        this.mobileEventListeners = {};
    }
    
    setupPhysics() {
        // Physics body setup
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(800); // Ground friction
        
        // Adjust hitbox for the 50% bigger scaled image
        const scaledSize = 64 * 1.5; // Now 96x96 for the 50% bigger firefighter
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
        
        // Start with idle animation
        this.playAnimation('firefighter-idle-right');
    }
    
    playAnimation(animationKey) {
        try {
            // Check if the animation exists
            if (!this.scene.anims.exists(animationKey)) {
                console.warn(`⚠️ Animation '${animationKey}' does not exist`);
                return;
            }
            
            if (this.currentAnimation !== animationKey) {
                this.currentAnimation = animationKey;
                this.play(animationKey);
                console.log(`🎭 Playing animation: ${animationKey}`);
            }
        } catch (error) {
            console.error(`❌ Error playing animation '${animationKey}':`, error);
            // Fallback: just set the texture to the first frame
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
        // Remove any existing listeners first to prevent duplicates
        this.removeMobileControls();
        
        // Connect to mobile UI buttons
        const moveLeft = document.getElementById('move-left');
        const moveRight = document.getElementById('move-right');
        const sprayWater = document.getElementById('spray-water');
        
        // Create named functions for event listeners so we can remove them later
        this.mobileEventListeners.leftStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.mobileInputState.left = true;
            moveLeft.classList.add('pressed');
        };
        
        this.mobileEventListeners.leftEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.mobileInputState.left = false;
            moveLeft.classList.remove('pressed');
        };
        
        this.mobileEventListeners.rightStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.mobileInputState.right = true;
            moveRight.classList.add('pressed');
        };
        
        this.mobileEventListeners.rightEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.mobileInputState.right = false;
            moveRight.classList.remove('pressed');
        };
        
        this.mobileEventListeners.sprayStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.mobileInputState.spray = true;
            sprayWater.classList.add('pressed');
        };
        
        this.mobileEventListeners.sprayEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.mobileInputState.spray = false;
            sprayWater.classList.remove('pressed');
        };
        
        // Add event listeners
        if (moveLeft) {
            moveLeft.addEventListener('touchstart', this.mobileEventListeners.leftStart);
            moveLeft.addEventListener('touchend', this.mobileEventListeners.leftEnd);
            moveLeft.addEventListener('touchcancel', this.mobileEventListeners.leftEnd);
        }
        
        if (moveRight) {
            moveRight.addEventListener('touchstart', this.mobileEventListeners.rightStart);
            moveRight.addEventListener('touchend', this.mobileEventListeners.rightEnd);
            moveRight.addEventListener('touchcancel', this.mobileEventListeners.rightEnd);
        }
        
        if (sprayWater) {
            sprayWater.addEventListener('touchstart', this.mobileEventListeners.sprayStart);
            sprayWater.addEventListener('touchend', this.mobileEventListeners.sprayEnd);
            sprayWater.addEventListener('touchcancel', this.mobileEventListeners.sprayEnd);
        }
        
        console.log('📱 Mobile controls set up');
    }
    
    createWaterBar() {
        // Create water bar container in bottom left - bigger size
        this.waterBarContainer = this.scene.add.container(100, 700);
        
        // Use the water-bar.png image as background instead of generated graphics
        this.waterBarBg = this.scene.add.image(0, 0, 'water-bar');
        this.waterBarBg.setOrigin(0.5, 0.5);
        // Scale the image to fit our desired size (adjust as needed based on your image)
        this.waterBarBg.setScale(0.22); // Adjust this scale based on your image size
        
        // Make water bar background interactive for hover tooltip
        this.waterBarBg.setInteractive();
        
        // Create tooltip text (initially hidden)
        this.waterTooltip = this.scene.add.text(0, -35, 'Water', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        this.waterTooltip.setVisible(false);
        
        // Add hover events for tooltip
        this.waterBarBg.on('pointerover', () => {
            this.waterTooltip.setVisible(true);
        });
        
        this.waterBarBg.on('pointerout', () => {
            this.waterTooltip.setVisible(false);
        });
        
        this.waterBarContainer.add(this.waterBarBg);
        this.waterBarContainer.add(this.waterTooltip);
        
        // Water bar title - bigger font
        // this.waterBarTitle = this.scene.add.text(0, -45, 'WATER', {
        //     fontSize: '16px',
        //     fontFamily: 'Arial, sans-serif',
        //     fill: '#ecf0f1',
        //     align: 'center',
        //     fontStyle: 'bold'
        // }).setOrigin(0.5);
        // this.waterBarContainer.add(this.waterBarTitle);
        
        // Create water bubbles (10 bubbles total) - bigger bubbles
        this.waterBubbles = [];
        const bubbleCount = 10;
        const bubbleSize = 12; // Increased from 8 to 12
        const bubbleSpacing = 16; // Increased from 12 to 16
        const startX = -(bubbleCount * bubbleSpacing) / 2 + bubbleSpacing / 2;
        
        for (let i = 0; i < bubbleCount; i++) {
            const x = startX + (i * bubbleSpacing);
            const y = -5; // Moved up slightly
            
            // Bubble background (empty) - bigger stroke
            const bubbleBg = this.scene.add.graphics();
            bubbleBg.lineStyle(2, 0x3498db, 0.5);
            bubbleBg.strokeCircle(x, y, bubbleSize / 2);
            this.waterBarContainer.add(bubbleBg);
            
            // Bubble fill (water) - bigger fill
            const bubbleFill = this.scene.add.graphics();
            bubbleFill.fillStyle(0x3498db, 0.8);
            bubbleFill.fillCircle(x, y, bubbleSize / 2);
            this.waterBarContainer.add(bubbleFill);
            
            this.waterBubbles.push({
                background: bubbleBg,
                fill: bubbleFill,
                x: x,
                y: y
            });
        }
        
        // Water percentage text - bigger font
        this.waterPercentText = this.scene.add.text(0, 20, '100%', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#3498db',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.waterBarContainer.add(this.waterPercentText);
        
        console.log('💧 Water bar UI created with custom background image');
    }
    
    update(time, delta) {
        // Safety check - don't update if firefighter is inactive or physics is disabled
        if (!this.active || (this.body && !this.body.enable)) {
            return;
        }
        
        this.handleInput();
        this.updateMovement(delta);
        this.updateWaterSpray(delta);
        this.updateWaterBar(); // Added this line
        this.updateAnimations();
        this.constrainPosition();
    }
    
    handleInput() {
        // Get keyboard input state
        const leftKeyPressed = this.cursors.left.isDown || this.wasd.A.isDown;
        const rightKeyPressed = this.cursors.right.isDown || this.wasd.D.isDown;
        const sprayKeyPressed = this.spaceKey.isDown;
        
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
        
        // Combine keyboard and mobile inputs (OR logic - either input source can trigger action)
        this.inputState.left = leftKeyPressed || this.mobileInputState.left;
        this.inputState.right = rightKeyPressed || this.mobileInputState.right;
        this.inputState.spray = sprayKeyPressed || this.mobileInputState.spray;
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
        // Update water levels
        if (this.inputState.spray && this.currentWater > 0) {
            // Consuming water while spraying
            this.isSpraying = true;
            this.currentWater = Math.max(0, this.currentWater - (this.waterConsumptionRate * delta / 1000));
            this.sprayTimer += delta;
            
            // Spawn water particles if we have water
            if (this.sprayTimer >= this.sprayInterval && this.currentWater > 0) {
                this.createWaterParticle();
                this.sprayTimer = 0;
            }
        } else {
            // Regenerate water when not spraying
            this.isSpraying = false;
            if (this.currentWater < this.maxWater) {
                this.currentWater = Math.min(this.maxWater, this.currentWater + (this.waterRegenRate * delta / 1000));
            }
        }
    }
    
    updateWaterBar() {
        if (!this.waterBubbles || !this.waterPercentText) return;
        
        // Calculate water percentage
        const waterPercent = (this.currentWater / this.maxWater) * 100;
        
        // Update percentage text
        this.waterPercentText.setText(`${Math.round(waterPercent)}%`);
        
        // Update bubble visibility based on water level
        const bubblesActive = Math.ceil((this.currentWater / this.maxWater) * this.waterBubbles.length);
        
        this.waterBubbles.forEach((bubble, index) => {
            if (index < bubblesActive) {
                // Show filled bubble
                bubble.fill.setVisible(true);
                bubble.fill.setAlpha(1);
            } else {
                // Show empty bubble
                bubble.fill.setVisible(false);
            }
        });
        
        // Change color based on water level
        let fillColor = 0x3498db; // Blue (normal)
        if (waterPercent < 30) {
            fillColor = 0xe74c3c; // Red (low)
        } else if (waterPercent < 60) {
            fillColor = 0xf39c12; // Orange (medium)
        }
        
        // Update active bubbles with the appropriate color
        this.waterBubbles.forEach((bubble, index) => {
            if (index < bubblesActive) {
                bubble.fill.clear();
                bubble.fill.fillStyle(fillColor, 0.8);
                bubble.fill.fillCircle(bubble.x, bubble.y, 6); // Increased from 4 to 6 for bigger bubbles
            }
        });
        
        // Update percentage text color
        if (waterPercent < 30) {
            this.waterPercentText.setColor('#e74c3c');
        } else if (waterPercent < 60) {
            this.waterPercentText.setColor('#f39c12');
        } else {
            this.waterPercentText.setColor('#3498db');
        }
    }
    
    createWaterParticle() {
        // Safety check for water particles group
        if (!this.waterParticles || !this.waterParticles.getFirstDead) {
            console.warn('Water particles group not available');
            return;
        }
        
        // Get or create water particle
        let waterParticle = this.waterParticles.getFirstDead();
        
        if (!waterParticle) {
            try {
                waterParticle = new WaterParticle(this.scene, 0, 0);
                this.waterParticles.add(waterParticle);
            } catch (e) {
                console.warn('Error creating water particle:', e);
                return;
            }
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
        
        // Reset water levels
        this.currentWater = this.maxWater;
        
        // Clear all water particles safely
        if (this.waterParticles && this.waterParticles.clear) {
            try {
                this.waterParticles.clear(true, true);
            } catch (e) {
                console.warn('Error clearing water particles:', e);
            }
        }
        
        // Reset animations and maintain 50% bigger scale
        this.setScale(1.5); // Maintain the 50% bigger firefighter image scale
        this.setTint(0xffffff);
        
        // Reset to idle animation
        this.playAnimation('firefighter-idle-right');
        
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
        // Return water particles group with safety check
        if (!this.waterParticles) {
            console.warn('Water particles group is undefined');
            return null;
        }
        return this.waterParticles;
    }
    
    getSprayOverheat() {
        return this.sprayDuration / this.maxSprayDuration;
    }
    
    destroy() {
        try {
            // Clean up water particles safely
            if (this.waterParticles && this.waterParticles.clear) {
                this.waterParticles.clear(true, true);
            }
            
            // Clean up water bar UI
            if (this.waterBarContainer) {
                this.waterBarContainer.destroy();
                this.waterBarContainer = null;
            }
            this.waterBubbles = null;
            this.waterPercentText = null;
            this.waterTooltip = null;
            
            // Remove mobile event listeners
            this.removeMobileControls();
        } catch (e) {
            console.warn('Firefighter cleanup warning:', e);
        }
        
        super.destroy();
    }
    
    removeMobileControls() {
        const moveLeft = document.getElementById('move-left');
        const moveRight = document.getElementById('move-right');
        const sprayWater = document.getElementById('spray-water');
        
        // Remove event listeners using the stored references
        if (moveLeft && this.mobileEventListeners.leftStart) {
            moveLeft.removeEventListener('touchstart', this.mobileEventListeners.leftStart);
            moveLeft.removeEventListener('touchend', this.mobileEventListeners.leftEnd);
            moveLeft.removeEventListener('touchcancel', this.mobileEventListeners.leftEnd);
            moveLeft.classList.remove('pressed');
        }
        
        if (moveRight && this.mobileEventListeners.rightStart) {
            moveRight.removeEventListener('touchstart', this.mobileEventListeners.rightStart);
            moveRight.removeEventListener('touchend', this.mobileEventListeners.rightEnd);
            moveRight.removeEventListener('touchcancel', this.mobileEventListeners.rightEnd);
            moveRight.classList.remove('pressed');
        }
        
        if (sprayWater && this.mobileEventListeners.sprayStart) {
            sprayWater.removeEventListener('touchstart', this.mobileEventListeners.sprayStart);
            sprayWater.removeEventListener('touchend', this.mobileEventListeners.sprayEnd);
            sprayWater.removeEventListener('touchcancel', this.mobileEventListeners.sprayEnd);
            sprayWater.classList.remove('pressed');
        }
        
        // Clear the stored references
        this.mobileEventListeners = {};
    }
} 