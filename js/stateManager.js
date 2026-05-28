import { resizeBackgroundCanvas, initializeBackgroundParticles, animateBackgroundParticles, initializeCelebrationCanvas, animateCelebrationRain } from './assetController.js';
import { playSynthesizedSound, triggerCinematicSequence } from './animationController.js';
import { registerEventHandlers, toggleGemOverlay, toggleBroochOverlay, activateContentSockets } from './interactionSystem.js';

export const GAME_STATES = {
    START_SCREEN: 'start_screen',
    SCROLL_ENTRY: 'scroll_entry',
    RUBY_PHASE: 'ruby_phase',
    BROOCH_PHASE: 'brooch_phase',
    CONTENT_TEXT_PHASE: 'content_text_phase',
    CONTENT_CASTLE_PHASE: 'content_castle_phase',
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
        gameplayScreen.classList.remove('ruby-phase', 'brooch-phase', 'content-text-phase', 'content-castle-phase', 'border-phase');
        if (nextState === GAME_STATES.RUBY_PHASE) {
            gameplayScreen.classList.add('ruby-phase');
        } else if (nextState === GAME_STATES.BROOCH_PHASE) {
            gameplayScreen.classList.add('brooch-phase');
        } else if (nextState === GAME_STATES.CONTENT_TEXT_PHASE) {
            gameplayScreen.classList.add('content-text-phase');
        } else if (nextState === GAME_STATES.CONTENT_CASTLE_PHASE) {
            gameplayScreen.classList.add('content-castle-phase');
        } else if (nextState === GAME_STATES.BORDER_PHASE) {
            gameplayScreen.classList.add('border-phase');
        }
    }

    if (nextState === GAME_STATES.START_SCREEN) {
        document.body.classList.remove('game-started');
        document.body.classList.remove('game-ended');
        document.getElementById('start-screen').classList.add('active');
        document.getElementById('bg-canvas').style.display = 'block';
    }

    if (nextState === GAME_STATES.SCROLL_ENTRY) {
        document.body.classList.add('game-started');
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
        showInstructionBubble('gems-button-bubble');
    }

    if (nextState === GAME_STATES.BROOCH_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Select the royal brooch to cap the handles');
        toggleGemOverlay(false);
        updateActionButtons();
        showInstructionBubble('brooch-button-bubble');
    }

    if (nextState === GAME_STATES.CONTENT_TEXT_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Click the pen to start writing the invitation');
        toggleBroochOverlay(false);
        updateActionButtons();
        showInstructionBubble('pen-button-bubble');
    }

    if (nextState === GAME_STATES.CONTENT_CASTLE_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Click the castle model to start building');
        toggleBroochOverlay(false);
        updateActionButtons();
        showInstructionBubble('castle-sockets-bubble');
        activateContentSockets();
    }

    if (nextState === GAME_STATES.BORDER_PHASE) {
        document.getElementById('gameplay-screen').classList.add('active');
        setInstructionText('Tap the Frame Button to Finalize the Royal Border');
        toggleBroochOverlay(false);
        updateActionButtons();
        showInstructionBubble('scroll-instruction-bubble');
    }

    if (nextState === GAME_STATES.FINALE_CINEMATIC) {
        showInstructionBubble(null);
        triggerCinematicSequence();
    }

    if (nextState === GAME_STATES.CELEBRATION) {
        showInstructionBubble(null);
        document.body.classList.add('game-ended');
        document.getElementById('celebration-screen').classList.add('active');
        initializeCelebrationCanvas();
        animateCelebrationRain();
        playSynthesizedSound('result');

        setTimeout(() => {
            const charContainer = document.getElementById('celebration-character');
            if (charContainer) charContainer.classList.add('active');

            const textContainer = document.getElementById('celebration-text');
            if (textContainer) textContainer.classList.add('active');
        }, 300);
    }
}

export function showInstructionBubble(activeBubbleId) {
    const speechBubbleContainerIds = [
        'scroll-instruction-bubble',
        'gems-button-bubble',
        'select-gem-guide-bubble',
        'sockets-instruction-bubble',
        'brooch-button-bubble',
        'select-brooch-guide-bubble',
        'brooch-sockets-instruction-bubble',
        'pen-button-bubble',
        'pen-sockets-bubble',
        'castle-sockets-bubble'
    ];
    speechBubbleContainerIds.forEach(bubbleId => {
        const bubbleContainerElement = document.getElementById(bubbleId);
        if (bubbleContainerElement) {
            const shouldBeActive = bubbleId === activeBubbleId;
            if (shouldBeActive) {
                bubbleContainerElement.classList.add('active');
            } else {
                bubbleContainerElement.classList.remove('active');
            }
        }
    });
}

export function setSocketsInstructionText(text) {
    const socketsBubbleTextElement = document.getElementById('sockets-bubble-text');
    if (!socketsBubbleTextElement) return;
    socketsBubbleTextElement.style.opacity = 0;
    setTimeout(() => {
        socketsBubbleTextElement.textContent = text;
        socketsBubbleTextElement.style.opacity = 1;
    }, 250);
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
    const btnBrooch = document.getElementById('btn-brooch');
    const btnBorder = document.getElementById('btn-border');

    btnRuby.classList.add('disabled');
    btnBrooch.classList.add('disabled');
    btnBorder.classList.add('disabled');

    btnRuby.classList.remove('greyed-out');
    btnBrooch.classList.remove('greyed-out');
    btnBorder.classList.remove('greyed-out');

    if (currentGameState === GAME_STATES.RUBY_PHASE) {
        btnRuby.classList.remove('disabled');
    } else if (currentGameState === GAME_STATES.BROOCH_PHASE) {
        btnBrooch.classList.remove('disabled');
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
