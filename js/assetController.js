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

export function resizeBackgroundCanvas() {
    bgCanvasElement.width = window.innerWidth;
    bgCanvasElement.height = window.innerHeight;
}

export function initializeBackgroundParticles() {
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
    bgContext.fillStyle = 'rgba(212, 175, 55, 0.3)';
    
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
        
        bgContext.beginPath();
        bgContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        bgContext.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
        bgContext.shadowBlur = 8;
        bgContext.shadowColor = '#d4af37';
        bgContext.fill();
    });
    
    bgContext.shadowBlur = 0;
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
            
            const grad = rainContext.createRadialGradient(0, 0, 1, 0, 0, particle.size);
            grad.addColorStop(0, '#fff3a8');
            grad.addColorStop(0.4, '#ffd700');
            grad.addColorStop(0.8, '#d4af37');
            grad.addColorStop(1, '#8a6405');
            
            rainContext.beginPath();
            rainContext.arc(0, 0, particle.size, 0, Math.PI * 2);
            rainContext.fillStyle = grad;
            rainContext.shadowBlur = 4;
            rainContext.shadowColor = '#ffd700';
            rainContext.fill();
            
            rainContext.beginPath();
            rainContext.arc(0, 0, particle.size * 0.7, 0, Math.PI * 2);
            rainContext.strokeStyle = '#8a6405';
            rainContext.lineWidth = 1;
            rainContext.stroke();
            
            rainContext.restore();
            rainContext.shadowBlur = 0;
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
