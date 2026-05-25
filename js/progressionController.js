import { changeGameState, setInstructionText } from './stateManager.js';
import { playSynthesizedSound, initializeAudio } from './animationController.js';
import { spawnParticleExplosion, stopCelebrationRain } from './assetController.js';

export const progressionState = {
    placedGemsCount: 0,
    placedCrownsCount: 0,
    socketsState: {
        tl: { filled: false, type: null },
        tr: { filled: false, type: null },
        bl: { filled: false, type: null },
        br: { filled: false, type: null },
        ct: { filled: false, type: null },
        cb: { filled: false, type: null }
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
            changeGameState('border_phase');
        }, 600);
    } else {
        setInstructionText('Select and mount the final crown');
    }
}

export function executeBorderTransformation() {
    initializeAudio();
    playSynthesizedSound('success');
    
    document.getElementById('btn-border').classList.add('disabled');
    
    document.querySelectorAll('.placed-item').forEach(item => {
        item.classList.add('fading');
    });
    
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

export function resetEntireGame() {
    initializeAudio();
    playSynthesizedSound('click');
    
    stopCelebrationRain();
    
    progressionState.placedGemsCount = 0;
    progressionState.placedCrownsCount = 0;
    
    Object.keys(progressionState.socketsState).forEach(key => {
        progressionState.socketsState[key].filled = false;
        progressionState.socketsState[key].type = null;
    });
    
    document.querySelectorAll('.placed-item').forEach(item => {
        item.classList.remove('placed', 'fading');
        item.style.backgroundImage = 'none';
    });
    
    document.querySelectorAll('.socket').forEach(socket => {
        socket.classList.remove('active', 'highlighted', 'locked');
    });
    
    document.getElementById('scroll-parchment').src = 'assets/images/invite-template-1.png';
    document.getElementById('gameplay-screen').style.opacity = 1;
    document.getElementById('celebration-character').classList.remove('active');
    document.getElementById('celebration-text').classList.remove('active');
    
    document.getElementById('gem-overlay').classList.remove('active');
    document.getElementById('crown-overlay').classList.remove('active');
    
    document.querySelectorAll('.selection-gem-item, .selection-crown-item').forEach(item => {
        item.classList.remove('placed-from-menu', 'selected');
        item.style.transform = '';
        item.style.transition = '';
        item.style.opacity = '';
    });
    
    changeGameState('start_screen');
}
