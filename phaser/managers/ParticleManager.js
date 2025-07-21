// ParticleManager.js - Advanced particle effects system

class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.emitters = new Map();
        this.activeEffects = new Set();
        
        this.initializeEmitters();
    }
    
    initializeEmitters() {
        // Create reusable particle emitters for different effects
        this.createFireEmitters();
        this.createWaterEmitters();
        this.createSmokeEmitters();
        this.createImpactEmitters();
        this.createAmbientEmitters();
    }
    
    createFireEmitters() {
        // Fire sparks emitter
        const fireSparkConfig = {
            speed: { min: 20, max: 80 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0xFFD700, 0xFF6347, 0xFF4500],
            lifespan: { min: 500, max: 1200 },
            frequency: 150,
            gravityY: -100,
            emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-10, -5, 20, 10) }
        };
        
        const fireSparkEmitter = this.scene.add.particles(0, 0, 'spark-particle', fireSparkConfig);
        fireSparkEmitter.stop();
        this.emitters.set('fireSparks', fireSparkEmitter);
        
        // Fire smoke emitter
        const fireSmokeConfig = {
            speed: { min: 10, max: 30 },
            scale: { start: 0.3, end: 1.2 },
            alpha: { start: 0.8, end: 0 },
            tint: [0x555555, 0x777777, 0x333333],
            lifespan: { min: 2000, max: 4000 },
            frequency: 300,
            gravityY: -50,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 15) }
        };
        
        const fireSmokeEmitter = this.scene.add.particles(0, 0, 'smoke-particle', fireSmokeConfig);
        fireSmokeEmitter.stop();
        this.emitters.set('fireSmoke', fireSmokeEmitter);
        
        // Fire ember emitter (for spreading)
        const fireEmberConfig = {
            speed: { min: 40, max: 120 },
            scale: { start: 1, end: 0.2 },
            alpha: { start: 1, end: 0 },
            tint: [0xFF6347, 0xFF4500, 0xDC143C],
            lifespan: { min: 1000, max: 2500 },
            frequency: 800,
            gravityY: 100,
            bounce: 0.3,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 8) }
        };
        
        const fireEmberEmitter = this.scene.add.particles(0, 0, 'ember-particle', fireEmberConfig);
        fireEmberEmitter.stop();
        this.emitters.set('fireEmbers', fireEmberEmitter);
    }
    
    createWaterEmitters() {
        // Water spray emitter
        const waterSprayConfig = {
            frame: 'water-particle',
            speed: { min: 150, max: 300 },
            scale: { start: 1, end: 0.3 },
            alpha: { start: 1, end: 0.7 },
            tint: [0x4169E1, 0x87CEEB, 0x1E90FF],
            lifespan: { min: 800, max: 1500 },
            quantity: 8,
            frequency: 50,
            gravityY: 300,
            bounce: 0.4,
            emitZone: { 
                type: 'edge', 
                source: new Phaser.Geom.Triangle.BuildEquilateral(0, 0, 30),
                quantity: 3
            }
        };
        
        const waterSprayEmitter = this.scene.add.particles(0, 0, 'water-particle', waterSprayConfig);
        waterSprayEmitter.stop();
        this.emitters.set('waterSpray', waterSprayEmitter);
        
        // Water splash emitter (when water hits fire)
        const waterSplashConfig = {
            frame: 'splash-particle',
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0x87CEEB, 0x4169E1, 0xB0E0E6],
            lifespan: { min: 300, max: 800 },
            quantity: 8,
            gravityY: 200,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 12) }
        };
        
        const waterSplashEmitter = this.scene.add.particles(0, 0, 'splash-particle', waterSplashConfig);
        waterSplashEmitter.stop();
        this.emitters.set('waterSplash', waterSplashEmitter);
    }
    
    createSmokeEmitters() {
        // Steam emitter (when water extinguishes fire)
        const steamConfig = {
            frame: 'steam-particle',
            speed: { min: 20, max: 60 },
            scale: { start: 0.5, end: 2 },
            alpha: { start: 0.8, end: 0 },
            tint: [0xF5F5F5, 0xE6E6FA, 0xFFFAFA],
            lifespan: { min: 1500, max: 3000 },
            quantity: 5,
            frequency: 100,
            gravityY: -80,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 10) }
        };
        
        const steamEmitter = this.scene.add.particles(0, 0, 'steam-particle', steamConfig);
        steamEmitter.stop();
        this.emitters.set('steam', steamEmitter);
        
        // Heavy smoke for extinguished fires
        const heavySmokeConfig = {
            frame: 'smoke-particle',
            speed: { min: 30, max: 80 },
            scale: { start: 0.8, end: 1.5 },
            alpha: { start: 0.9, end: 0 },
            tint: [0x696969, 0x2F4F4F, 0x708090],
            lifespan: { min: 2000, max: 4000 },
            quantity: 8,
            frequency: 200,
            gravityY: -30,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 20) }
        };
        
        const heavySmokeEmitter = this.scene.add.particles(0, 0, 'smoke-particle', heavySmokeConfig);
        heavySmokeEmitter.stop();
        this.emitters.set('heavySmoke', heavySmokeEmitter);
    }
    
    createImpactEmitters() {
        // Impact sparks when water hits fire
        const impactSparkConfig = {
            frame: 'spark-particle',
            speed: { min: 80, max: 200 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0xFFD700, 0xFFA500, 0xFF6347],
            lifespan: { min: 200, max: 600 },
            quantity: 12,
            gravityY: 150,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 8) }
        };
        
        const impactSparkEmitter = this.scene.add.particles(0, 0, 'spark-particle', impactSparkConfig);
        impactSparkEmitter.stop();
        this.emitters.set('impactSparks', impactSparkEmitter);
    }
    
    createAmbientEmitters() {
        // Ambient stage particles for atmosphere
        const ambientConfig = {
            frame: 'spark-particle',
            speed: { min: 5, max: 15 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.3, end: 0 },
            tint: [0xFFD700, 0xFFA500],
            lifespan: { min: 3000, max: 6000 },
            quantity: 1,
            frequency: 2000,
            gravityY: -10,
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 800, 100) }
        };
        
        const ambientEmitter = this.scene.add.particles(400, 550, 'spark-particle', ambientConfig);
        ambientEmitter.start();
        this.emitters.set('ambient', ambientEmitter);
    }
    
    // Public methods to trigger effects
    
    startFireEffect(x, y, size = 'medium') {
        const fireSparkEmitter = this.emitters.get('fireSparks');
        const fireSmokeEmitter = this.emitters.get('fireSmoke');
        const fireEmberEmitter = this.emitters.get('fireEmbers');
        
        if (fireSparkEmitter && fireSmokeEmitter && fireEmberEmitter) {
            // Position emitters
            fireSparkEmitter.setPosition(x, y);
            fireSmokeEmitter.setPosition(x, y - 10);
            fireEmberEmitter.setPosition(x, y);
            
            // Start emitters with size-based intensity
            const intensity = size === 'large' ? 1.5 : size === 'medium' ? 1.2 : 1.0;
            
            // Check if emitters have the setQuantity method before calling
            if (fireSparkEmitter.setQuantity) fireSparkEmitter.setQuantity(Math.floor(3 * intensity));
            if (fireSmokeEmitter.setQuantity) fireSmokeEmitter.setQuantity(Math.floor(2 * intensity));
            if (fireEmberEmitter.setQuantity) fireEmberEmitter.setQuantity(Math.floor(1 * intensity));
            
            fireSparkEmitter.start();
            fireSmokeEmitter.start();
            fireEmberEmitter.start();
            
            // Store effect for management
            this.activeEffects.add(`fire_${x}_${y}`);
        }
    }
    
    stopFireEffect(x, y) {
        // Create extinguish effect
        this.createExtinguishEffect(x, y);
        
        // Stop fire emitters gradually
        const fireSparkEmitter = this.emitters.get('fireSparks');
        const fireSmokeEmitter = this.emitters.get('fireSmoke');
        const fireEmberEmitter = this.emitters.get('fireEmbers');
        
        if (fireSparkEmitter) fireSparkEmitter.stop();
        if (fireSmokeEmitter) fireSmokeEmitter.stop();
        if (fireEmberEmitter) fireEmberEmitter.stop();
        
        this.activeEffects.delete(`fire_${x}_${y}`);
    }
    
    createWaterSpray(x, y, direction = 'right') {
        const waterSprayEmitter = this.emitters.get('waterSpray');
        
        if (waterSprayEmitter) {
            waterSprayEmitter.setPosition(x, y);
            
            // Set spray direction
            const angle = direction === 'right' ? 45 : 135;
            waterSprayEmitter.setAngle({ min: angle - 15, max: angle + 15 });
            
            waterSprayEmitter.explode(8);
        }
    }
    
    createWaterImpact(x, y) {
        const waterSplashEmitter = this.emitters.get('waterSplash');
        const impactSparkEmitter = this.emitters.get('impactSparks');
        const steamEmitter = this.emitters.get('steam');
        
        if (waterSplashEmitter) {
            waterSplashEmitter.setPosition(x, y);
            waterSplashEmitter.explode(8);
        }
        
        if (impactSparkEmitter) {
            impactSparkEmitter.setPosition(x, y);
            impactSparkEmitter.explode(12);
        }
        
        if (steamEmitter) {
            steamEmitter.setPosition(x, y);
            steamEmitter.explode(5);
        }
    }
    
    createExtinguishEffect(x, y) {
        const steamEmitter = this.emitters.get('steam');
        const heavySmokeEmitter = this.emitters.get('heavySmoke');
        
        if (steamEmitter) {
            steamEmitter.setPosition(x, y);
            steamEmitter.explode(15);
        }
        
        if (heavySmokeEmitter) {
            heavySmokeEmitter.setPosition(x, y);
            heavySmokeEmitter.explode(10);
        }
    }
    
    updateFireEffect(x, y, newX, newY) {
        // Update fire effect position for moving fires
        const fireSparkEmitter = this.emitters.get('fireSparks');
        const fireSmokeEmitter = this.emitters.get('fireSmoke');
        
        if (fireSparkEmitter && this.activeEffects.has(`fire_${x}_${y}`)) {
            fireSparkEmitter.setPosition(newX, newY);
            fireSmokeEmitter.setPosition(newX, newY - 10);
            
            // Update effect tracking
            this.activeEffects.delete(`fire_${x}_${y}`);
            this.activeEffects.add(`fire_${newX}_${newY}`);
        }
    }
    
    stopAllEffects() {
        this.emitters.forEach(emitter => emitter.stop());
        this.activeEffects.clear();
    }
    
    destroy() {
        this.stopAllEffects();
        this.emitters.forEach(emitter => emitter.destroy());
        this.emitters.clear();
    }
} 