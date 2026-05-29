export const GEM_ASSETS = {
    ruby: 'assets/images/ruby.webp',
    sapphire: 'assets/images/saphire.webp',
    emerald: 'assets/images/emerald.webp',
    purple: 'assets/images/purple.webp'
};

let backgroundParticles = [];
let celebrationParticles = [];
let bgCanvasId = 'bg-canvas';
let rainCanvasId = 'rain-canvas';
let bgCanvasElement = document.getElementById(bgCanvasId);
let rainCanvasElement = document.getElementById(rainCanvasId);
let bgContext = bgCanvasElement.getContext('2d');
let rainContext = rainCanvasElement.getContext('2d');
let bgAnimationId = null;
let rainAnimationId = null;

let glowCacheCanvas = null;
let coinCacheCanvas = null;

function initGlowCaches() {
    if (!glowCacheCanvas) {
        glowCacheCanvas = document.createElement('canvas');
        const size = 16;
        const padding = 16;
        glowCacheCanvas.width = (size + padding) * 2;
        glowCacheCanvas.height = (size + padding) * 2;
        const ctx = glowCacheCanvas.getContext('2d');
        const center = glowCacheCanvas.width / 2;
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#d4af37';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
        
        ctx.beginPath();
        ctx.arc(center, center, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (!coinCacheCanvas) {
        coinCacheCanvas = document.createElement('canvas');
        const size = 20;
        const padding = 6;
        coinCacheCanvas.width = (size + padding) * 2;
        coinCacheCanvas.height = (size + padding) * 2;
        const ctx = coinCacheCanvas.getContext('2d');
        const center = coinCacheCanvas.width / 2;
        
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffd700';
        
        const grad = ctx.createRadialGradient(center, center, 2, center, center, size);
        grad.addColorStop(0, '#fff3a8');
        grad.addColorStop(0.4, '#ffd700');
        grad.addColorStop(0.8, '#d4af37');
        grad.addColorStop(1, '#8a6405');
        
        ctx.beginPath();
        ctx.arc(center, center, size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(center, center, size * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = '#8a6405';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

export function resizeBackgroundCanvas() {
    bgCanvasElement.width = window.innerWidth;
    bgCanvasElement.height = window.innerHeight;
}

export function initializeBackgroundParticles() {
    initGlowCaches();
    backgroundParticles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
        backgroundParticles.push({
            x: Math.random() * bgCanvasElement.width,
            y: Math.random() * bgCanvasElement.height,
            size: Math.random() * 2.5 + 0.5,
            speedY: -(Math.random() * 0.5 + 0.2),
            speedX: (Math.random() * 0.4 - 0.2),
            opacity: Math.random() * 0.6 + 0.1
        });
    }
}

export function animateBackgroundParticles() {
    bgContext.clearRect(0, 0, bgCanvasElement.width, bgCanvasElement.height);
    
    backgroundParticles.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        
        if (particle.y < -10) {
            particle.y = bgCanvasElement.height + 10;
            particle.x = Math.random() * bgCanvasElement.width;
        }
        if (particle.x < -10 || particle.x > bgCanvasElement.width + 10) {
            particle.speedX = -particle.speedX;
        }
        
        const drawSize = particle.size * 6;
        bgContext.globalAlpha = particle.opacity;
        bgContext.drawImage(
            glowCacheCanvas,
            particle.x - drawSize / 2,
            particle.y - drawSize / 2,
            drawSize,
            drawSize
        );
    });
    
    bgContext.globalAlpha = 1.0;
    bgAnimationId = requestAnimationFrame(animateBackgroundParticles);
}

export function stopBackgroundParticles() {
    if (bgAnimationId) {
        cancelAnimationFrame(bgAnimationId);
    }
}

export function spawnParticleExplosion(x, y, color) {
    const count = 25;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        celebrationParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: Math.random() * 5 + 2,
            color: color,
            alpha: 1,
            decay: Math.random() * 0.03 + 0.015,
            type: 'spark'
        });
    }
}

export function initializeCelebrationCanvas() {
    initGlowCaches();
    rainCanvasElement.width = rainCanvasElement.parentElement.clientWidth;
    rainCanvasElement.height = rainCanvasElement.parentElement.clientHeight;
}

function spawnCelebrationRain() {
    const width = rainCanvasElement.width;
    const colors = ['#ffd700', '#d4af37', '#aa8410', '#e0115f', '#0f52ba', '#50c878', '#8a2be2'];
    
    if (Math.random() < 0.25) {
        celebrationParticles.push({
            x: Math.random() * width,
            y: -20,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 3 + 4,
            size: Math.random() * 12 + 6,
            color: '#ffd700',
            alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.1 - 0.05,
            type: 'coin'
        });
    }
    
    if (Math.random() < 0.2) {
        celebrationParticles.push({
            x: Math.random() * width,
            y: -20,
            vx: Math.random() * 3 - 1.5,
            vy: Math.random() * 2 + 2.5,
            size: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.15 - 0.075,
            type: 'star'
        });
    }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
}

export function animateCelebrationRain() {
    rainContext.clearRect(0, 0, rainCanvasElement.width, rainCanvasElement.height);
    
    spawnCelebrationRain();
    
    celebrationParticles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.type === 'spark') {
            particle.vy += 0.05;
            particle.alpha -= particle.decay;
            
            rainContext.beginPath();
            rainContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            rainContext.fillStyle = particle.color;
            rainContext.globalAlpha = particle.alpha;
            rainContext.fill();
            rainContext.globalAlpha = 1;
        }
        
        else if (particle.type === 'coin') {
            particle.rotation += particle.rotationSpeed;
            
            rainContext.save();
            rainContext.translate(particle.x, particle.y);
            rainContext.rotate(particle.rotation);
            rainContext.scale(Math.sin(particle.rotation * 2), 1);
            
            rainContext.drawImage(
                coinCacheCanvas,
                -particle.size * 1.3,
                -particle.size * 1.3,
                particle.size * 2.6,
                particle.size * 2.6
            );
            
            rainContext.restore();
        }
        
        else if (particle.type === 'star') {
            particle.rotation += particle.rotationSpeed;
            drawStar(
                rainContext, 
                particle.x, 
                particle.y, 
                4, 
                particle.size, 
                particle.size / 2, 
                particle.color, 
                particle.alpha
            );
        }
        
        if (particle.y > rainCanvasElement.height + 20 || particle.alpha <= 0) {
            celebrationParticles.splice(index, 1);
        }
    });
    
    rainAnimationId = requestAnimationFrame(animateCelebrationRain);
}

export function stopCelebrationRain() {
    if (rainAnimationId) {
        cancelAnimationFrame(rainAnimationId);
    }
    celebrationParticles = [];
    rainContext.clearRect(0, 0, rainCanvasElement.width, rainCanvasElement.height);
}
