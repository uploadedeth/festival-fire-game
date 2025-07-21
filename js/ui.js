// ui.js - User interface management

const UI = {
    elements: {},
    
    init() {
        // Cache DOM elements
        this.elements = {
            timer: document.getElementById('timer'),
            firesCount: document.getElementById('fires-count'),
            score: document.getElementById('score'),
            finalScore: document.getElementById('final-score'),
            finalScoreDefeat: document.getElementById('final-score-defeat'),
            
            // Screens
            menuScreen: document.getElementById('menu-screen'),
            victoryScreen: document.getElementById('victory-screen'),
            defeatScreen: document.getElementById('defeat-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            
            // Buttons
            startGame: document.getElementById('start-game'),
            playAgainVictory: document.getElementById('play-again-victory'),
            playAgainDefeat: document.getElementById('play-again-defeat'),
            backToMenuVictory: document.getElementById('back-to-menu-victory'),
            backToMenuDefeat: document.getElementById('back-to-menu-defeat'),
            backToMenuPause: document.getElementById('back-to-menu-pause'),
            resumeGame: document.getElementById('resume-game')
        };
        
        this.setupEventListeners();
        this.updateHUD();
    },
    
    setupEventListeners() {
        // Start game
        this.elements.startGame.addEventListener('click', () => {
            GameManager.startGame();
        });
        
        // Play again buttons (now both lead to same action)
        this.elements.playAgainVictory.addEventListener('click', () => {
            GameManager.startGame();
        });
        
        this.elements.playAgainDefeat.addEventListener('click', () => {
            GameManager.startGame();
        });
        
        // Back to menu buttons
        this.elements.backToMenuVictory.addEventListener('click', () => {
            GameManager.returnToMenu();
        });
        
        this.elements.backToMenuDefeat.addEventListener('click', () => {
            GameManager.returnToMenu();
        });
        
        this.elements.backToMenuPause.addEventListener('click', () => {
            GameManager.returnToMenu();
        });
        
        // Resume game
        this.elements.resumeGame.addEventListener('click', () => {
            GameManager.resumeGame();
        });
    },
    
    update(deltaTime) {
        // Update timer display with color changes
        this.updateTimerColor();
        
        // Pulse timer when low
        if (GameManager.timer <= 10 && GameManager.state === GameStates.PLAYING) {
            this.elements.timer.classList.add('pulse');
        } else {
            this.elements.timer.classList.remove('pulse');
        }
        
        // Update HUD during gameplay
        if (GameManager.state === GameStates.PLAYING) {
            this.updateHUD();
        }
    },
    
    updateHUD() {
        this.updateTimer();
        this.updateFiresCount();
        this.updateScore();
    },
    
    updateTimer() {
        const timeText = Math.ceil(Math.max(0, GameManager.timer)).toString();
        this.elements.timer.textContent = timeText;
    },
    
    updateTimerColor() {
        const timer = this.elements.timer;
        
        if (GameManager.timer <= 10) {
            timer.style.color = '#ff0000'; // Red
        } else if (GameManager.timer <= 20) {
            timer.style.color = '#ff8800'; // Orange
        } else {
            timer.style.color = '#ff4444'; // Default red
        }
    },
    
    updateFiresCount() {
        const count = FireManager.getFireCount();
        this.elements.firesCount.textContent = `Fires: ${count}`;
    },
    
    updateScore() {
        this.elements.score.textContent = `Score: ${GameManager.score}`;
    },
    
    showScreen(screenId) {
        this.hideAllScreens();
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    },
    
    hideAllScreens() {
        const screens = [
            this.elements.menuScreen,
            this.elements.victoryScreen,
            this.elements.defeatScreen,
            this.elements.pauseScreen
        ];
        
        screens.forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    },
    
    showGameOverScreen() {
        // Use the defeat screen as game over screen with updated content
        this.showScreen('defeat-screen');
        
        // Update the screen content
        const defeatScreen = this.elements.defeatScreen;
        const title = defeatScreen.querySelector('h1');
        const description = defeatScreen.querySelector('p');
        
        if (title) title.textContent = 'Time\'s Up!';
        if (description) description.textContent = 'You survived the full 60 seconds of fire fighting!';
        
        this.elements.finalScoreDefeat.textContent = `Final Score: ${GameManager.score}`;
        
        // Add celebration effect for completing the challenge
        setTimeout(() => {
            this.elements.defeatScreen.classList.add('pulse');
        }, 100);
    },
    
    showScorePopup(points, fireSize) {
        // Create floating score popup
        const popup = document.createElement('div');
        popup.textContent = `+${points}`;
        popup.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff00;
            font-size: 32px;
            font-weight: bold;
            z-index: 200;
            pointer-events: none;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: scorePopup 1.5s ease-out forwards;
        `;
        
        // Add CSS animation if not exists
        if (!document.querySelector('#score-popup-style')) {
            const style = document.createElement('style');
            style.id = 'score-popup-style';
            style.textContent = `
                @keyframes scorePopup {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -70%) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -90%) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(popup);
        
        // Remove after animation
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1500);
    },
    
    showNotification(message, duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    },
    
    // Utility methods for screen management
    isScreenVisible(screenId) {
        const screen = document.getElementById(screenId);
        return screen && !screen.classList.contains('hidden');
    },
    
    addScreenTransition(screenElement, transitionType = 'fade') {
        // Add CSS transition classes
        screenElement.style.transition = 'all 0.3s ease';
        
        if (transitionType === 'slide') {
            screenElement.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                screenElement.style.transform = 'translateY(0)';
            }, 50);
        }
    },
    
    // Debug information
    getDebugInfo() {
        const fireStats = FireManager.getFireStats();
        return {
            gameState: GameManager.state,
            timer: GameManager.timer.toFixed(1),
            fires: FireManager.getFireCount(),
            fireStats: fireStats,
            waterParticles: WaterSystem.getStats().active,
            score: GameManager.score
        };
    }
}; 