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
        this.load.image('stage-background', 'assets/images/aa1744e2-4332-40b0-bb96-98a386cd7a86.png');
        
        // Generate procedural textures for game entities (not stage elements)
        this.generateTextures();
    }
    
    generateTextures() {
        // Generate firefighter texture
        this.generateFirefighterTexture();
        
        // Generate fire textures for different sizes
        this.generateFireTextures();
        
        // Generate water particle texture
        this.generateWaterTexture();
        
        // Generate particle textures for effects
        this.generateParticleTextures();
        
        // Generate UI textures
        this.generateUITextures();
        
        // Skip stage texture generation - using background image instead
    }
    
    generateFirefighterTexture() {
        const graphics = this.add.graphics();
        
        // Body (orange suit)
        graphics.fillStyle(0xFF6B35);
        graphics.fillRect(8, 16, 16, 32);
        
        // Helmet (gold)
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(6, 4, 20, 16);
        
        // Face (skin tone)
        graphics.fillStyle(0xFFDBAC);
        graphics.fillRect(10, 8, 12, 12);
        
        // Equipment belt (brown)
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(8, 32, 16, 4);
        
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillRect(12, 12, 2, 2);
        graphics.fillRect(18, 12, 2, 2);
        
        // Generate texture
        graphics.generateTexture('firefighter', 32, 48);
        graphics.destroy();
    }
    
    generateFireTextures() {
        const sizes = [
            { key: 'fire-small', width: 20, height: 30 },
            { key: 'fire-medium', width: 30, height: 40 },
            { key: 'fire-large', width: 40, height: 50 }
        ];
        
        sizes.forEach(size => {
            const graphics = this.add.graphics();
            
            // Fire base (dark red)
            graphics.fillStyle(0xDC143C);
            graphics.fillEllipse(size.width / 2, size.height - 10, size.width, size.height / 2);
            
            // Fire middle (orange)
            graphics.fillStyle(0xFF4500);
            graphics.fillEllipse(size.width / 2, size.height - 12, size.width * 0.8, size.height * 0.4);
            
            // Fire top (yellow)
            graphics.fillStyle(0xFFD700);
            graphics.fillEllipse(size.width / 2, size.height - 16, size.width * 0.6, size.height * 0.3);
            
            // Add some flame tips
            for (let i = 0; i < 3; i++) {
                const x = (size.width / 4) + (i * size.width / 4);
                const y = size.height - 20 - (Math.random() * 10);
                graphics.fillStyle(0xFFFF00);
                graphics.fillTriangle(x, y, x - 3, y + 8, x + 3, y + 8);
            }
            
            graphics.generateTexture(size.key, size.width, size.height);
            graphics.destroy();
        });
    }
    
    generateWaterTexture() {
        const graphics = this.add.graphics();
        
        // Water droplet (blue with highlight)
        graphics.fillStyle(0x4169E1);
        graphics.fillCircle(4, 4, 4);
        
        // Water highlight
        graphics.fillStyle(0x87CEEB);
        graphics.fillCircle(3, 3, 1.5);
        
        graphics.generateTexture('water-particle', 8, 8);
        graphics.destroy();
        
        // Generate steam particle
        const steamGraphics = this.add.graphics();
        steamGraphics.fillStyle(0xF5F5F5, 0.6);
        steamGraphics.fillCircle(3, 3, 3);
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
        
        console.log('✅ Boot Scene complete - basic managers initialized');
        
        // Proceed to menu scene
        this.scene.start('MenuScene');
    }
} 