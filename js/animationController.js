import { changeGameState } from './stateManager.js';
import { spawnParticleExplosion } from './assetController.js';
import { preloadedAudio } from './assetLoader.js';

export function initializeAudio() {
    const bgMusic = preloadedAudio.bgMusic;
    if (bgMusic && bgMusic.paused) {
        bgMusic.loop = true;
        bgMusic.volume = 0.03; // Very subtle
        bgMusic.play().catch(err => {
            console.warn("Background music play deferred:", err);
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
    let audio = null;
    let volume = 1.0;

    if (soundType === 'click') {
        audio = preloadedAudio.click;
        volume = 0.35;
    } else if (soundType === 'snap' || soundType === 'success') {
        audio = preloadedAudio.placing;
        volume = 0.5;
    } else if (soundType === 'writing') {
        audio = preloadedAudio.writing;
        volume = 0.9;
    } else if (soundType === 'result') {
        const bgMusic = preloadedAudio.bgMusic;
        if (bgMusic) {
            bgMusic.pause();
        }
        audio = preloadedAudio.result;
        volume = 0.2;

        if (audio) {
            audio.addEventListener('ended', () => {
                if (bgMusic) {
                    bgMusic.play().catch(err => {
                        console.warn("Failed to resume background music after result sound:", err);
                    });
                }
            }, { once: true });
        }
    }

    if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.warn(`${soundType} sound play failed:`, err);
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
