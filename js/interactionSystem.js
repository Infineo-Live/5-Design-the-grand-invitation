import { progressionState, checkGemsPhaseCompletion, checkCrownsPhaseCompletion, executeBorderTransformation } from './progressionController.js';
import { playSynthesizedSound, initializeAudio } from './animationController.js';
import { GEM_ASSETS, spawnParticleExplosion, resizeBackgroundCanvas, initializeCelebrationCanvas } from './assetController.js';
import { currentGameState, changeGameState, setInstructionText, showInstructionBubble, setSocketsInstructionText } from './stateManager.js';

let selectedDecorationType = null;
let selectedDecorationColor = null;
let hasClickedGemOnce = false;
let hasClickedCrownOnce = false;

export function toggleGemOverlay(show) {
    const overlay = document.getElementById('gem-overlay');
    if (show) {
        overlay.classList.add('active');
        document.getElementById('crown-overlay').classList.remove('active');
    } else {
        overlay.classList.remove('active');
        document.querySelectorAll('.selection-gem-item').forEach(item => item.classList.remove('selected'));
    }
}

export function toggleCrownOverlay(show) {
    const overlay = document.getElementById('crown-overlay');
    if (show) {
        overlay.classList.add('active');
        document.getElementById('gem-overlay').classList.remove('active');
    } else {
        overlay.classList.remove('active');
        document.querySelectorAll('.selection-crown-item').forEach(item => item.classList.remove('selected'));
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
    hasClickedGemOnce = true;
    showInstructionBubble('sockets-instruction-bubble');
}

function selectCrownItem(element) {
    initializeAudio();
    playSynthesizedSound('click');
    
    document.querySelectorAll('.selection-crown-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    
    selectedDecorationType = 'crown';
    selectedDecorationColor = element.dataset.crown;
    
    highlightEmptyCrownSockets();
    hasClickedCrownOnce = true;
    showInstructionBubble('crown-sockets-instruction-bubble');
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

function highlightEmptyCrownSockets() {
    let emptySocketsExist = false;
    const crownSockets = ['ct', 'cb'];
    
    crownSockets.forEach(id => {
        const cssClass = id === 'ct' ? 'crown-top' : 'crown-bottom';
        const socketElement = document.querySelector(`.socket.${cssClass}`);
        if (!progressionState.socketsState[id].filled) {
            socketElement.classList.add('active');
            emptySocketsExist = true;
        }
    });
    
    if (emptySocketsExist) {
        setInstructionText('Tap a glowing handle socket to mount the crown');
    }
}

export function clearSocketHighlights() {
    document.querySelectorAll('.socket').forEach(socket => {
        socket.classList.remove('active');
        socket.classList.remove('highlighted');
    });
}

function handleSocketClick(socketId, socketElement) {
    initializeAudio();
    
    if (selectedDecorationType === 'gem' && ['tl', 'tr', 'bl', 'br'].includes(socketId)) {
        placeGemInSocket(socketId, socketElement);
    } else if (selectedDecorationType === 'crown' && ['ct', 'cb'].includes(socketId)) {
        placeCrownInSocket(socketId, socketElement);
    } else {
        playSynthesizedSound('error');
    }
}

function getGemHexColor(color) {
    if (color === 'ruby') return '#e0115f';
    if (color === 'sapphire') return '#0f52ba';
    if (color === 'emerald') return '#50c878';
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

function placeCrownInSocket(socketId, socketElement) {
    if (progressionState.socketsState[socketId].filled) {
        playSynthesizedSound('error');
        return;
    }
    
    progressionState.socketsState[socketId].filled = true;
    progressionState.socketsState[socketId].type = selectedDecorationColor;
    
    const placedItem = document.getElementById(`placed-${socketId}`);
    const crownImg = selectedDecorationColor || 'crown-1';
    placedItem.style.backgroundImage = `url('assets/images/${crownImg}.png')`;
    placedItem.style.transform = 'translate(-50%, -50%) scale(0)';
    placedItem.style.opacity = '0';
    placedItem.style.transition = 'none';
    
    const selectedElement = document.querySelector('.selection-crown-item.selected');
    if (selectedElement) {
        selectedElement.classList.add('placed-from-menu');
        selectedElement.classList.remove('selected');
        
        // Calculate flight offset from selection position to target socket position
        const crownRect = selectedElement.getBoundingClientRect();
        const socketRect = socketElement.getBoundingClientRect();
        
        const dx = socketRect.left - crownRect.left + (socketRect.width - crownRect.width) / 2;
        const dy = socketRect.top - crownRect.top + (socketRect.height - crownRect.height) / 2;
        
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
        
        progressionState.placedCrownsCount++;
        if (progressionState.placedCrownsCount < 2) {
            showInstructionBubble('scroll-instruction-bubble');
        } else {
            showInstructionBubble(null);
        }
        checkCrownsPhaseCompletion();
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
    
    document.getElementById('btn-ruby').addEventListener('click', function() {
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
    
    document.getElementById('btn-crown').addEventListener('click', function() {
        initializeAudio();
        if (currentGameState !== 'crown_phase') return;
        playSynthesizedSound('click');
        this.classList.add('greyed-out');
        toggleCrownOverlay(true);
        clearSocketHighlights();
        highlightEmptyCrownSockets();
        if (hasClickedCrownOnce) {
            showInstructionBubble('scroll-instruction-bubble');
        } else {
            showInstructionBubble('select-crown-guide-bubble');
        }
    });
    
    document.getElementById('btn-border').addEventListener('click', () => {
        if (currentGameState !== 'border_phase') return;
        executeBorderTransformation();
    });
    
    document.querySelectorAll('.selection-gem-item').forEach(item => {
        item.addEventListener('click', function() {
            selectGemColor(this.dataset.gem, this);
        });
    });
    
    document.querySelectorAll('.selection-crown-item').forEach(item => {
        item.addEventListener('click', function() {
            selectCrownItem(this);
        });
    });
    
    document.querySelectorAll('.socket').forEach(socket => {
        socket.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                playSynthesizedSound('hover');
                this.classList.add('highlighted');
            }
        });
        
        socket.addEventListener('mouseleave', function() {
            this.classList.remove('highlighted');
        });
        
        socket.addEventListener('click', function() {
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
