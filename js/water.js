// water.js - Water particle system

class WaterParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 4;
        this.life = 1.0;
        this.active = false;
        this.hasHitFire = false;
    }
    
    init(x, y, facing) {
        this.x = x;
        this.y = y;
        
        // Initial velocity with upward spray and slight horizontal spread
        const horizontalSpread = (Math.random() - 0.5) * 50; // ±25 pixels/sec spread
        this.vx = horizontalSpread;
        this.vy = -300 - Math.random() * 100; // Strong upward velocity: -300 to -400 pixels/sec
        
        this.size = 3 + Math.random() * 3; // Size variation
        this.life = 1.0;
        this.active = true;
        this.hasHitFire = false;
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        // Apply gravity
        this.vy += 500 * deltaTime; // 500 pixels/sec² gravity
        
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Reduce life over time
        this.life -= deltaTime * 0.5;
        
        // Deactivate if off screen or life expired
        if (this.y > canvas.height + 20 || 
            this.x < -20 || 
            this.x > canvas.width + 20 || 
            this.life <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        if (!this.active) return;
        
        ctx.save();
        
        // Set alpha based on life
        ctx.globalAlpha = this.life;
        
        // Draw water particle
        ctx.fillStyle = '#4169E1'; // Royal blue
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add white highlight
        ctx.fillStyle = '#87CEEB'; // Sky blue highlight
        ctx.beginPath();
        ctx.arc(this.x - 1, this.y - 1, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            x: this.x - this.size,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2
        };
    }
}

// Water system manager with object pooling
const WaterSystem = {
    particles: [],
    poolSize: 100,
    maxActiveParticles: 80,
    
    init() {
        // Create particle pool
        this.particles = [];
        for (let i = 0; i < this.poolSize; i++) {
            this.particles.push(new WaterParticle());
        }
    },
    
    reset() {
        // Deactivate all particles
        this.particles.forEach(particle => {
            particle.active = false;
        });
    },
    
    createParticle(x, y, facing) {
        // Find an inactive particle from the pool
        let particle = this.particles.find(p => !p.active);
        
        if (!particle) {
            // If no inactive particle available, reuse the oldest one
            particle = this.particles[0];
        }
        
        if (particle) {
            particle.init(x, y, facing);
        }
        
        // Limit active particles for performance
        this.limitActiveParticles();
    },
    
    limitActiveParticles() {
        const activeParticles = this.particles.filter(p => p.active);
        
        if (activeParticles.length > this.maxActiveParticles) {
            // Deactivate oldest particles
            const excess = activeParticles.length - this.maxActiveParticles;
            for (let i = 0; i < excess; i++) {
                activeParticles[i].active = false;
            }
        }
    },
    
    update(deltaTime) {
        this.particles.forEach(particle => {
            particle.update(deltaTime);
        });
    },
    
    render(ctx) {
        this.particles.forEach(particle => {
            particle.render(ctx);
        });
    },
    
    getActiveParticles() {
        return this.particles.filter(p => p.active);
    },
    
    // Get particles for collision detection
    getParticlesForCollision() {
        return this.particles.filter(p => p.active && !p.hasHitFire);
    },
    
    // Mark particle as having hit a fire
    markParticleHit(particle) {
        particle.hasHitFire = true;
        particle.life = Math.min(particle.life, 0.2); // Quick fade out
    },
    
    // Get statistics for debug
    getStats() {
        const activeCount = this.particles.filter(p => p.active).length;
        return {
            active: activeCount,
            total: this.particles.length
        };
    }
}; 