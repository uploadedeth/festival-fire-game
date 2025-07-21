// firefighter.js - Player character logic

const firefighter = {
    // Position and dimensions
    x: 400, // Starting at center
    y: 470, // On the ground
    width: 32,
    height: 48,
    
    // Movement properties
    speed: 200, // pixels per second
    facing: 'right',
    
    // State
    isSprayingWater: false,
    sprayTimer: 0,
    sprayInterval: 0.1, // seconds between water particles
    
    // Animation
    animationFrame: 0,
    animationTimer: 0,
    animationSpeed: 0.2,
    
    init() {
        this.reset();
    },
    
    reset() {
        this.x = canvas.width / 2 - this.width / 2;
        this.y = 470;
        this.facing = 'right';
        this.isSprayingWater = false;
        this.sprayTimer = 0;
        this.animationFrame = 0;
        this.animationTimer = 0;
    },
    
    update(deltaTime) {
        // Handle movement
        this.handleMovement(deltaTime);
        
        // Handle water spraying
        this.handleWaterSpray(deltaTime);
        
        // Update animations
        this.updateAnimation(deltaTime);
    },
    
    handleMovement(deltaTime) {
        let isMoving = false;
        
        // Left movement
        if (InputHandler.isMovingLeft()) {
            this.x -= this.speed * deltaTime;
            this.facing = 'left';
            isMoving = true;
        }
        
        // Right movement
        if (InputHandler.isMovingRight()) {
            this.x += this.speed * deltaTime;
            this.facing = 'right';
            isMoving = true;
        }
        
        // Constrain to canvas bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
    },
    
    handleWaterSpray(deltaTime) {
        const wasSpraying = this.isSprayingWater;
        this.isSprayingWater = InputHandler.isSpraying();
        
        // Play spray sound when starting to spray
        if (this.isSprayingWater && !wasSpraying) {
            AudioManager.playSpraySound();
        }
        
        // Spawn water particles while spraying
        if (this.isSprayingWater) {
            this.sprayTimer += deltaTime;
            
            if (this.sprayTimer >= this.sprayInterval) {
                this.spawnWaterParticle();
                this.sprayTimer = 0;
            }
        }
    },
    
    spawnWaterParticle() {
        // Calculate spray position based on facing direction
        const sprayX = this.facing === 'right' ? 
            this.x + this.width : 
            this.x;
        
        const sprayY = this.y + 10; // Slightly above firefighter
        
        // Create water particle
        WaterSystem.createParticle(sprayX, sprayY, this.facing);
    },
    
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 4; // 4 frame animation
            this.animationTimer = 0;
        }
    },
    
    render(ctx) {
        ctx.save();
        
        // Draw firefighter body
        ctx.fillStyle = '#FF6B35'; // Orange firefighter suit
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw helmet
        ctx.fillStyle = '#FFD700'; // Gold helmet
        ctx.fillRect(this.x + 4, this.y - 8, this.width - 8, 12);
        
        // Draw face
        ctx.fillStyle = '#FFDBAC'; // Skin color
        ctx.fillRect(this.x + 8, this.y + 4, this.width - 16, 16);
        
        // Draw equipment belt
        ctx.fillStyle = '#8B4513'; // Brown belt
        ctx.fillRect(this.x, this.y + 24, this.width, 8);
        
        // Draw water hose
        if (this.isSprayingWater) {
            ctx.strokeStyle = '#4169E1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            const hoseX = this.facing === 'right' ? 
                this.x + this.width : 
                this.x;
            
            ctx.moveTo(this.x + this.width/2, this.y + 16);
            ctx.lineTo(hoseX, this.y + 10);
            ctx.stroke();
        }
        
        // Draw facing direction indicator (eyes)
        ctx.fillStyle = '#000';
        if (this.facing === 'right') {
            ctx.fillRect(this.x + 20, this.y + 8, 2, 2);
            ctx.fillRect(this.x + 24, this.y + 8, 2, 2);
        } else {
            ctx.fillRect(this.x + 6, this.y + 8, 2, 2);
            ctx.fillRect(this.x + 10, this.y + 8, 2, 2);
        }
        
        // Draw spray effect
        if (this.isSprayingWater) {
            this.drawSprayEffect(ctx);
        }
        
        ctx.restore();
    },
    
    drawSprayEffect(ctx) {
        const sprayX = this.facing === 'right' ? 
            this.x + this.width : 
            this.x;
        
        const sprayY = this.y + 10;
        
        // Draw spray cone
        ctx.fillStyle = 'rgba(135, 206, 235, 0.3)'; // Light blue with transparency
        ctx.beginPath();
        ctx.moveTo(sprayX, sprayY);
        
        if (this.facing === 'right') {
            ctx.lineTo(sprayX + 30, sprayY - 15);
            ctx.lineTo(sprayX + 30, sprayY + 15);
        } else {
            ctx.lineTo(sprayX - 30, sprayY - 15);
            ctx.lineTo(sprayX - 30, sprayY + 15);
        }
        
        ctx.closePath();
        ctx.fill();
    },
    
    // Get the firefighter's bounding box for collision detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}; 