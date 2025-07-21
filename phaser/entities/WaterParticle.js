// WaterParticle.js - Enhanced water particle with Phaser physics

class WaterParticle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'water-particle');
        
        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Initialize properties
        this.initProperties();
        this.setupPhysics();
        
        // Start as inactive
        this.setActive(false);
        this.setVisible(false);
    }
    
    initProperties() {
        // Lifecycle properties
        this.lifespan = 2000; // 2 seconds
        this.maxLifespan = 2000;
        this.age = 0;
        
        // Visual properties
        this.initialSize = 1;
        this.trail = [];
        this.maxTrailLength = 5;
        
        // State
        this.hasHitTarget = false;
        this.splashCreated = false;
        
        // Effects - properly reference scene
        this.trailGraphics = this.scene.add.graphics();
        this.trailGraphics.setDepth(-1);
    }
    
    setupPhysics() {
        // Physics body setup
        this.setBounce(0.3, 0.2); // Slight bounce
        this.setDrag(50, 0); // Air resistance
        this.body.setSize(6, 6, true); // Small collision box
        this.body.setCollideWorldBounds(true);
        
        // Physics callbacks
        this.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', this.onWorldBounds, this);
    }
    
    launch(x, y, direction) {
        // Activate particle
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        
        // Reset state
        this.age = 0;
        this.hasHitTarget = false;
        this.splashCreated = false;
        this.trail = [];
        
        // Set initial velocity with spray pattern - more powerful
        const baseSpeed = 500; // Increased from 300 to 500
        const spread = 30; // degrees
        const angle = direction === 'right' ? -60 : -120; // Upward spray
        const randomSpread = (Math.random() - 0.5) * spread;
        const finalAngle = angle + randomSpread;
        
        const velocityX = Math.cos(Phaser.Math.DegToRad(finalAngle)) * baseSpeed;
        const velocityY = Math.sin(Phaser.Math.DegToRad(finalAngle)) * baseSpeed;
        
        this.setVelocity(velocityX, velocityY);
        
        // Set visual properties
        this.initialSize = 0.8 + Math.random() * 0.4;
        this.setScale(this.initialSize);
        this.setAlpha(1);
        this.setTint(0x4169E1);
        
        // Set random lifespan - increased to reach higher
        this.lifespan = 2500 + Math.random() * 1000; // Increased from 1500-2500 to 2500-3500
        this.maxLifespan = this.lifespan;
        
        // Start trail effect
        this.startTrailEffect();
    }
    
    startTrailEffect() {
        // Create particle trail effect
        this.trailTimer = this.scene.time.addEvent({
            delay: 50,
            callback: this.updateTrail,
            callbackScope: this,
            repeat: -1
        });
    }
    
    updateTrail() {
        if (!this.active) return;
        
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        
        // Remove old trail points
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Draw trail
        this.drawTrail();
    }
    
    drawTrail() {
        this.trailGraphics.clear();
        
        if (this.trail.length < 2) return;
        
        // Draw trail as connected circles
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i / this.trail.length) * 0.6;
            const size = (i / this.trail.length) * 3;
            
            this.trailGraphics.fillStyle(0x87CEEB, alpha);
            this.trailGraphics.fillCircle(point.x, point.y, size);
        }
    }
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (!this.active) return;
        
        // Update age
        this.age += delta;
        
        // Update visual effects
        this.updateVisuals();
        
        // Check for expiration
        if (this.age >= this.lifespan) {
            this.deactivate();
        }
        
        // Create splash if hit ground
        if (this.body.blocked.down && !this.splashCreated) {
            this.createGroundSplash();
        }
    }
    
    updateVisuals() {
        // Calculate life percentage
        const lifePercent = this.age / this.maxLifespan;
        
        // Fade out over time
        const alpha = Math.max(0, 1 - lifePercent);
        this.setAlpha(alpha);
        
        // Slight size reduction
        const scale = this.initialSize * (1 - lifePercent * 0.3);
        this.setScale(scale);
        
        // Color transition (blue to white as it evaporates)
        const tint = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(0x4169E1),
            Phaser.Display.Color.ValueToColor(0xF0F8FF),
            1,
            lifePercent
        );
        
        this.setTint(Phaser.Display.Color.GetColor(tint.r, tint.g, tint.b));
        
        // Add rotation based on velocity
        const velocityAngle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        this.setRotation(velocityAngle);
    }
    
    createGroundSplash() {
        this.splashCreated = true;
        
        // Create splash particle effect
        if (window.GameManagers.particle) {
            window.GameManagers.particle.createWaterSplash(this.x, this.y);
        }
        
        // Create small water droplets
        for (let i = 0; i < 3; i++) {
            const droplet = this.scene.add.circle(
                this.x + (Math.random() - 0.5) * 20,
                this.y,
                2,
                0x87CEEB,
                0.8
            );
            
            this.scene.tweens.add({
                targets: droplet,
                y: droplet.y + 10,
                alpha: 0,
                scale: 0.5,
                duration: 300,
                ease: 'Cubic.easeOut',
                onComplete: () => droplet.destroy()
            });
        }
    }
    
    hitFire(fire) {
        if (this.hasHitTarget) return;
        
        this.hasHitTarget = true;
        
        // Create impact effects
        if (window.GameManagers.particle) {
            window.GameManagers.particle.createWaterImpact(this.x, this.y);
        }
        
        // Play impact sound
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playFireHitSound();
        }
        
        // Create steam effect
        this.createSteamEffect();
        
        // No screen shake - keep it static like vanilla
        
        // Deactivate particle
        this.deactivate();
        
        return true;
    }
    
    createSteamEffect() {
        // Create rising steam particles
        for (let i = 0; i < 5; i++) {
            const steam = this.scene.add.circle(
                this.x + (Math.random() - 0.5) * 15,
                this.y + (Math.random() - 0.5) * 10,
                3 + Math.random() * 3,
                0xF5F5F5,
                0.6
            );
            
            this.scene.tweens.add({
                targets: steam,
                y: steam.y - 30 - Math.random() * 20,
                x: steam.x + (Math.random() - 0.5) * 20,
                scale: 2 + Math.random(),
                alpha: 0,
                duration: 1000 + Math.random() * 500,
                ease: 'Cubic.easeOut',
                onComplete: () => steam.destroy()
            });
        }
    }
    
    onWorldBounds(event) {
        if (event.gameObject === this) {
            // Create splash if hitting bottom
            if (event.blocked.down) {
                this.createGroundSplash();
            }
            this.deactivate();
        }
    }
    
    deactivate() {
        // Clean up
        this.setActive(false);
        this.setVisible(false);
        this.setVelocity(0, 0);
        
        // Clear trail
        this.trail = [];
        this.trailGraphics.clear();
        
        // Stop trail timer
        if (this.trailTimer) {
            this.trailTimer.destroy();
            this.trailTimer = null;
        }
        
        // Reset state
        this.hasHitTarget = false;
        this.splashCreated = false;
        this.age = 0;
    }
    
    getBounds() {
        // Return collision bounds for manual collision detection
        return new Phaser.Geom.Rectangle(
            this.x - this.body.width / 2,
            this.y - this.body.height / 2,
            this.body.width,
            this.body.height
        );
    }
    
    destroy() {
        // Clean up trail graphics
        if (this.trailGraphics) {
            this.trailGraphics.destroy();
        }
        
        // Clean up timer
        if (this.trailTimer) {
            this.trailTimer.destroy();
        }
        
        // Remove world bounds listener
        this.scene.physics.world.off('worldbounds', this.onWorldBounds, this);
        
        super.destroy();
    }
} 