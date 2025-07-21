// audio.js - Audio management system

const AudioManager = {
    sounds: {},
    enabled: true,
    volume: 0.5,
    
    init() {
        // Create audio contexts using Web Audio API or fallback to HTML5 Audio
        this.audioContext = null;
        
        try {
            // Try to use Web Audio API for better control
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported, using HTML5 Audio');
        }
        
        // Create simple sound effects using oscillators and noise
        this.createSoundEffects();
        
        // Set up volume control
        this.setupVolumeControl();
    },
    
    createSoundEffects() {
        // Since we don't have actual audio files, we'll create simple procedural sounds
        this.sounds = {
            spray: this.createSpraySound,
            fireHit: this.createFireHitSound,
            fireExtinguish: this.createFireExtinguishSound,
            gameOver: this.createGameOverSound
        };
    },
    
    createSpraySound() {
        if (!this.audioContext || !this.enabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // White noise for water spray effect
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Error playing spray sound:', e);
        }
    },
    
    createFireHitSound() {
        if (!this.audioContext || !this.enabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Sizzle effect
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (e) {
            console.log('Error playing fire hit sound:', e);
        }
    },
    
    createFireExtinguishSound() {
        if (!this.audioContext || !this.enabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Steam/hiss effect
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Error playing fire extinguish sound:', e);
        }
    },
    
    createGameOverSound() {
        if (!this.audioContext || !this.enabled) return;
        
        try {
            // Play a triumphant completion fanfare
            const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]; // C5, E5, G5, C6, G5, C6
            
            notes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + index * 0.15);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.15);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + index * 0.15 + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.15 + 0.4);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start(this.audioContext.currentTime + index * 0.15);
                oscillator.stop(this.audioContext.currentTime + index * 0.15 + 0.4);
            });
        } catch (e) {
            console.log('Error playing game over sound:', e);
        }
    },
    
    setupVolumeControl() {
        // Resume audio context on first user interaction (required by browsers)
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
        
        // Add keyboard shortcut for mute (M key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM') {
                this.toggleMute();
            }
        });
    },
    
    // Sound playing methods
    playSpraySound() {
        this.createSpraySound();
    },
    
    playFireHitSound() {
        this.createFireHitSound();
    },
    
    playFireExtinguishSound() {
        this.createFireExtinguishSound();
    },
    
    playGameOverSound() {
        this.createGameOverSound();
    },
    
    // Volume control
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    },
    
    toggleMute() {
        this.enabled = !this.enabled;
        console.log(`Audio ${this.enabled ? 'enabled' : 'disabled'}`);
    },
    
    // Fallback HTML5 Audio methods (for when Web Audio API is not available)
    createHTML5Sound(frequency, duration, type = 'sine') {
        // This is a simplified fallback - in a real implementation,
        // you would load actual audio files
        console.log(`Playing ${type} sound at ${frequency}Hz for ${duration}s`);
    }
}; 