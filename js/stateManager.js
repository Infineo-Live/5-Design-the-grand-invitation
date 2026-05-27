import { resizeBackgroundCanvas, initializeBackgroundParticles, animateBackgroundParticles, initializeCelebrationCanvas, animateCelebrationRain } from './assetController.js';
import { playSynthesizedSound, triggerCinematicSequence } from './animationController.js';
import { registerEventHandlers, toggleGemOverlay, toggleCrownOverlay } from './interactionSystem.js';

export const GAME_STATES = {
    START_SCREEN: 'start_screen',
    SCROLL_ENTRY: 'scroll_entry',
    RUBY_PHASE: 'ruby_phase',
    CROWN_PHASE: 'crown_phase',
    BORDER_PHASE: 'border_phase',
    FINALE_CINEMATIC: 'finale_cinematic',
    CELEBRATION: 'celebration'
};

export let currentGameState = GAME_STATES.START_SCREEN;

export function changeGameState(nextState) {
    currentGameState = nextState;
    
    document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
    
    const gameplayScreen = document.getElementById('gameplay-screen');
    if (gameplayScreen) {
        gameplayScreen.classList.remove('ruby-phase', 'crown-phase', 'border-phase');
        if (nextState === GAME_STATES.RUBY_PHASE) {
            gameplayScreen.classList.add('ruby-phase');
        } else if (nextState === GAME_STATES.CROWN_PHASE) {
            gameplayScreen.classList.add('crown-phase');
        } else if (nextState === GAME_STATES.BORDER_PHASE) {
            gameplayScreen.classList.add('border-phase');
        }
    }
    
    if (nextState === GAME_STATES.START_SCREEN) {
        document.getElementById('start-screen').classList.add('active');
        document.getElementById('bg-canvas').style.display = 'block';
    }
    
    if (nextState === GAME_STATES.SCROLL_ENTRY) {
        document.getElementById('gameplay-screen').classList.add('active');
        const scrollWrapper = document.getElementById('scroll-wrapper');
        scrollWrapper.style.transform = 'translateY(800px) scale(0.5)';
        
        setTimeout(() => {
            scrollWrapper.style.transform = 'translateY(0) scale(1)';
            playSynthesizedSound('success');
            setTimeout(() => {
                changeGameState(GAME_STATES.RUBY_PHASE);
            }, 1000);
        }, 100);
    }
    
    if (nextState === GAME_STATES.RUBY_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Choose a gem from the bottom shelf to place');
        updateActionButtons();
        const bubble = document.getElementById('scroll-instruction-bubble');
        if (bubble) bubble.classList.add('active');
    }
    
    if (nextState === GAME_STATES.CROWN_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Select the royal crown to cap the handles');
        toggleGemOverlay(false);
        updateActionButtons();
    }
    
    if (nextState === GAME_STATES.BORDER_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Press Assemble to finalize the border magic');
        toggleCrownOverlay(false);
        updateActionButtons();
    }
    
    if (nextState === GAME_STATES.FINALE_CINEMATIC) {
        const bubble = document.getElementById('scroll-instruction-bubble');
        if (bubble) bubble.classList.remove('active');
        triggerCinematicSequence();
    }
    
    if (nextState === GAME_STATES.CELEBRATION) {
        const bubble = document.getElementById('scroll-instruction-bubble');
        if (bubble) bubble.classList.remove('active');
        document.getElementById('celebration-screen').classList.add('active');
        initializeCelebrationCanvas();
        animateCelebrationRain();
        playSynthesizedSound('fanfare');
        
        setTimeout(() => {
            document.getElementById('celebration-character').classList.add('active');
            document.getElementById('celebration-text').classList.add('active');
        }, 300);
    }
}

export function setInstructionText(text) {
    const bubbleText = document.getElementById('bubble-text');
    if (!bubbleText) return;
    bubbleText.style.opacity = 0;
    setTimeout(() => {
        bubbleText.textContent = text;
        bubbleText.style.opacity = 1;
    }, 250);
}

function updateActionButtons() {
    const btnRuby = document.getElementById('btn-ruby');
    const btnCrown = document.getElementById('btn-crown');
    const btnBorder = document.getElementById('btn-border');
    
    btnRuby.classList.add('disabled');
    btnCrown.classList.add('disabled');
    btnBorder.classList.add('disabled');
    
    btnRuby.classList.remove('greyed-out');
    btnCrown.classList.remove('greyed-out');
    btnBorder.classList.remove('greyed-out');
    
    if (currentGameState === GAME_STATES.RUBY_PHASE) {
        btnRuby.classList.remove('disabled');
    } else if (currentGameState === GAME_STATES.CROWN_PHASE) {
        btnCrown.classList.remove('disabled');
    } else if (currentGameState === GAME_STATES.BORDER_PHASE) {
        btnBorder.classList.remove('disabled');
    }
}

function startApplication() {
    resizeBackgroundCanvas();
    initializeBackgroundParticles();
    animateBackgroundParticles();
    registerEventHandlers();
    changeGameState(GAME_STATES.START_SCREEN);
}

window.addEventListener('load', startApplication);
