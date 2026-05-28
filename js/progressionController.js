import { changeGameState, setInstructionText } from './stateManager.js';
import { playSynthesizedSound, initializeAudio } from './animationController.js';
import { spawnParticleExplosion } from './assetController.js';

export const progressionState = {
    placedGemsCount: 0,
    placedCrownsCount: 0,
    placedContentCount: 0,
    socketsState: {
        tl: { filled: false, type: null },
        tr: { filled: false, type: null },
        bl: { filled: false, type: null },
        br: { filled: false, type: null },
        ct: { filled: false, type: null },
        cb: { filled: false, type: null },
        castle: { filled: false, type: null },
        text: { filled: false, type: null }
    }
};

export function checkGemsPhaseCompletion() {
    if (progressionState.placedGemsCount === 4) {
        setTimeout(() => {
            playSynthesizedSound('success');
            changeGameState('crown_phase');
        }, 600);
    } else {
        setInstructionText('Choose another gem for the remaining corners');
    }
}

export function checkCrownsPhaseCompletion() {
    if (progressionState.placedCrownsCount === 2) {
        setTimeout(() => {
            playSynthesizedSound('success');
            changeGameState('content_phase');
        }, 600);
    } else {
        setInstructionText('Select and mount the final crown');
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
        
        setTimeout(() => {
            scrollParchment.src = 'assets/images/invite-template-2.png';
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


