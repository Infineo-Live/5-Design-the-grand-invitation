import { changeGameState, setInstructionText } from './stateManager.js';
import { playSynthesizedSound, initializeAudio } from './animationController.js';
import { spawnParticleExplosion } from './assetController.js';

export const progressionState = {
    placedGemsCount: 0,
    placedBroochesCount: 0,
    placedContentCount: 0,
    socketsState: {
        tl: { filled: false, type: null },
        tr: { filled: false, type: null },
        bl: { filled: false, type: null },
        br: { filled: false, type: null },
        bt: { filled: false, type: null },
        bb: { filled: false, type: null },
        castle: { filled: false, type: null },
        text: { filled: false, type: null }
    }
};

export function checkGemsPhaseCompletion() {
    if (progressionState.placedGemsCount === 4) {
        setTimeout(() => {
            playSynthesizedSound('success');
            changeGameState('brooch_phase');
        }, 600);
    } else {
        setInstructionText('Choose another gem from the remaining ones');
    }
}

export function checkBroochesPhaseCompletion() {
    if (progressionState.placedBroochesCount === 2) {
        setTimeout(() => {
            playSynthesizedSound('success');
            changeGameState('content_phase');
        }, 600);
    } else {
        setInstructionText('Select and mount the final brooch');
    }
}

export function checkContentPhaseCompletion() {
    if (progressionState.placedContentCount === 2) {
        setTimeout(() => {
            playSynthesizedSound('success');
            changeGameState('border_phase');
        }, 600);
    } else {
        if (!progressionState.socketsState.castle.filled && !progressionState.socketsState.text.filled) {
            setInstructionText('Tap the parchment areas to add the castle and text');
        } else if (!progressionState.socketsState.castle.filled) {
            setInstructionText('Tap the bottom scroll area to build the castle');
        } else {
            setInstructionText('Tap the top scroll area to write the invitation');
        }
    }
}

export function executeBorderTransformation() {
    initializeAudio();
    playSynthesizedSound('success');

    document.getElementById('btn-border').classList.add('disabled');

    setTimeout(() => {
        const scrollParchment = document.getElementById('scroll-parchment');
        scrollParchment.style.opacity = 0;

        const placedCastle = document.getElementById('placed-castle');
        const placedText = document.getElementById('placed-text');
        if (placedCastle) {
            placedCastle.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            placedCastle.style.transform = 'translate(-50%, -50%) scale(0)';
            placedCastle.style.opacity = 0;
        }
        if (placedText) {
            placedText.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            placedText.style.transform = 'translate(-50%, -50%) scale(0)';
            placedText.style.opacity = 0;
        }

        setTimeout(() => {
            scrollParchment.src = 'assets/images/invite-template-2.webp';
            scrollParchment.style.opacity = 1;

            const rect = scrollParchment.getBoundingClientRect();
            const px = rect.width / 2;
            const py = rect.height / 2;
            spawnParticleExplosion(px, py - 100, '#ffd700');
            spawnParticleExplosion(px, py + 100, '#ffd700');

            setTimeout(() => {
                changeGameState('finale_cinematic');
            }, 1200);
        }, 400);
    }, 300);
}


