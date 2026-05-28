import { progressionState, checkGemsPhaseCompletion, checkBroochesPhaseCompletion, executeBorderTransformation } from './progressionController.js';
import { playSynthesizedSound, initializeAudio } from './animationController.js';
import { GEM_ASSETS, spawnParticleExplosion, resizeBackgroundCanvas, initializeCelebrationCanvas } from './assetController.js';
import { currentGameState, changeGameState, setInstructionText, showInstructionBubble, setSocketsInstructionText, GAME_STATES } from './stateManager.js';

let selectedDecorationType = null;
let selectedDecorationColor = null;
let hasClickedGemOnce = false;
let hasClickedBroochOnce = false;

export function toggleGemOverlay(show) {
    const overlay = document.getElementById('gem-overlay');
    if (show) {
        overlay.classList.add('active');
        document.getElementById('brooch-overlay').classList.remove('active');
    } else {
        overlay.classList.remove('active');
        document.querySelectorAll('.selection-gem-item').forEach(item => item.classList.remove('selected'));
    }
}

export function toggleBroochOverlay(show) {
    const overlay = document.getElementById('brooch-overlay');
    if (show) {
        overlay.classList.add('active');
        document.getElementById('gem-overlay').classList.remove('active');
    } else {
        overlay.classList.remove('active');
        document.querySelectorAll('.selection-brooch-item').forEach(item => item.classList.remove('selected'));
    }
}

function selectGemColor(color, element) {
    initializeAudio();
    playSynthesizedSound('click');

    document.querySelectorAll('.selection-gem-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');

    selectedDecorationType = 'gem';
    selectedDecorationColor = color;

    highlightEmptyGemSockets();
    if (!hasClickedGemOnce) {
        showInstructionBubble('sockets-instruction-bubble');
        hasClickedGemOnce = true;
    } else {
        showInstructionBubble('scroll-instruction-bubble');
    }
}

function selectBroochItem(element) {
    initializeAudio();
    playSynthesizedSound('click');

    document.querySelectorAll('.selection-brooch-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');

    selectedDecorationType = 'brooch';
    selectedDecorationColor = element.dataset.brooch;

    highlightEmptyBroochSockets();
    if (!hasClickedBroochOnce) {
        showInstructionBubble('brooch-sockets-instruction-bubble');
        hasClickedBroochOnce = true;
    } else {
        showInstructionBubble('scroll-instruction-bubble');
    }
}

function highlightEmptyGemSockets() {
    let emptySocketsExist = false;
    const gemSockets = ['tl', 'tr', 'bl', 'br'];

    gemSockets.forEach(id => {
        const socketElement = document.querySelector(`.socket.gem-${id}`);
        if (!progressionState.socketsState[id].filled) {
            socketElement.classList.add('active');
            emptySocketsExist = true;
        }
    });

    if (emptySocketsExist) {
        setInstructionText('Tap a glowing corner socket to place the gem');
    }
}

function highlightEmptyBroochSockets() {
    let emptySocketsExist = false;
    const broochSockets = ['bt', 'bb'];

    broochSockets.forEach(id => {
        const cssClass = id === 'bt' ? 'brooch-top' : 'brooch-bottom';
        const socketElement = document.querySelector(`.socket.${cssClass}`);
        if (!progressionState.socketsState[id].filled) {
            socketElement.classList.add('active');
            emptySocketsExist = true;
        }
    });

    if (emptySocketsExist) {
        setInstructionText('Tap a glowing handle socket to mount the brooch');
    }
}

export function clearSocketHighlights() {
    document.querySelectorAll('.socket').forEach(socket => {
        socket.classList.remove('active');
        socket.classList.remove('highlighted');
    });
}

export function activateContentSockets() {
    clearSocketHighlights();
}

function handleSocketClick(socketId, socketElement) {
    initializeAudio();

    if (currentGameState === GAME_STATES.CONTENT_CASTLE_PHASE && socketId === 'castle' && selectedDecorationType === 'castle') {
        placeCastleInSocket(socketElement);
    } else if (currentGameState === GAME_STATES.CONTENT_TEXT_PHASE && socketId === 'text' && selectedDecorationType === 'pen') {
        placeTextWithPen(socketElement);
    } else if (selectedDecorationType === 'gem' && ['tl', 'tr', 'bl', 'br'].includes(socketId)) {
        placeGemInSocket(socketId, socketElement);
    } else if (selectedDecorationType === 'brooch' && ['bt', 'bb'].includes(socketId)) {
        placeBroochInSocket(socketId, socketElement);
    } else {
        playSynthesizedSound('error');
    }
}

function getGemHexColor(color) {
    if (color === 'ruby') return '#e0115f';
    if (color === 'sapphire') return '#0f52ba';
    if (color === 'emerald') return '#50c878';
    if (color === 'purple') return '#8a2be2';
    return '#ffd700';
}

function placeGemInSocket(socketId, socketElement) {
    if (progressionState.socketsState[socketId].filled) {
        playSynthesizedSound('error');
        return;
    }

    progressionState.socketsState[socketId].filled = true;
    progressionState.socketsState[socketId].type = selectedDecorationColor;

    const placedItem = document.getElementById(`placed-${socketId}`);
    placedItem.style.backgroundImage = `url('${GEM_ASSETS[selectedDecorationColor]}')`;
    placedItem.style.transform = 'translate(-50%, -50%) scale(0)';
    placedItem.style.opacity = '0';
    placedItem.style.transition = 'none';

    const selectedElement = document.querySelector('.selection-gem-item.selected');
    if (selectedElement) {
        selectedElement.classList.add('placed-from-menu');
        selectedElement.classList.remove('selected');

        // Calculate flight offset from selection position to target socket position
        const gemRect = selectedElement.getBoundingClientRect();
        const socketRect = socketElement.getBoundingClientRect();

        const dx = socketRect.left - gemRect.left + (socketRect.width - gemRect.width) / 2;
        const dy = socketRect.top - gemRect.top + (socketRect.height - gemRect.height) / 2;

        // Flight translation: remains fully visible (opacity 1) during the flight
        selectedElement.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        selectedElement.style.transform = `translate(${dx}px, ${dy}px) rotate(360deg) scale(0.9)`;
        selectedElement.style.opacity = '1';
    }

    setTimeout(() => {
        // Instant hand-over: hide flying item instantly, make socket item appear with thud bounce
        if (selectedElement) {
            selectedElement.style.transition = 'none';
            selectedElement.style.opacity = '0';
        }

        placedItem.classList.add('placed');
        placedItem.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.5), opacity 0.1s ease';
        placedItem.style.transform = 'translate(-50%, -50%) scale(1)';
        placedItem.style.opacity = '1';

        playSynthesizedSound('snap');

        const rect = socketElement.getBoundingClientRect();
        const parentRect = socketElement.parentElement.getBoundingClientRect();
        const px = rect.left - parentRect.left + rect.width / 2;
        const py = rect.top - parentRect.top + rect.height / 2;

        spawnParticleExplosion(px, py, getGemHexColor(selectedDecorationColor));

        progressionState.placedGemsCount++;
        if (progressionState.placedGemsCount < 4) {
            showInstructionBubble('scroll-instruction-bubble');
        } else {
            showInstructionBubble(null);
        }
        checkGemsPhaseCompletion();
    }, 450); // Matches the 0.45s flight duration exactly

    clearSocketHighlights();
    socketElement.classList.add('locked');

    selectedDecorationType = null;
    selectedDecorationColor = null;
}

function placeTextWithPen(socketElement) {
    const socketId = 'text';
    if (progressionState.socketsState[socketId].filled) {
        playSynthesizedSound('error');
        return;
    }

    progressionState.socketsState[socketId].filled = true;
    progressionState.socketsState[socketId].type = socketId;

    selectedDecorationType = null;
    selectedDecorationColor = null;

    const interactiveQuill = document.getElementById('interactive-quill');
    if (interactiveQuill) {
        interactiveQuill.classList.add('used');
        interactiveQuill.classList.remove('selected');
    }

    const animatingPen = document.getElementById('animating-pen');
    animatingPen.classList.add('active');
    animatingPen.classList.add('writing');

    const placedItem = document.getElementById(`placed-${socketId}`);
    placedItem.style.backgroundImage = "url('assets/images/invite-text.webp')";
    placedItem.style.transform = 'translate(-50%, -50%) scale(1)';
    placedItem.style.opacity = '0';
    placedItem.style.transition = 'none';

    playSynthesizedSound('writing');

    setTimeout(() => {
        placedItem.classList.add('placed');
        placedItem.style.transition = 'opacity 1.2s ease';
        placedItem.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        animatingPen.classList.remove('active');
        animatingPen.classList.remove('writing');

        playSynthesizedSound('success');

        const rect = socketElement.getBoundingClientRect();
        const parentRect = socketElement.parentElement.getBoundingClientRect();
        const px = rect.left - parentRect.left + rect.width / 2;
        const py = rect.top - parentRect.top + rect.height / 2;
        spawnParticleExplosion(px, py, '#ffd700');

        socketElement.classList.remove('active');
        socketElement.classList.add('locked');

        setTimeout(() => {
            changeGameState(GAME_STATES.CONTENT_CASTLE_PHASE);
        }, 300);
    }, 1600);
}

function placeCastleInSocket(socketElement) {
    const socketId = 'castle';
    if (progressionState.socketsState[socketId].filled) {
        playSynthesizedSound('error');
        return;
    }

    progressionState.socketsState[socketId].filled = true;
    progressionState.socketsState[socketId].type = socketId;

    selectedDecorationType = null;
    selectedDecorationColor = null;

    const interactiveCastle = document.getElementById('interactive-castle');
    if (interactiveCastle) {
        interactiveCastle.classList.add('used');
        interactiveCastle.classList.remove('selected');
    }

    const placedItem = document.getElementById(`placed-${socketId}`);
    placedItem.style.backgroundImage = "url('assets/images/castle.webp')";
    placedItem.style.transform = 'translate(-50%, -50%) scale(0)';
    placedItem.style.opacity = '0';
    placedItem.style.transition = 'none';

    setTimeout(() => {
        placedItem.classList.add('placed');
        placedItem.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.5), opacity 0.2s ease';
        placedItem.style.transform = 'translate(-50%, -50%) scale(1)';
        placedItem.style.opacity = '1';

        playSynthesizedSound('snap');

        const rect = socketElement.getBoundingClientRect();
        const parentRect = socketElement.parentElement.getBoundingClientRect();
        const px = rect.left - parentRect.left + rect.width / 2;
        const py = rect.top - parentRect.top + rect.height / 2;

        spawnParticleExplosion(px, py, '#ffd700');

        socketElement.classList.remove('active');
        socketElement.classList.add('locked');

        setTimeout(() => {
            changeGameState(GAME_STATES.BORDER_PHASE);
        }, 600);
    }, 50);
}

function placeBroochInSocket(socketId, socketElement) {
    if (progressionState.socketsState[socketId].filled) {
        playSynthesizedSound('error');
        return;
    }

    progressionState.socketsState[socketId].filled = true;
    progressionState.socketsState[socketId].type = selectedDecorationColor;

    const placedItem = document.getElementById(`placed-${socketId}`);
    const broochImg = selectedDecorationColor || 'brooch-1';
    placedItem.style.backgroundImage = `url('assets/images/${broochImg}.webp')`;
    placedItem.style.transform = 'translate(-50%, -50%) scale(0)';
    placedItem.style.opacity = '0';
    placedItem.style.transition = 'none';

    const selectedElement = document.querySelector('.selection-brooch-item.selected');
    if (selectedElement) {
        selectedElement.classList.add('placed-from-menu');
        selectedElement.classList.remove('selected');

        // Calculate flight offset from selection position to target socket position
        const broochRect = selectedElement.getBoundingClientRect();
        const socketRect = socketElement.getBoundingClientRect();

        const dx = socketRect.left - broochRect.left + (socketRect.width - broochRect.width) / 2;
        const dy = socketRect.top - broochRect.top + (socketRect.height - broochRect.height) / 2;

        // Flight translation: remains fully visible (opacity 1) during the flight
        selectedElement.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        selectedElement.style.transform = `translate(${dx}px, ${dy}px) rotate(360deg) scale(0.9)`;
        selectedElement.style.opacity = '1';
    }

    setTimeout(() => {
        // Instant hand-over: hide flying item instantly, make socket item appear with thud bounce
        if (selectedElement) {
            selectedElement.style.transition = 'none';
            selectedElement.style.opacity = '0';
        }

        placedItem.classList.add('placed');
        placedItem.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.5), opacity 0.1s ease';
        placedItem.style.transform = 'translate(-50%, -50%) scale(1)';
        placedItem.style.opacity = '1';

        playSynthesizedSound('snap');

        const rect = socketElement.getBoundingClientRect();
        const parentRect = socketElement.parentElement.getBoundingClientRect();
        const px = rect.left - parentRect.left + rect.width / 2;
        const py = rect.top - parentRect.top + rect.height / 2;

        spawnParticleExplosion(px, py, '#ffd700');

        progressionState.placedBroochesCount++;
        if (progressionState.placedBroochesCount < 2) {
            showInstructionBubble('scroll-instruction-bubble');
        } else {
            showInstructionBubble(null);
        }
        checkBroochesPhaseCompletion();
    }, 450); // Matches the 0.45s flight duration exactly

    clearSocketHighlights();
    socketElement.classList.add('locked');

    selectedDecorationType = null;
    selectedDecorationColor = null;
}

export function registerEventHandlers() {
    document.getElementById('start-game-btn').addEventListener('click', () => {
        initializeAudio();
        playSynthesizedSound('click');
        changeGameState('scroll_entry');
    });

    document.getElementById('btn-ruby').addEventListener('click', function () {
        initializeAudio();
        if (currentGameState !== 'ruby_phase') return;
        playSynthesizedSound('click');
        this.classList.add('greyed-out');
        toggleGemOverlay(true);
        clearSocketHighlights();
        highlightEmptyGemSockets();
        if (hasClickedGemOnce) {
            showInstructionBubble('scroll-instruction-bubble');
        } else {
            showInstructionBubble('select-gem-guide-bubble');
        }
    });

    document.getElementById('btn-brooch').addEventListener('click', function () {
        initializeAudio();
        if (currentGameState !== 'brooch_phase') return;
        playSynthesizedSound('click');
        this.classList.add('greyed-out');
        toggleBroochOverlay(true);
        clearSocketHighlights();
        highlightEmptyBroochSockets();
        if (hasClickedBroochOnce) {
            showInstructionBubble('scroll-instruction-bubble');
        } else {
            showInstructionBubble('select-brooch-guide-bubble');
        }
    });
    document.getElementById('interactive-quill').addEventListener('click', function () {
        initializeAudio();
        if (currentGameState !== 'content_text_phase') return;
        playSynthesizedSound('click');
        selectedDecorationType = 'pen';
        this.classList.add('selected');
        clearSocketHighlights();

        const textSocket = document.querySelector('.socket.content-text');
        if (textSocket) {
            textSocket.classList.add('active');
        }

        showInstructionBubble('pen-sockets-bubble');
    });

    document.getElementById('interactive-castle').addEventListener('click', function () {
        initializeAudio();
        if (currentGameState !== 'content_castle_phase') return;
        playSynthesizedSound('click');
        selectedDecorationType = 'castle';
        this.classList.add('selected');
        clearSocketHighlights();

        const castleSocket = document.querySelector('.socket.content-castle');
        if (castleSocket) {
            castleSocket.classList.add('active');
        }

        setInstructionText('Tap on the castle and tap on the glowing space to place it');
    });

    document.getElementById('btn-border').addEventListener('click', () => {
        if (currentGameState !== 'border_phase') return;
        executeBorderTransformation();
    });

    document.querySelectorAll('.selection-gem-item').forEach(item => {
        item.addEventListener('click', function () {
            selectGemColor(this.dataset.gem, this);
        });
    });

    document.querySelectorAll('.selection-brooch-item').forEach(item => {
        item.addEventListener('click', function () {
            selectBroochItem(this);
        });
    });

    document.querySelectorAll('.socket').forEach(socket => {
        socket.addEventListener('mouseenter', function () {
            if (this.classList.contains('active')) {
                playSynthesizedSound('hover');
                this.classList.add('highlighted');
            }
        });

        socket.addEventListener('mouseleave', function () {
            this.classList.remove('highlighted');
        });

        socket.addEventListener('click', function () {
            if (this.classList.contains('active')) {
                handleSocketClick(this.dataset.socket, this);
            }
        });
    });


    window.addEventListener('resize', () => {
        resizeBackgroundCanvas();
        if (currentGameState === 'celebration') {
            initializeCelebrationCanvas();
        }
    });
}
