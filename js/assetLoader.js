const IMAGES = [
    'assets/images/logo.webp',
    'assets/images/main-bg.webp',
    'assets/images/game-bg.webp',
    'assets/images/title.webp',
    'assets/images/start-btn.webp',
    'assets/images/invite-template-1.webp',
    'assets/images/invite-template-2.webp',
    'assets/images/ruby-btn.webp',
    'assets/images/brooch-btn.webp',
    'assets/images/frame-btn.webp',
    'assets/images/ruby.webp',
    'assets/images/saphire.webp',
    'assets/images/emerald.webp',
    'assets/images/purple.webp',
    'assets/images/brooch-1.webp',
    'assets/images/brooch-2.webp',
    'assets/images/pen.webp',
    'assets/images/castle.webp',
    'assets/images/invite-text.webp',
    'assets/images/result-text.webp'
];

const SOUNDS = {
    bgMusic: 'assets/sounds/bg-music.mp3',
    click: 'assets/sounds/click.mp3',
    placing: 'assets/sounds/placing.mp3',
    writing: 'assets/sounds/writing.mp3',
    result: 'assets/sounds/result.mp3'
};

export const preloadedAudio = {};
export const preloadedImages = {};

export function preloadAll(onProgress, onComplete) {
    const totalAssets = IMAGES.length + Object.keys(SOUNDS).length;
    let loadedCount = 0;
    let hasCompleted = false;

    const checkComplete = () => {
        if (hasCompleted) return;
        const progress = Math.min(Math.round((loadedCount / totalAssets) * 100), 100);
        if (onProgress) {
            onProgress(progress);
        }
        if (loadedCount >= totalAssets) {
            hasCompleted = true;
            if (onComplete) {
                onComplete();
            }
        }
    };

    const registerAssetLoaded = () => {
        loadedCount++;
        checkComplete();
    };

    // 1. Preload Images
    IMAGES.forEach(src => {
        const img = new Image();
        img.onload = registerAssetLoaded;
        img.onerror = () => {
            console.warn(`Failed to preload image: ${src}`);
            registerAssetLoaded(); // Count as loaded to prevent blocking the game
        };
        img.src = src;
        preloadedImages[src] = img;
    });

    // 2. Preload Audio
    Object.entries(SOUNDS).forEach(([key, src]) => {
        const audio = new Audio();
        let audioLoaded = false;

        const onAudioLoad = () => {
            if (audioLoaded) return;
            audioLoaded = true;
            registerAssetLoaded();
        };

        // Standard HTML5 Audio events for preloading
        audio.addEventListener('canplaythrough', onAudioLoad, { once: true });
        audio.addEventListener('loadedmetadata', onAudioLoad, { once: true });
        
        // Fallback for strict mobile browsers that block media loading until user interaction
        setTimeout(() => {
            if (!audioLoaded) {
                onAudioLoad();
            }
        }, 1500);

        audio.src = src;
        audio.preload = 'auto';
        audio.load();
        preloadedAudio[key] = audio;
    });
}
