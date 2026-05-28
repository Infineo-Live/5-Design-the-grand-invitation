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
    
    const invitationCinematicFrames = [
        document.getElementById('vid-frame-1'),
        document.getElementById('vid-frame-2'),
        document.getElementById('vid-frame-3'),
        document.getElementById('vid-frame-4'),
        document.getElementById('vid-frame-5')
    ];
    
    invitationCinematicFrames.forEach((frameElement, currentFrameIndex) => {
        if (frameElement) {
            const isInitialFrame = currentFrameIndex === 0;
            if (isInitialFrame) {
                frameElement.classList.add('active');
            } else {
                frameElement.classList.remove('active');
            }
        }
    });

    gameplayScreenElement.style.transition = 'opacity 0.6s ease';
    gameplayScreenElement.style.opacity = 0;
    
    const screenFadeTransitionDelayMs = 600;
    const cinematicFrameDisplayDurationMs = 600;
    const finalCelebrationTransitionDelayMs = 1200;
    
    setTimeout(() => {
        gameplayScreenElement.classList.remove('active');
        cinematicOverlayLayer.classList.add('active');
        
        let currentFrameIndex = 0;
        
        function showNextFrame() {
            if (currentFrameIndex < invitationCinematicFrames.length - 1) {
                setTimeout(() => {
                    if (invitationCinematicFrames[currentFrameIndex]) {
                        invitationCinematicFrames[currentFrameIndex].classList.remove('active');
                    }
                    currentFrameIndex++;
                    if (invitationCinematicFrames[currentFrameIndex]) {
                        invitationCinematicFrames[currentFrameIndex].classList.add('active');
                    }
                    showNextFrame();
                }, cinematicFrameDisplayDurationMs);
            } else {
                setTimeout(() => {
                    cinematicOverlayLayer.classList.remove('active');
                    invitationCinematicFrames.forEach(frameElement => {
                        if (frameElement) frameElement.classList.remove('active');
                    });
                    changeGameState('celebration');
                }, finalCelebrationTransitionDelayMs);
            }
        }
        
        showNextFrame();
    }, screenFadeTransitionDelayMs);
}
