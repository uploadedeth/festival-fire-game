// main.js - Game entry point and main loop
let canvas, ctx;
let lastTime = 0;
let fpsCounter = 0;
let lastFpsTime = 0;

// Initialize the game
function init() {
    // Get canvas and context
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set up canvas properties
    ctx.imageSmoothingEnabled = false;
    
    // Initialize all game systems
    GameManager.init();
    InputHandler.init();
    UI.init();
    AudioManager.init();
    WaterSystem.init(); // Initialize water particle system
    FireManager.init(); // Initialize fire manager
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
    
    console.log('Festival Fire Fighter initialized!');
}

// Main game loop
function gameLoop(currentTime) {
    // Calculate delta time
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap at 100ms
    lastTime = currentTime;
    
    // Update FPS counter
    updateFPS(currentTime);
    
    // Update game state
    update(deltaTime);
    
    // Render everything
    render();
    
    // Continue the loop
    requestAnimationFrame(gameLoop);
}

// Update all game systems
function update(deltaTime) {
    if (GameManager.state === GameStates.PLAYING) {
        // Update timer
        GameManager.updateTimer(deltaTime);
        
        // Update player
        firefighter.update(deltaTime);
        
        // Update water particles
        WaterSystem.update(deltaTime);
        
        // Update fires
        FireManager.update(deltaTime);
        
        // Check collisions
        CollisionDetector.checkCollisions();
        
        // Check victory/defeat conditions
        GameManager.checkGameConditions();
    }
    
    // Update UI
    UI.update(deltaTime);
}

// Render everything
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (GameManager.state === GameStates.PLAYING || GameManager.state === GameStates.PAUSED) {
        // Draw stage background
        drawStage();
        
        // Draw fires
        FireManager.render(ctx);
        
        // Draw firefighter
        firefighter.render(ctx);
        
        // Draw water particles
        WaterSystem.render(ctx);
        
        // Draw FPS counter (debug)
        if (window.location.hash === '#debug') {
            drawFPS();
        }
    }
}

// Draw the stage background
function drawStage() {
    // Stage platform
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(100, 450, 600, 50);
    
    // Stage backdrop
    ctx.fillStyle = '#333';
    ctx.fillRect(120, 300, 560, 150);
    
    // Stage equipment (speakers, etc.)
    ctx.fillStyle = '#222';
    ctx.fillRect(150, 320, 40, 80);
    ctx.fillRect(610, 320, 40, 80);
    
    // DJ booth
    ctx.fillStyle = '#444';
    ctx.fillRect(350, 380, 100, 70);
    
    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 500, canvas.width, 100);
}

// Update and display FPS
function updateFPS(currentTime) {
    fpsCounter++;
    
    if (currentTime - lastFpsTime >= 1000) {
        // Update FPS every second
        GameManager.currentFPS = fpsCounter;
        fpsCounter = 0;
        lastFpsTime = currentTime;
    }
}

// Draw FPS counter (debug mode)
function drawFPS() {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`FPS: ${GameManager.currentFPS}`, 10, 30);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 