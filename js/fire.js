// fire.js - Fire entity and management system

class Fire {
    constructor(x, y, size = 'small') {
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = Math.random().toString(36).substr(2, 9);
        
        // Size-based properties
        const config = FireManager.FIRE_CONFIG[size];
        this.width = config.width;
        this.height = config.height;
        this.health = config.health;
        this.maxHealth = config.health;
        
        // Spread mechanics
        this.spreadTimer = 0;
        this.spreadDelay = 8 + Math.random() * 7; // 8-15 seconds
        this.hasSpread = false;
        
        // Animation
        this.animationTimer = 0;
        this.animationFrame = 0;
        this.flickerIntensity = 0.8 + Math.random() * 0.2;
        
        // Movement properties
        this.moveTimer = 0;
        this.moveInterval = 1 + Math.random() * 2; // Change direction every 1-3 seconds
        this.vx = (Math.random() - 0.5) * 30; // Random horizontal velocity
        this.vy = (Math.random() - 0.5) * 20; // Random vertical velocity
        this.moveSpeed = 15 + Math.random() * 25; // Base movement speed
        this.originalX = x; // Store original position
        this.originalY = y;
        this.maxMoveDistance = 40 + Math.random() * 30; // Maximum distance from original position
        
        // Visual effects
        this.particles = [];
        this.smokeTimer = 0;
    }
    
    update(deltaTime) {
        // Update movement
        this.updateMovement(deltaTime);
        
        // Update spread timer
        if (!this.hasSpread) {
            this.spreadTimer += deltaTime;
            
            if (this.spreadTimer >= this.spreadDelay) {
                this.trySpread();
                this.hasSpread = true;
            }
        }
        
        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 0.1) { // 10 FPS animation
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
        
        // Update smoke particles
        this.smokeTimer += deltaTime;
        if (this.smokeTimer >= 0.3) {
            this.createSmokeParticle();
            this.smokeTimer = 0;
        }
        
        // Update existing particles
        this.particles.forEach(particle => particle.update(deltaTime));
        this.particles = this.particles.filter(particle => particle.life > 0);
    }
    
    updateMovement(deltaTime) {
        // Update move timer
        this.moveTimer += deltaTime;
        
        // Change direction periodically
        if (this.moveTimer >= this.moveInterval) {
            this.vx = (Math.random() - 0.5) * this.moveSpeed;
            this.vy = (Math.random() - 0.5) * this.moveSpeed;
            this.moveTimer = 0;
            this.moveInterval = 1 + Math.random() * 2; // New random interval
        }
        
        // Apply movement
        const newX = this.x + this.vx * deltaTime;
        const newY = this.y + this.vy * deltaTime;
        
        // Check bounds - stay within stage area and max distance from original position
        const stageLeft = 120;
        const stageRight = 680;
        const stageTop = 300;
        const stageBottom = 450;
        
        // Distance from original position
        const distanceFromOrigin = Math.sqrt(
            Math.pow(newX - this.originalX, 2) + 
            Math.pow(newY - this.originalY, 2)
        );
        
        // Apply position if within bounds
        if (newX >= stageLeft && 
            newX + this.width <= stageRight && 
            newY >= stageTop && 
            newY + this.height <= stageBottom &&
            distanceFromOrigin <= this.maxMoveDistance) {
            this.x = newX;
            this.y = newY;
        } else {
            // Bounce back or change direction if hitting bounds
            if (newX < stageLeft || newX + this.width > stageRight || distanceFromOrigin > this.maxMoveDistance) {
                this.vx = -this.vx * 0.8; // Reverse and dampen
            }
            if (newY < stageTop || newY + this.height > stageBottom || distanceFromOrigin > this.maxMoveDistance) {
                this.vy = -this.vy * 0.8; // Reverse and dampen
            }
        }
        
        // Gradually slow down movement (friction)
        this.vx *= 0.98;
        this.vy *= 0.98;
    }
    
    trySpread() {
        // Only spread if there are few fires and random chance
        if (FireManager.fires.length < 6 && Math.random() < 0.4) {
            FireManager.spawnNearbyFire(this.x, this.y);
        }
    }
    
    takeDamage() {
        this.health--;
        
        // Visual feedback
        this.flickerIntensity = 1.5; // Bright flash when hit
        
        // Play hit sound
        AudioManager.playFireHitSound();
        
        // Create splash particles
        this.createSplashParticles();
        
        // Movement reaction when hit - sudden jerk
        this.vx += (Math.random() - 0.5) * 50;
        this.vy += (Math.random() - 0.5) * 50;
        
        return this.health <= 0;
    }
    
    createSmokeParticle() {
        const smoke = {
            x: this.x + this.width/2 + (Math.random() - 0.5) * this.width,
            y: this.y,
            vx: (Math.random() - 0.5) * 20,
            vy: -30 - Math.random() * 30,
            size: 2 + Math.random() * 4,
            life: 1.0,
            update(deltaTime) {
                this.x += this.vx * deltaTime;
                this.y += this.vy * deltaTime;
                this.vy *= 0.98; // Slow down
                this.size += deltaTime * 5; // Grow
                this.life -= deltaTime * 0.3; // Fade
            }
        };
        this.particles.push(smoke);
    }
    
    createSplashParticles() {
        for (let i = 0; i < 5; i++) {
            const splash = {
                x: this.x + this.width/2,
                y: this.y + this.height/2,
                vx: (Math.random() - 0.5) * 100,
                vy: -50 - Math.random() * 50,
                size: 2 + Math.random() * 2,
                life: 0.5,
                color: Math.random() < 0.5 ? '#4169E1' : '#87CEEB',
                update(deltaTime) {
                    this.x += this.vx * deltaTime;
                    this.y += this.vy * deltaTime;
                    this.vy += 200 * deltaTime; // Gravity
                    this.life -= deltaTime * 2;
                }
            };
            this.particles.push(splash);
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Draw fire base
        const flickerOffset = Math.sin(Date.now() * 0.01) * 2;
        const baseColor = this.getFireColor();
        
        // Main fire body
        ctx.fillStyle = baseColor;
        ctx.fillRect(
            this.x + flickerOffset, 
            this.y, 
            this.width, 
            this.height
        );
        
        // Fire animation frames
        this.drawFireFlames(ctx, flickerOffset);
        
        // Health indicator
        this.drawHealthBar(ctx);
        
        // Render particles (smoke and splash)
        this.renderParticles(ctx);
        
        // Flicker effect when hit
        if (this.flickerIntensity > 1) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            this.flickerIntensity *= 0.95; // Fade out
        }
        
        // Debug: Draw movement bounds (if debug mode)
        if (window.location.hash === '#debug') {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.originalX + this.width/2, this.originalY + this.height/2, this.maxMoveDistance, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    getFireColor() {
        const colors = {
            small: '#FF4500',  // Orange red
            medium: '#FF6347', // Tomato
            large: '#DC143C'   // Crimson
        };
        return colors[this.size] || colors.small;
    }
    
    drawFireFlames(ctx, flickerOffset) {
        // Draw animated flame tips
        const flameHeight = this.height * 0.3;
        const numFlames = Math.ceil(this.width / 8);
        
        for (let i = 0; i < numFlames; i++) {
            const flameX = this.x + (i * this.width / numFlames) + flickerOffset;
            const flameY = this.y - flameHeight + Math.sin(Date.now() * 0.01 + i) * 3;
            
            // Gradient from orange to yellow
            const gradient = ctx.createLinearGradient(flameX, flameY, flameX, flameY + flameHeight);
            gradient.addColorStop(0, '#FFD700'); // Gold at top
            gradient.addColorStop(1, this.getFireColor()); // Base color at bottom
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(flameX, flameY + flameHeight);
            ctx.lineTo(flameX + 4, flameY);
            ctx.lineTo(flameX + 8, flameY + flameHeight);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    drawHealthBar(ctx) {
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 4;
            const barY = this.y - 10;
            
            // Background
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, barY, barWidth, barHeight);
            
            // Health
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : '#FF6347';
            ctx.fillRect(this.x, barY, barWidth * healthPercent, barHeight);
        }
    }
    
    renderParticles(ctx) {
        this.particles.forEach(particle => {
            if (particle.life <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = particle.life;
            
            if (particle.color) {
                // Splash particle
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Smoke particle
                ctx.fillStyle = '#555';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Fire management system
const FireManager = {
    fires: [],
    spawnTimer: 0,
    spawnInterval: 3, // seconds between new fires (increased frequency)
    maxFires: 12, // Allow more fires on screen
    difficultyTimer: 0,
    
    FIRE_CONFIG: {
        small: { health: 2, width: 20, height: 30 },
        medium: { health: 4, width: 30, height: 40 },
        large: { health: 6, width: 40, height: 50 }
    },
    
    init() {
        this.fires = [];
        this.spawnTimer = 0;
        this.difficultyTimer = 0;
    },
    
    reset() {
        this.fires = [];
        this.spawnTimer = 0;
        this.difficultyTimer = 0;
    },
    
    startContinuousSpawning() {
        // Start with some initial fires
        const numInitialFires = 2 + Math.floor(Math.random() * 3); // 2-4 initial fires
        
        for (let i = 0; i < numInitialFires; i++) {
            this.spawnRandomFire();
        }
        
        console.log(`Started continuous spawning with ${numInitialFires} initial fires`);
    },
    
    spawnRandomFire() {
        if (this.fires.length >= this.maxFires) return;
        
        // Random position on the stage
        const stageLeft = 120;
        const stageRight = 680;
        const stageTop = 300;
        const stageBottom = 450;
        
        let attempts = 0;
        let x, y;
        let validPosition = false;
        
        // Try to find a valid position (not too close to existing fires)
        while (!validPosition && attempts < 10) {
            x = stageLeft + Math.random() * (stageRight - stageLeft - 40);
            y = stageTop + Math.random() * (stageBottom - stageTop - 50);
            
            // Check if too close to existing fires
            const tooClose = this.fires.some(fire => {
                const dx = fire.x - x;
                const dy = fire.y - y;
                return Math.sqrt(dx * dx + dy * dy) < 50;
            });
            
            if (!tooClose) {
                validPosition = true;
            }
            attempts++;
        }
        
        if (validPosition) {
            const size = this.getRandomFireSize();
            const fire = new Fire(x, y, size);
            this.fires.push(fire);
            
            console.log(`Spawned ${size} fire at (${Math.round(x)}, ${Math.round(y)})`);
        }
    },
    
    spawnNearbyFire(originX, originY) {
        if (this.fires.length >= this.maxFires) return;
        
        // Spawn near the origin fire
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        
        const x = originX + Math.cos(angle) * distance;
        const y = originY + Math.sin(angle) * distance;
        
        // Clamp to stage bounds
        const stageLeft = 120;
        const stageRight = 680;
        const stageTop = 300;
        const stageBottom = 450;
        
        const clampedX = Math.max(stageLeft, Math.min(stageRight - 40, x));
        const clampedY = Math.max(stageTop, Math.min(stageBottom - 50, y));
        
        const size = this.getRandomFireSize();
        const fire = new Fire(clampedX, clampedY, size);
        this.fires.push(fire);
        
        console.log(`Fire spread! New ${size} fire at (${Math.round(clampedX)}, ${Math.round(clampedY)})`);
    },
    
    getRandomFireSize() {
        // Dynamic difficulty - more large fires as time progresses
        const timeElapsed = GameManager.getTimeElapsed();
        const difficultyFactor = Math.min(timeElapsed / 30, 1); // Ramp up over 30 seconds
        
        const rand = Math.random();
        
        // Early game: mostly small fires
        if (difficultyFactor < 0.3) {
            if (rand < 0.8) return 'small';
            if (rand < 0.95) return 'medium';
            return 'large';
        }
        // Mid game: balanced
        else if (difficultyFactor < 0.7) {
            if (rand < 0.5) return 'small';
            if (rand < 0.8) return 'medium';
            return 'large';
        }
        // Late game: more large fires
        else {
            if (rand < 0.3) return 'small';
            if (rand < 0.6) return 'medium';
            return 'large';
        }
    },
    
    update(deltaTime) {
        // Update existing fires
        this.fires.forEach(fire => fire.update(deltaTime));
        
        // Update spawn timer for continuous spawning
        this.spawnTimer += deltaTime;
        this.difficultyTimer += deltaTime;
        
        // Dynamic spawn rate - faster as time progresses
        const timeElapsed = GameManager.getTimeElapsed();
        const difficultyFactor = Math.min(timeElapsed / 40, 1); // Ramp up over 40 seconds
        const currentSpawnInterval = Math.max(1.5, this.spawnInterval - (difficultyFactor * 1.5)); // 3s to 1.5s
        
        if (this.spawnTimer >= currentSpawnInterval) {
            this.spawnRandomFire();
            this.spawnTimer = 0;
        }
        
        // Increase max fires over time
        this.maxFires = Math.min(15, 12 + Math.floor(difficultyFactor * 3));
    },
    
    render(ctx) {
        this.fires.forEach(fire => fire.render(ctx));
        
        // Debug: Show spawn rate info
        if (window.location.hash === '#debug') {
            const timeElapsed = GameManager.getTimeElapsed();
            const difficultyFactor = Math.min(timeElapsed / 40, 1);
            const currentSpawnInterval = Math.max(1.5, this.spawnInterval - (difficultyFactor * 1.5));
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(`Spawn Rate: ${currentSpawnInterval.toFixed(1)}s`, 10, 60);
            ctx.fillText(`Max Fires: ${this.maxFires}`, 10, 75);
            ctx.fillText(`Difficulty: ${(difficultyFactor * 100).toFixed(0)}%`, 10, 90);
        }
    },
    
    removeFire(fire) {
        const index = this.fires.indexOf(fire);
        if (index > -1) {
            // Add score based on fire size
            GameManager.addScore(fire.size);
            
            // Remove the fire
            this.fires.splice(index, 1);
            AudioManager.playFireExtinguishSound();
            
            console.log(`${fire.size} fire extinguished! ${this.fires.length} fires remaining.`);
        }
    },
    
    getFireCount() {
        return this.fires.length;
    },
    
    // Get fires by size for statistics
    getFireStats() {
        const stats = { small: 0, medium: 0, large: 0 };
        this.fires.forEach(fire => {
            stats[fire.size]++;
        });
        return stats;
    }
}; 