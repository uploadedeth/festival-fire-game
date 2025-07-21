// GameConfig.js - Core Phaser game configuration

const GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'gameContainer',
    backgroundColor: '#87CEEB',
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Make GameConfig available globally for other scripts
window.GameConfig = GameConfig; 