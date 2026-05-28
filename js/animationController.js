import { changeGameState } from './stateManager.js';
import { spawnParticleExplosion } from './assetController.js';

let bgMusic = null;

export function initializeAudio() {
    if (!bgMusic) {
        bgMusic = new Audio('assets/sounds/bg-music.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.04; // Very subtle
        bgMusic.play().catch(err => {
            console.warn("Background music play deferred:", err);
            bgMusic = null; // Try again on next click/touch
        });
    }
}

if (typeof window !== 'undefined') {
    const triggerMusic = () => {
        initializeAudio();
        window.removeEventListener('click', triggerMusic);
        window.removeEventListener('touchstart', triggerMusic);
    };
    window.addEventListener('click', triggerMusic);
    window.addEventListener('touchstart', triggerMusic);
}

export function playSynthesizedSound(soundType) {
    if (soundType === 'click') {
        const clickSound = new Audio('assets/sounds/click.mp3');
        clickSound.volume = 0.35; // Audible click sound
        clickSound.play().catch(err => {
            console.warn("Click sound play failed:", err);
        });
    } else if (soundType === 'snap' || soundType === 'success') {
        const placingSound = new Audio('assets/sounds/placing.mp3');
        placingSound.volume = 0.5; // Audible placing sound
        placingSound.play().catch(err => {
            console.warn("Placing sound play failed:", err);
        });
    } else if (soundType === 'writing') {
        const writingSound = new Audio('assets/sounds/writing.mp3');
        writingSound.volume = 0.9; // Audible writing sound
        writingSound.play().catch(err => {
            console.warn("Writing sound play failed:", err);
        });
    } else if (soundType === 'result') {
        if (bgMusic) {
            bgMusic.pause();
        }
        const resultSound = new Audio('assets/sounds/result.mp3');
        resultSound.volume = 0.2; // Reduced sound volume as requested
        resultSound.play().catch(err => {
            console.warn("Result sound play failed:", err);
        });
    }
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
            cinematicVideo.muted = true;

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
