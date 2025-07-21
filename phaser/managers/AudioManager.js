// AudioManager.js - Enhanced audio system with Phaser

class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = new Map();
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.enabled = true;
        
        this.initializeAudio();
        this.createSounds();
        
        console.log('🔊 Audio Manager initialized');
    }
    
    initializeAudio() {
        // Set up audio context if needed
        try {
            if (!this.scene.sound.context) {
                this.scene.sound.unlock();
            }
        } catch (error) {
            console.warn('Audio context setup failed:', error);
        }
    }
    
    createSounds() {
        // Create procedural sounds using Phaser's audio system
        this.createWaterSounds();
        this.createFireSounds();
        this.createUIASounds();
        this.createAmbientSounds();
    }
    
    createWaterSounds() {
        // Water spray sound (generated)
        this.sounds.set('waterSpray', {
            play: () => this.playProceduralSound('waterSpray'),
            config: {
                frequency: 800,
                duration: 0.2,
                type: 'noise',
                volume: this.sfxVolume * 0.6
            }
        });
        
        // Water splash sound
        this.sounds.set('waterSplash', {
            play: () => this.playProceduralSound('waterSplash'),
            config: {
                frequency: 400,
                duration: 0.3,
                type: 'splash',
                volume: this.sfxVolume * 0.5
            }
        });
        
        // Steam hiss sound
        this.sounds.set('steamHiss', {
            play: () => this.playProceduralSound('steamHiss'),
            config: {
                frequency: 2000,
                duration: 0.8,
                type: 'hiss',
                volume: this.sfxVolume * 0.4
            }
        });
    }
    
    createFireSounds() {
        // Fire crackling
        this.sounds.set('fireCrackle', {
            play: () => this.playProceduralSound('fireCrackle'),
            config: {
                frequency: 150,
                duration: 0.5,
                type: 'crackle',
                volume: this.sfxVolume * 0.3
            }
        });
        
        // Fire hit by water
        this.sounds.set('fireHit', {
            play: () => this.playProceduralSound('fireHit'),
            config: {
                frequency: 600,
                duration: 0.2,
                type: 'impact',
                volume: this.sfxVolume * 0.7
            }
        });
        
        // Fire extinguished
        this.sounds.set('fireExtinguish', {
            play: () => this.playProceduralSound('fireExtinguish'),
            config: {
                frequency: 300,
                duration: 1.0,
                type: 'extinguish',
                volume: this.sfxVolume * 0.8
            }
        });
    }
    
    createUIASounds() {
        // Menu select
        this.sounds.set('menuSelect', {
            play: () => this.playProceduralSound('menuSelect'),
            config: {
                frequency: 800,
                duration: 0.1,
                type: 'beep',
                volume: this.sfxVolume * 0.6
            }
        });
        
        // Game over
        this.sounds.set('gameOver', {
            play: () => this.playProceduralSound('gameOver'),
            config: {
                frequency: 200,
                duration: 2.0,
                type: 'fanfare',
                volume: this.sfxVolume * 0.9
            }
        });
        
        // Score popup
        this.sounds.set('scorePopup', {
            play: () => this.playProceduralSound('scorePopup'),
            config: {
                frequency: 1000,
                duration: 0.3,
                type: 'chime',
                volume: this.sfxVolume * 0.5
            }
        });
    }
    
    createAmbientSounds() {
        // Festival ambience
        this.sounds.set('festivalAmbience', {
            play: () => this.playProceduralSound('festivalAmbience'),
            config: {
                frequency: 100,
                duration: 5.0,
                type: 'ambient',
                volume: this.sfxVolume * 0.2,
                loop: true
            }
        });
    }
    
    playProceduralSound(soundType) {
        if (!this.enabled) return;
        
        const soundConfig = this.sounds.get(soundType)?.config;
        if (!soundConfig) return;
        
        try {
            // Use Phaser's tone generation or create Web Audio sounds
            this.generateTone(soundConfig);
        } catch (error) {
            console.warn(`Failed to play sound ${soundType}:`, error);
        }
    }
    
    generateTone(config) {
        // Create Web Audio context sound if available
        if (this.scene.sound.context) {
            this.createWebAudioSound(config);
        } else {
            // Fallback to simpler method
            this.createSimpleBeep(config);
        }
    }
    
    createWebAudioSound(config) {
        const audioContext = this.scene.sound.context;
        const gainNode = audioContext.createGain();
        const oscillator = audioContext.createOscillator();
        
        // Set up oscillator based on sound type
        switch (config.type) {
            case 'noise':
                this.createNoiseSound(audioContext, gainNode, config);
                break;
            case 'splash':
                this.createSplashSound(audioContext, gainNode, config);
                break;
            case 'hiss':
                this.createHissSound(audioContext, gainNode, config);
                break;
            case 'crackle':
                this.createCrackleSound(audioContext, gainNode, config);
                break;
            case 'impact':
                this.createImpactSound(audioContext, gainNode, config);
                break;
            case 'extinguish':
                this.createExtinguishSound(audioContext, gainNode, config);
                break;
            case 'beep':
                this.createBeepSound(audioContext, gainNode, config);
                break;
            case 'fanfare':
                this.createFanfareSound(audioContext, gainNode, config);
                break;
            case 'chime':
                this.createChimeSound(audioContext, gainNode, config);
                break;
            case 'ambient':
                this.createAmbientSound(audioContext, gainNode, config);
                break;
            default:
                this.createSimpleOscillator(audioContext, gainNode, oscillator, config);
        }
    }
    
    createNoiseSound(audioContext, gainNode, config) {
        // Water spray noise
        const bufferSize = audioContext.sampleRate * config.duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        // Add filter for water sound
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        source.start();
        source.stop(audioContext.currentTime + config.duration);
    }
    
    createSplashSound(audioContext, gainNode, config) {
        // Multiple quick bursts for splash
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(
                    config.frequency + Math.random() * 200 - 100,
                    audioContext.currentTime
                );
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                gainNode.gain.setValueAtTime(config.volume * 0.5, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            }, i * 50);
        }
    }
    
    createHissSound(audioContext, gainNode, config) {
        // Steam hiss using filtered noise
        const bufferSize = audioContext.sampleRate * config.duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        source.start();
        source.stop(audioContext.currentTime + config.duration);
    }
    
    createCrackleSound(audioContext, gainNode, config) {
        // Random pops for fire crackling
        const numPops = 3 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numPops; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(
                    config.frequency + Math.random() * 300,
                    audioContext.currentTime
                );
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                gainNode.gain.setValueAtTime(config.volume * 0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
            }, Math.random() * config.duration * 1000);
        }
    }
    
    createImpactSound(audioContext, gainNode, config) {
        // Sharp impact sound
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            config.frequency * 0.1,
            audioContext.currentTime + config.duration
        );
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + config.duration);
    }
    
    createExtinguishSound(audioContext, gainNode, config) {
        // Satisfying extinguish sound with steam
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(
            config.frequency * 2,
            audioContext.currentTime + config.duration * 0.3
        );
        
        oscillator2.type = 'sawtooth';
        oscillator2.frequency.setValueAtTime(config.frequency * 0.5, audioContext.currentTime);
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(audioContext.currentTime + config.duration);
        oscillator2.stop(audioContext.currentTime + config.duration);
    }
    
    createBeepSound(audioContext, gainNode, config) {
        // Clean UI beep
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + config.duration);
    }
    
    createFanfareSound(audioContext, gainNode, config) {
        // Victory fanfare
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                gainNode.gain.setValueAtTime(config.volume * 0.7, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.4);
            }, index * 200);
        });
    }
    
    createChimeSound(audioContext, gainNode, config) {
        // Score chime
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            config.frequency * 1.5,
            audioContext.currentTime + config.duration
        );
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + config.duration);
    }
    
    createAmbientSound(audioContext, gainNode, config) {
        // Subtle festival atmosphere
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, audioContext.currentTime);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        
        oscillator.start();
        if (!config.loop) {
            oscillator.stop(audioContext.currentTime + config.duration);
        }
    }
    
    createSimpleOscillator(audioContext, gainNode, oscillator, config) {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + config.duration);
    }
    
    createSimpleBeep(config) {
        // Fallback method using HTML5 audio or silent operation
        console.log(`Playing ${config.type} sound (fallback mode)`);
    }
    
    // Public API methods
    playSpraySound() {
        this.sounds.get('waterSpray')?.play();
    }
    
    playFireHitSound() {
        this.sounds.get('fireHit')?.play();
        this.sounds.get('steamHiss')?.play();
    }
    
    playFireExtinguishSound() {
        this.sounds.get('fireExtinguish')?.play();
    }
    
    playFireCrackling() {
        this.sounds.get('fireCrackle')?.play();
    }
    
    playMenuSound() {
        this.sounds.get('menuSelect')?.play();
    }
    
    playGameOverSound() {
        this.sounds.get('gameOver')?.play();
    }
    
    playScorePopupSound() {
        this.sounds.get('scorePopup')?.play();
    }
    
    playWaterSplashSound() {
        this.sounds.get('waterSplash')?.play();
    }
    
    startAmbientSound() {
        if (this.enabled) {
            this.sounds.get('festivalAmbience')?.play();
        }
    }
    
    stopAmbientSound() {
        // Implementation for stopping looping sounds
    }
    
    setMasterVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.musicVolume = this.sfxVolume;
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleAudio() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    isEnabled() {
        return this.enabled;
    }
    
    destroy() {
        this.sounds.clear();
    }
} 