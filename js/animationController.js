import { changeGameState } from './stateManager.js';
import { spawnParticleExplosion } from './assetController.js';

let activeAudioContext = null;

export function initializeAudio() {
    return;
}

export function playSynthesizedSound(soundType) {
    return;
}

export function triggerCinematicSequence() {
    const gameplayScreenElement = document.getElementById('gameplay-screen');
    const cinematicOverlayLayer = document.getElementById('cinematic-layer');
    const cinematicVideo = document.getElementById('cinematic-video');
    
    gameplayScreenElement.style.transition = 'opacity 0.6s ease';
    gameplayScreenElement.style.opacity = 0;
    
    const screenFadeTransitionDelayMs = 600;
    
    setTimeout(() => {
        gameplayScreenElement.classList.remove('active');
        cinematicOverlayLayer.classList.add('active');
        
        if (cinematicVideo) {
            cinematicVideo.currentTime = 0;
            
            const handleVideoEnded = () => {
                cinematicOverlayLayer.classList.remove('active');
                changeGameState('celebration');
            };
            
            // Listen for the ended event
            cinematicVideo.addEventListener('ended', handleVideoEnded, { once: true });
            
            // Play video
            cinematicVideo.play().catch(err => {
                console.error("Video playback failed, transitioning directly:", err);
                // Fallback: transition directly to celebration if playback is blocked or fails
                handleVideoEnded();
            });
        } else {
            // Fallback: if video element doesn't exist
            cinematicOverlayLayer.classList.remove('active');
            changeGameState('celebration');
        }
    }, screenFadeTransitionDelayMs);
}
