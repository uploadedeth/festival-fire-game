// BootScene.js - Asset loading and procedural texture generation

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Set loading progress tracking
        this.load.on('progress', (percentage) => {
            console.log('Loading assets: ' + Math.round(percentage * 100) + '%');
        });
        
        this.load.on('complete', () => {
            console.log('All assets loaded!');
        });
        
        // Load the stage background image
        this.load.image('stage-background', 'assets/images/tomorrowland-pixel-stage.png');
        
        // Load the animated firefighter sprite sheet
        this.load.spritesheet('firefighter', 'assets/images/A_stylized_8_bit_pix...-119709497-1.png', {
            frameWidth: 64,  // Firefighter frame size
            frameHeight: 64, // Firefighter frame size
            startFrame: 0,
            endFrame: 15     // Firefighter frames
        });
        
        // Load fire sprite as image first to detect dimensions
        this.load.image('fire-test', 'assets/images/fire-sprite.png');
        
        // Add loading event for fire sprite detection
        this.load.on('filecomplete-image-fire-test', () => {
            const texture = this.textures.get('fire-test');
            const image = texture.source[0];
            console.log(`🔥 Fire sprite dimensions: ${image.width}x${image.height}`);
            
            // Calculate frame size based on 4x4 grid
            const frameWidth = image.width / 4;
            const frameHeight = image.height / 4;
            console.log(`🔥 Fire frame size: ${frameWidth}x${frameHeight}`);
            
            // Now load as spritesheet with correct dimensions
            this.load.spritesheet('fire', 'assets/images/fire-sprite.png', {
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                startFrame: 0,
                endFrame: -1
            });
            
            this.load.start(); // Restart loading for fire spritesheet
        });
        
        // Add loading event to debug fire sprite
        this.load.on('filecomplete-spritesheet-fire', () => {
            console.log('✅ Fire sprite sheet loaded successfully');
            // Create fire animations now that sprite is loaded
            this.createFireAnimations();
        });
        
        // Generate procedural textures for game entities (not stage elements)
        this.generateTextures();
    }
    
    generateTextures() {
        // Skip firefighter texture generation - using real image
        
        // Skip fire texture generation - using sprite sheet instead
        // Fire animations will be created in create() method after loading
        
        // Generate water particle texture
        this.generateWaterTexture();
        
        // Generate particle textures for effects
        this.generateParticleTextures();
        
        // Generate UI textures
        this.generateUITextures();
        
        // Skip stage texture generation - using background image instead
    }
    
    createFireAnimations() {
        // Check if the fire sprite sheet is loaded
        if (!this.textures.exists('fire')) {
            console.error('❌ Fire sprite sheet not loaded');
            return;
        }
        
        try {
            console.log('🔥 Creating fire animations...');
            
            // Get the texture to see how many frames we have
            const texture = this.textures.get('fire');
            const frameCount = texture.frameTotal;
            const source = texture.source[0];
            console.log(`📊 Fire sprite sheet info:`);
            console.log(`  - Image dimensions: ${source.width}x${source.height}`);
            console.log(`  - Frame count: ${frameCount}`);
            console.log(`  - Frames per row: ${Math.ceil(Math.sqrt(frameCount))}`);
            
            // Create fire animations for different sizes using different rows
            // Row 1 (frames 0-3): Small fire
            this.anims.create({
                key: 'fire-small',
                frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
            
            // Row 2 (frames 4-7): Medium fire
            this.anims.create({
                key: 'fire-medium',
                frames: this.anims.generateFrameNumbers('fire', { start: 4, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
            
            // Row 3 (frames 8-11): Large fire
            this.anims.create({
                key: 'fire-large',
                frames: this.anims.generateFrameNumbers('fire', { start: 8, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
            
            // Row 4 (frames 12-15): Extra large fire (optional)
            if (frameCount >= 16) {
                this.anims.create({
                    key: 'fire-xlarge',
                    frames: this.anims.generateFrameNumbers('fire', { start: 12, end: 15 }),
                    frameRate: 8,
                    repeat: -1
                });
            }
            
            console.log('✅ Fire animations created successfully');
            
        } catch (error) {
            console.error('❌ Error creating fire animations:', error);
        }
    }
    
    generateWaterTexture() {
        const graphics = this.add.graphics();
        
        // Pixelated water droplet with concentrated solid blue color
        graphics.fillStyle(0x0066FF); // Solid, concentrated blue color
        
        // Create pixelated square water particle instead of smooth circle
        graphics.fillRect(0, 0, 8, 8); // 8x8 pixel square for pixelated look
        
        // Add a small inner pixel for more concentrated look
        graphics.fillStyle(0x0044CC); // Darker blue center
        graphics.fillRect(2, 2, 4, 4); // 4x4 inner square
        
        // Add single bright pixel highlight for pixelated effect
        graphics.fillStyle(0x00AAFF); // Bright blue highlight
        graphics.fillRect(2, 2, 2, 2); // 2x2 highlight pixel
        
        graphics.generateTexture('water-particle', 8, 8);
        graphics.destroy();
        
        // Generate pixelated steam particle
        const steamGraphics = this.add.graphics();
        steamGraphics.fillStyle(0xEEEEEE); // Solid light gray, no transparency
        steamGraphics.fillRect(0, 0, 6, 6); // 6x6 pixel square
        steamGraphics.fillStyle(0xFFFFFF); // White center
        steamGraphics.fillRect(1, 1, 4, 4); // 4x4 white center
        steamGraphics.generateTexture('steam-particle', 6, 6);
        steamGraphics.destroy();
    }
    
    generateParticleTextures() {
        // Spark particle for fire effects
        const sparkGraphics = this.add.graphics();
        sparkGraphics.fillStyle(0xFFD700);
        sparkGraphics.fillCircle(2, 2, 2);
        sparkGraphics.generateTexture('spark-particle', 4, 4);
        sparkGraphics.destroy();
        
        // Smoke particle
        const smokeGraphics = this.add.graphics();
        smokeGraphics.fillStyle(0x555555, 0.7);
        smokeGraphics.fillCircle(4, 4, 4);
        smokeGraphics.generateTexture('smoke-particle', 8, 8);
        smokeGraphics.destroy();
        
        // Splash particle for water hitting fires
        const splashGraphics = this.add.graphics();
        splashGraphics.fillStyle(0x87CEEB);
        splashGraphics.fillCircle(3, 3, 3);
        splashGraphics.generateTexture('splash-particle', 6, 6);
        splashGraphics.destroy();
        
        // Embers for fire spread
        const emberGraphics = this.add.graphics();
        emberGraphics.fillStyle(0xFF6347);
        emberGraphics.fillCircle(1.5, 1.5, 1.5);
        emberGraphics.generateTexture('ember-particle', 3, 3);
        emberGraphics.destroy();
    }
    
    generateUITextures() {
        // Button background
        const buttonGraphics = this.add.graphics();
        buttonGraphics.fillStyle(0xFF6B6B);
        buttonGraphics.fillRoundedRect(0, 0, 200, 60, 10);
        buttonGraphics.lineStyle(2, 0xEE5A52);
        buttonGraphics.strokeRoundedRect(0, 0, 200, 60, 10);
        buttonGraphics.generateTexture('button-bg', 200, 60);
        buttonGraphics.destroy();
        
        // Button hover state
        const buttonHoverGraphics = this.add.graphics();
        buttonHoverGraphics.fillStyle(0xEE5A52);
        buttonHoverGraphics.fillRoundedRect(0, 0, 200, 60, 10);
        buttonHoverGraphics.lineStyle(2, 0xFF6B6B);
        buttonHoverGraphics.strokeRoundedRect(0, 0, 200, 60, 10);
        buttonHoverGraphics.generateTexture('button-hover', 200, 60);
        buttonHoverGraphics.destroy();
    }
    
    create() {
        // Temporarily disable particle manager to fix errors
        console.log('⚠️ Particle manager temporarily disabled');
        // window.GameManagers.particle = new ParticleManager(this);
        
        // Initialize audio manager
        window.GameManagers.audio = new AudioManager(this);
        
        // Initialize UI manager
        window.GameManagers.ui = new UIManager();
        
        // Create firefighter animations (always work)
        this.createFirefighterAnimations();
        
        // Create fire animations only if fire sprite sheet is available
        if (this.textures.exists('fire')) {
            this.createFireAnimations();
        } else {
            console.log('🔥 Fire sprite not loaded yet, will create animations when ready');
        }
        
        console.log('✅ Boot Scene complete - firefighter animations ready');
        
        // Proceed to menu scene
        this.scene.start('MenuScene');
    }
    
    createFirefighterAnimations() {
        // Check if the firefighter texture is loaded
        if (!this.textures.exists('firefighter')) {
            console.error('❌ Firefighter sprite sheet not loaded');
            return;
        }
        
        try {
            console.log('🎭 Creating firefighter animations...');
            
            // Get the texture to see how many frames we have
            const texture = this.textures.get('firefighter');
            const frameCount = texture.frameTotal;
            console.log(`📊 Available frames: ${frameCount}`);
            
            // Based on user's sprite sheet layout:
            // Row 1 (0-3): Idle - use frames 0 and 2
            // Row 2 (4-7): Moving right
            // Row 3 (8-11): Moving up (skip)
            // Row 4 (12-15): Moving left
            
            if (frameCount >= 16) {
                
                // Idle animations using Row 1 - frames 0 and 2 only
                this.anims.create({
                    key: 'firefighter-idle-left',
                    frames: [
                        { key: 'firefighter', frame: 0 },
                        { key: 'firefighter', frame: 2 }
                    ],
                    frameRate: 6, // Increased from 2 to 6 for 3x faster animation
                    repeat: -1
                });
                
                this.anims.create({
                    key: 'firefighter-idle-right',
                    frames: [
                        { key: 'firefighter', frame: 0 },
                        { key: 'firefighter', frame: 2 }
                    ],
                    frameRate: 6, // Increased from 2 to 6 for 3x faster animation
                    repeat: -1
                });
                
                // Walking left animation using Row 4 (frames 12-15)
                this.anims.create({
                    key: 'firefighter-walk-left',
                    frames: this.anims.generateFrameNumbers('firefighter', { start: 12, end: 15 }),
                    frameRate: 8,
                    repeat: -1
                });
                
                // Walking right animation using Row 2 (frames 4-7)
                this.anims.create({
                    key: 'firefighter-walk-right',
                    frames: this.anims.generateFrameNumbers('firefighter', { start: 4, end: 7 }),
                    frameRate: 8,
                    repeat: -1
                });
                
            } else if (frameCount >= 8) {
                // Fallback for smaller sprite sheets
                this.anims.create({
                    key: 'firefighter-idle-left',
                    frames: [{ key: 'firefighter', frame: 0 }],
                    frameRate: 1,
                    repeat: 0
                });
                
                this.anims.create({
                    key: 'firefighter-idle-right',
                    frames: [{ key: 'firefighter', frame: 0 }],
                    frameRate: 1,
                    repeat: 0
                });
                
                this.anims.create({
                    key: 'firefighter-walk-left',
                    frames: this.anims.generateFrameNumbers('firefighter', { start: 4, end: 7 }),
                    frameRate: 6,
                    repeat: -1
                });
                
                this.anims.create({
                    key: 'firefighter-walk-right',
                    frames: this.anims.generateFrameNumbers('firefighter', { start: 0, end: 3 }),
                    frameRate: 6,
                    repeat: -1
                });
                
            } else {
                // Very few frames, use fallback
                this.createFallbackAnimations();
                return;
            }
            
            // Create test animations to see specific rows
            console.log('🎬 Creating test animations for each row...');
            this.anims.create({
                key: 'firefighter-test-row1-idle',
                frames: [
                    { key: 'firefighter', frame: 0 },
                    { key: 'firefighter', frame: 2 }
                ],
                frameRate: 2,
                repeat: -1
            });
            
            this.anims.create({
                key: 'firefighter-test-row2-right',
                frames: this.anims.generateFrameNumbers('firefighter', { start: 4, end: 7 }),
                frameRate: 4,
                repeat: -1
            });
            
            this.anims.create({
                key: 'firefighter-test-row4-left',
                frames: this.anims.generateFrameNumbers('firefighter', { start: 12, end: 15 }),
                frameRate: 4,
                repeat: -1
            });
            
            console.log('✅ Firefighter animations created successfully');
            console.log('💡 Press T for Row 1 idle, Y for Row 2 right, U for Row 4 left');
            
        } catch (error) {
            console.error('❌ Error creating firefighter animations:', error);
            
            // Fallback: create minimal animations
            this.createFallbackAnimations();
        }
    }
    
    createFallbackAnimations() {
        try {
            console.log('🔄 Creating fallback animations...');
            
            // Simple fallback animations using just the first frame
            this.anims.create({
                key: 'firefighter-idle-left',
                frames: [{ key: 'firefighter', frame: 0 }],
                frameRate: 1
            });
            
            this.anims.create({
                key: 'firefighter-idle-right',
                frames: [{ key: 'firefighter', frame: 0 }],
                frameRate: 1
            });
            
            this.anims.create({
                key: 'firefighter-walk-left',
                frames: [{ key: 'firefighter', frame: 0 }],
                frameRate: 1
            });
            
            this.anims.create({
                key: 'firefighter-walk-right',
                frames: [{ key: 'firefighter', frame: 0 }],
                frameRate: 1
            });
            
            console.log('✅ Fallback animations created');
            
        } catch (error) {
            console.error('❌ Failed to create fallback animations:', error);
        }
    }
} 