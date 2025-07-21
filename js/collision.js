// collision.js - Collision detection system

const CollisionDetector = {
    
    checkCollisions() {
        // Get active water particles that haven't hit fires yet
        const waterParticles = WaterSystem.getParticlesForCollision();
        const fires = FireManager.fires;
        
        // Check each water particle against each fire
        waterParticles.forEach(particle => {
            fires.forEach(fire => {
                if (this.checkWaterFireCollision(particle, fire)) {
                    this.handleWaterFireCollision(particle, fire);
                }
            });
        });
    },
    
    checkWaterFireCollision(waterParticle, fire) {
        // Simple AABB (Axis-Aligned Bounding Box) collision detection
        const waterBounds = waterParticle.getBounds();
        const fireBounds = fire.getBounds();
        
        return waterBounds.x < fireBounds.x + fireBounds.width &&
               waterBounds.x + waterBounds.width > fireBounds.x &&
               waterBounds.y < fireBounds.y + fireBounds.height &&
               waterBounds.y + waterBounds.height > fireBounds.y;
    },
    
    handleWaterFireCollision(waterParticle, fire) {
        // Mark water particle as having hit a fire
        WaterSystem.markParticleHit(waterParticle);
        
        // Damage the fire
        const fireExtinguished = fire.takeDamage();
        
        // Remove fire if extinguished
        if (fireExtinguished) {
            FireManager.removeFire(fire);
        }
        
        // Update UI
        UI.updateFiresCount();
    },
    
    // More advanced collision detection methods for future use
    
    checkCircleRectCollision(circle, rect) {
        // Check if circle intersects with rectangle
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
    },
    
    checkPointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    },
    
    checkCircleCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < (circle1.radius + circle2.radius);
    },
    
    // Utility functions
    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    getBounds(obj) {
        return {
            x: obj.x,
            y: obj.y,
            width: obj.width || 0,
            height: obj.height || 0
        };
    }
}; 