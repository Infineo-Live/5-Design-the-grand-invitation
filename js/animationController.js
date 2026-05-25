import { changeGameState } from './stateManager.js';
import { spawnParticleExplosion } from './assetController.js';

let audioContext = null;

export function initializeAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

export function playSynthesizedSound(type) {
    if (!audioContext) return;
    
    const time = audioContext.currentTime;
    
    if (type === 'click') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(time);
        osc.stop(time + 0.1);
    }
    
    if (type === 'hover') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, time);
        osc.frequency.linearRampToValueAtTime(1200, time + 0.15);
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.linearRampToValueAtTime(0.001, time + 0.15);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(time);
        osc.stop(time + 0.15);
    }
    
    if (type === 'snap') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, time);
        osc.frequency.exponentialRampToValueAtTime(150, time + 0.2);
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, time);
        filter.frequency.exponentialRampToValueAtTime(300, time + 0.2);
        
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start(time);
        osc.stop(time + 0.25);
        
        playChimeHarmonics(time + 0.05);
    }
    
    if (type === 'error') {
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc1.frequency.setValueAtTime(130, time);
        osc2.frequency.setValueAtTime(125, time);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 0.25);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContext.destination);
        
        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + 0.25);
        osc2.stop(time + 0.25);
    }
    
    if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time + idx * 0.12);
            gain.gain.setValueAtTime(0.15, time + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.12 + 0.4);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(time + idx * 0.12);
            osc.stop(time + idx * 0.12 + 0.4);
        });
    }

    if (type === 'roll') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.linearRampToValueAtTime(320, time + 1.2);
        
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(5, time);
        filter.frequency.setValueAtTime(400, time);
        filter.frequency.linearRampToValueAtTime(1000, time + 1.2);
        
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 1.2);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start(time);
        osc.stop(time + 1.2);
    }

    if (type === 'rocket') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(1500, time + 1.0);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 1.2);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(time);
        osc.stop(time + 1.2);
    }
    
    if (type === 'fanfare') {
        const chords = [
            [261.63, 329.63, 392.00, 523.25],
            [329.63, 415.30, 493.88, 659.25],
            [349.23, 440.00, 523.25, 698.46],
            [392.00, 493.88, 587.33, 783.99]
        ];
        
        chords.forEach((chord, chordIdx) => {
            const chordTime = time + chordIdx * 0.55;
            chord.forEach(freq => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, chordTime);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(500, chordTime);
                filter.frequency.exponentialRampToValueAtTime(2500, chordTime + 0.3);
                
                gain.gain.setValueAtTime(0.08, chordTime);
                gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.5);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.start(chordTime);
                osc.stop(chordTime + 0.5);
            });
        });
    }
}

function playChimeHarmonics(startTime) {
    const frequencies = [1200, 1800, 2400];
    frequencies.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.03);
        gain.gain.setValueAtTime(0.1, startTime + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.03 + 0.25);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(startTime + idx * 0.03);
        osc.stop(startTime + idx * 0.03 + 0.25);
    });
}

export function triggerCinematicSequence() {
    const gameplayScreen = document.getElementById('gameplay-screen');
    const cinematicLayer = document.getElementById('cinematic-layer');
    const rollingScroll = document.getElementById('rolling-scroll');
    
    gameplayScreen.style.transition = 'opacity 0.6s ease';
    gameplayScreen.style.opacity = 0;
    
    setTimeout(() => {
        gameplayScreen.classList.remove('active');
        cinematicLayer.classList.add('active');
        rollingScroll.classList.add('active');
        
        setTimeout(() => {
            playSynthesizedSound('roll');
            rollingScroll.classList.add('rolled');
            
            setTimeout(() => {
                playSynthesizedSound('rocket');
                rollingScroll.classList.add('rocket');
                
                const cylinder = document.getElementById('cylinder-core');
                const interval = setInterval(() => {
                    const rect = cylinder.getBoundingClientRect();
                    const winRect = cinematicLayer.getBoundingClientRect();
                    const px = rect.left - winRect.left + rect.width / 2;
                    const py = rect.top - winRect.top + rect.height / 2;
                    if (py > -50 && py < window.innerHeight) {
                        spawnParticleExplosion(px, py, '#ffd700');
                    } else {
                        clearInterval(interval);
                    }
                }, 60);
                
                setTimeout(() => {
                    clearInterval(interval);
                    cinematicLayer.classList.remove('active');
                    rollingScroll.classList.remove('active', 'rolled', 'rocket');
                    changeGameState('celebration');
                }, 1300);
            }, 1500);
        }, 1000);
    }, 600);
}
