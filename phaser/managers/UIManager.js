// UIManager.js - Enhanced UI management for Phaser edition

class UIManager {
    constructor() {
        this.elements = {
            timer: document.getElementById('timer-display'),
            score: document.getElementById('score-display'),
            fires: document.getElementById('fires-display'),
            mobileControls: document.getElementById('mobile-controls')
        };
        
        this.currentScore = 0;
        this.currentTimer = 60;
        this.currentFires = 0;
        this.isGameActive = false;
        
        // Authentication UI state
        this.userInfo = null;
        this.isAuthenticated = false;
        
        this.initializeUI();
        
        console.log('📱 UI Manager initialized with authentication support');
    }
    
    initializeUI() {
        // Set initial values
        this.updateScore(0);
        this.updateTimer(60);
        this.updateFireCount(0);
        
        // Add CSS animations for score popups
        this.addScorePopupAnimations();
        
        // Set up mobile controls if on touch device
        if (this.isTouchDevice()) {
            this.setupMobileControls();
        }
    }
    
    addScorePopupAnimations() {
        // Add CSS animation for score popups if not already added
        if (!document.querySelector('#score-popup-animations')) {
            const style = document.createElement('style');
            style.id = 'score-popup-animations';
            style.textContent = `
                @keyframes scorePopupTopLeft {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    25% {
                        opacity: 1;
                        transform: translateY(-10px) scale(1.2);
                    }
                    75% {
                        opacity: 0.8;
                        transform: translateY(-30px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.8);
                    }
                }
                
                @keyframes notificationPop {
                    0% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes notificationFade {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupMobileControls() {
        if (this.elements.mobileControls) {
            this.elements.mobileControls.classList.remove('hidden');
        }
    }
    
    updateScore(score) {
        this.currentScore = score;
        if (this.elements.score) {
            this.elements.score.textContent = `Score: ${score}`;
            
            // Add pulse effect for score increases
            if (score > 0) {
                this.elements.score.classList.add('score-update');
                setTimeout(() => {
                    this.elements.score.classList.remove('score-update');
                }, 300);
            }
        }
    }
    
    updateTimer(timeLeft) {
        this.currentTimer = timeLeft;
        if (this.elements.timer) {
            // Format time as MM:SS or just seconds
            const displayTime = timeLeft < 60 ? 
                Math.ceil(timeLeft) : 
                `${Math.floor(timeLeft / 60)}:${String(Math.floor(timeLeft % 60)).padStart(2, '0')}`;
            
            this.elements.timer.textContent = displayTime;
            
            // Change color based on remaining time
            this.elements.timer.className = 'timer-display';
            if (timeLeft <= 10) {
                this.elements.timer.classList.add('danger');
            } else if (timeLeft <= 20) {
                this.elements.timer.classList.add('warning');
            }
        }
    }
    
    updateFireCount(count) {
        this.currentFires = count;
        if (this.elements.fires) {
            this.elements.fires.textContent = `Fires: ${count}`;
            
            // Color based on fire count
            if (count >= 10) {
                this.elements.fires.style.color = '#ff4444';
            } else if (count >= 5) {
                this.elements.fires.style.color = '#ff8800';
            } else {
                this.elements.fires.style.color = '#ff6b6b';
            }
        }
    }
    
    showScorePopup(points, fireSize, scene) {
        // If no scene provided, fall back to HTML popup (for backwards compatibility)
        if (!scene || !scene.add) {
            console.warn('No scene provided for score popup, using HTML fallback');
            this.showHtmlScorePopup(points, fireSize);
            return;
        }
        
        // Different colors and sizes based on fire size
        let color = '#4ecdc4';
        let fontSize = 28;
        let emoji = '💧';
        
        switch (fireSize) {
            case 'small':
                color = '#4ecdc4';
                fontSize = 28;
                emoji = '💧';
                break;
            case 'medium':
                color = '#45b7d1';
                fontSize = 36;
                emoji = '🌊';
                break;
            case 'large':
                color = '#96ceb4';
                fontSize = 42;
                emoji = '🌊💨';
                break;
        }
        
        // Create Phaser text object in top left corner of game canvas
        const scoreText = scene.add.text(80, 70, `${emoji} +${points}`, {
            fontSize: `${fontSize}px`,
            fill: color,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5).setDepth(1100); // Higher than X button
        
        // Animate the score popup
        scene.tweens.add({
            targets: scoreText,
            y: scoreText.y - 50,
            alpha: 0,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                scoreText.destroy();
            }
        });
        
        // Play sound effect
        if (window.GameManagers.audio) {
            window.GameManagers.audio.playScorePopupSound();
        }
    }
    
    // Fallback HTML popup method (kept for compatibility)
    showHtmlScorePopup(points, fireSize) {
        // Create floating score popup
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        
        // Different colors and sizes based on fire size
        let color = '#00ff00';
        let fontSize = '32px';
        let emoji = '💧';
        
        switch (fireSize) {
            case 'small':
                color = '#4ecdc4';
                fontSize = '28px';
                emoji = '💧';
                break;
            case 'medium':
                color = '#45b7d1';
                fontSize = '36px';
                emoji = '🌊';
                break;
            case 'large':
                color = '#96ceb4';
                fontSize = '42px';
                emoji = '🌊💨';
                break;
        }
        
        popup.innerHTML = `${emoji} +${points}`;
        popup.style.cssText = `
            position: fixed;
            top: 10%;
            left: 5%;
            transform: translateX(0);
            color: ${color};
            font-size: ${fontSize};
            font-weight: bold;
            z-index: 200;
            pointer-events: none;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: scorePopupTopLeft 2s ease-out forwards;
            font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(popup);
        
        // Remove after animation (2 seconds to match new animation)
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 2000);
    }
    
    showGameStart() {
        this.isGameActive = true;
        
        // Hide UI overlay initially, then fade in
        const uiOverlay = document.getElementById('ui-overlay');
        if (uiOverlay) {
            uiOverlay.style.opacity = '0';
            setTimeout(() => {
                uiOverlay.style.transition = 'opacity 1s ease-in';
                uiOverlay.style.opacity = '1';
            }, 500);
        }
        
        // Show mobile controls if needed
        if (this.isTouchDevice() && this.elements.mobileControls) {
            this.elements.mobileControls.classList.remove('hidden');
        }
        
        // Add game start notification
        this.showNotification('🔥 Fire Challenge Started! 🚒', 2000);
    }
    
    showGameEnd(finalScore) {
        this.isGameActive = false;
        
        // Hide mobile controls
        if (this.elements.mobileControls) {
            this.elements.mobileControls.classList.add('hidden');
        }
        
        // Removed final score notification since score is shown on end screen
    }
    
    showNotification(message, duration = 2000) {
        // Create notification popup
        const notification = document.createElement('div');
        notification.className = 'game-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 300;
            text-align: center;
            backdrop-filter: blur(5px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: notificationPop 0.5s ease-out;
            font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationFade 0.5s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, duration);
    }
    

    

    

    

    

    
    showProgress(message, percentage) {
        // Show loading/progress indicator
        let progressBar = document.getElementById('progress-indicator');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'progress-indicator';
            progressBar.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                z-index: 400;
                font-family: Arial, sans-serif;
                min-width: 200px;
                text-align: center;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.innerHTML = `
            <div style="margin-bottom: 5px;">${message}</div>
            <div style="background: #333; height: 4px; border-radius: 2px; overflow: hidden;">
                <div style="background: #4ecdc4; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
            </div>
        `;
        
        if (percentage >= 100) {
            setTimeout(() => {
                if (progressBar.parentNode) {
                    progressBar.parentNode.removeChild(progressBar);
                }
            }, 1000);
        }
    }
    
    hideProgress() {
        const progressBar = document.getElementById('progress-indicator');
        if (progressBar) {
            progressBar.remove();
        }
    }
    
    addScreenShake() {
        // Add screen shake effect to game container
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.classList.add('screen-shake');
            setTimeout(() => {
                gameContainer.classList.remove('screen-shake');
            }, 500);
        }
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Public API methods
    updateGameData(gameData) {
        if (gameData.score !== undefined) {
            this.updateScore(gameData.score);
        }
        if (gameData.timer !== undefined) {
            this.updateTimer(gameData.timer);
        }
        if (gameData.fireCount !== undefined) {
            this.updateFireCount(gameData.fireCount);
        }
    }
    
    setGameActive(active) {
        this.isGameActive = active;
        
        if (active) {
            this.showGameStart();
        } else {
            this.showGameEnd(this.currentScore);
        }
    }
    
    getCurrentScore() {
        return this.currentScore;
    }
    
    getCurrentTimer() {
        return this.currentTimer;
    }
    
    getCurrentFireCount() {
        return this.currentFires;
    }
    
    destroy() {
        // Clean up any remaining UI elements
        const dynamicElements = [
            'progress-indicator'
        ];
        
        dynamicElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
        
        // Remove score popups
        const scorePopups = document.querySelectorAll('.score-popup');
        scorePopups.forEach(popup => popup.remove());
        
        // Remove notifications
        const notifications = document.querySelectorAll('.game-notification');
        notifications.forEach(notification => notification.remove());
    }

    setUserInfo(userAuth) {
        this.userInfo = userAuth;
        this.isAuthenticated = userAuth.isAuthenticated;
        
        if (this.isAuthenticated) {
            this.showUserWelcome();
            this.createUserStatusElement();
        }
    }
    
    setUsername(username) {
        this.username = username;
        this.updateUserDisplay();
    }
    
    showUserWelcome() {
        if (!this.userInfo || !this.userInfo.username) return;
        
        // Create welcome message element
        const welcomeElement = document.createElement('div');
        welcomeElement.id = 'user-welcome';
        welcomeElement.className = 'user-welcome';
        welcomeElement.innerHTML = `
            <div class="welcome-message">
                <span class="welcome-text">Welcome, ${this.userInfo.username}!</span>
                <span class="auth-status">✅ Authenticated</span>
            </div>
        `;
        
        // Add to game container
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(welcomeElement);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                welcomeElement.style.opacity = '0';
                setTimeout(() => {
                    if (welcomeElement.parentNode) {
                        welcomeElement.parentNode.removeChild(welcomeElement);
                    }
                }, 500);
            }, 3000);
        }
    }
    
    createUserStatusElement() {
        // Create persistent user status display
        const statusElement = document.createElement('div');
        statusElement.id = 'user-status';
        statusElement.className = 'user-status';
        statusElement.innerHTML = `
            <div class="user-info">
                <span class="username">${this.userInfo.username}</span>
                <span class="auth-indicator">🔐</span>
            </div>
        `;
        
        // Add to UI overlay
        const uiOverlay = document.getElementById('ui-overlay');
        if (uiOverlay) {
            uiOverlay.appendChild(statusElement);
        }
    }
    
    showAuthenticatedFeatures(show) {
        // Show/hide features that require authentication
        const authFeatures = document.querySelectorAll('.auth-required');
        authFeatures.forEach(element => {
            element.style.display = show ? 'block' : 'none';
        });
    }
    
    showAuthRequiredMessage() {
        const messageElement = document.createElement('div');
        messageElement.className = 'auth-required-message';
        messageElement.innerHTML = `
            <div class="auth-message">
                <h3>🔐 Authentication Required</h3>
                <p>Please log in to continue playing the game.</p>
            </div>
        `;
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(messageElement);
        }
    }
    
    showScoreSavedMessage(scoreData) {
        const messageElement = document.createElement('div');
        messageElement.className = 'score-saved-message success';
        messageElement.innerHTML = `
            <div class="message-content">
                <span class="icon">💾</span>
                <span class="text">Score saved successfully!</span>
                ${scoreData.ranking ? `<span class="ranking">Rank: #${scoreData.ranking}</span>` : ''}
            </div>
        `;
        
        this.showTemporaryMessage(messageElement, 3000);
    }
    
    showScoreSaveError(error) {
        const messageElement = document.createElement('div');
        messageElement.className = 'score-saved-message error';
        messageElement.innerHTML = `
            <div class="message-content">
                <span class="icon">❌</span>
                <span class="text">Failed to save score: ${error}</span>
            </div>
        `;
        
        this.showTemporaryMessage(messageElement, 5000);
    }
    
    showTemporaryMessage(element, duration) {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(element);
            
            // Auto-hide after duration
            setTimeout(() => {
                element.style.opacity = '0';
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }, 500);
            }, duration);
        }
    }
    
    setUserHighScores(highScores) {
        // Store and potentially display user's high scores
        this.userHighScores = highScores;
        // Could update a leaderboard UI element here
    }
    
    updateUserDisplay() {
        const userStatusElement = document.getElementById('user-status');
        if (userStatusElement && this.username) {
            const usernameSpan = userStatusElement.querySelector('.username');
            if (usernameSpan) {
                usernameSpan.textContent = this.username;
            }
        }
    }
} 