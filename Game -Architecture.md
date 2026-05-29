# Grand Invitation

## Complete Architecture Framework + Asset Mapping + Gameplay Logic Blueprint

---

# 1. Project Overview

## Game Type

A lightweight cinematic 2D interactive assembly game built using:

- HTML
- CSS
- Vanilla JavaScript

The experience simulates a premium 3D Pixar-style game entirely through:

- layered PNG assets
- cinematic transitions
- animation timing
- state-based progression
- controlled interaction loops

The entire game revolves around progressively assembling a royal invitation scroll belonging to Kubera.

---

# 2. Core Design Philosophy

The game is NOT skill-based.

The game is:

- tactile
- rewarding
- visually transformative
- guided
- cinematic

The player should always feel:

> “I am decorating and completing something magical.”

Even though internally the game operates as a lightweight state machine with guided placement logic.

---

# 3. Core Technical Architecture

## Rendering Method

The game uses:

- standard HTML structure
- CSS absolute positioning
- z-index layering
- JS state management
- CSS animations/transitions

No real 3D rendering exists.

The illusion of depth comes from:

- pre-rendered PNG lighting
- perspective baked into assets
- shadows baked into assets
- layered positioning
- movement easing
- scale animation

---

# 4. Master Folder Structure

```txt
/project-root
│
├── index.html
├── style.css
├── script.js
│
├── /assets
│   │
│   ├── /backgrounds
│   │     castle_interior_bg.webp
│   │
│   ├── /ui
│   │     game_title.webp
│   │     start_button.webp
│   │     btn_ruby_placement.webp
│   │     btn_brooch_placement.webp
│   │     btn_border_assemble.webp
│   │
│   ├── /scrolls
│   │     base_parchment_scroll.webp
│   │     transformed_premium_scroll.webp
│   │
│   ├── /gems
│   │     ruby_red.webp
│   │     ruby_blue.webp
│   │     ruby_green.webp
│   │
│   ├── /ornaments
│   │     golden_brooch.webp
│   │
│   ├── /video
│   │     scroll_rolling_finale.webm
│   │
│   └── /celebration
│         celebration_laughing_kubera.webp
│
├── /css
│     animations.css
│     layout.css
│     ui.css
│
└── /js
      stateManager.js
      assetLoader.js
      assetController.js
      interactionSystem.js
      animationController.js
      progressionController.js
```

---

# 5. Global Game State System

The game should operate through a centralized state manager.

## Master States

```js
export const GAME_STATES = {
    START_SCREEN: 'start_screen',
    RUBY_PHASE: 'ruby_phase',
    BROOCH_PHASE: 'brooch_phase',
    CONTENT_TEXT_PHASE: 'content_text_phase',
    CONTENT_CASTLE_PHASE: 'content_castle_phase',
    BORDER_PHASE: 'border_phase',
    FINALE_CINEMATIC: 'finale_cinematic',
    CELEBRATION: 'celebration'
};
```

---

# 6. Main Scene Layer Architecture

The game scene should be split into independent rendering layers.

---

## Layer 1: Environment Layer

### Purpose

Background immersion.

### Assets

```txt
castle_interior_bg.webp
```

### Behavior

- Static full-screen background
- No interaction
- Always rendered behind all elements

### z-index

```css
z-index: 1;
```

---

## Layer 2: Main Scroll Layer

### Purpose

Central gameplay canvas.

### Assets

```txt
base_parchment_scroll.webp
transformed_premium_scroll.webp
```

### Behavior

#### Initial State

Render:

```txt
base_parchment_scroll.webp
```

#### Border Completion

Swap to:

```txt
transformed_premium_scroll.webp
```

### Important Rule

This is NOT an overlay.

The entire scroll asset swaps completely.

This reduces:

- complexity
- layering bugs
- alignment problems
- performance overhead

### z-index

```css
z-index: 5;
```

---

## Layer 3: Interactive Object Layer

### Purpose

Handles all movable gameplay pieces.

### Assets

```txt
ruby_red.webp
ruby_blue.webp
ruby_green.webp
golden_brooch.webp
```

### Object Behavior

Every object supports:

- spawn animation
- idle floating
- slight rotation
- selection scaling
- snap placement
- placement locking

### Recommended CSS Animation Style

```css
transform:
    translateY()
    rotate()
    scale();
```

### Object States

```js
IDLE
SELECTED
PLACED
LOCKED
REMOVED
```

### z-index

```css
z-index: 8;
```

---

## Layer 4: UI Layer

### Purpose

Gameplay control system.

### Assets

```txt
game_title.webp
start_button.webp
btn_ruby_placement.webp
btn_brooch_placement.webp
btn_border_assemble.webp
```

### UI Principles

UI must:

- remain readable
- avoid overpowering the scroll
- visually support the gameplay
- remain secondary to the parchment

### z-index

```css
z-index: 15;
```

---

## Layer 5: Cinematic Layer

### Purpose

Final transition sequence.

### Asset

```txt
scroll_rolling_finale.webm
```

### Behavior

- Full-screen takeover
- Hides gameplay layers
- Plays automatically
- Transitions directly to result screen

### z-index

```css
z-index: 30;
```

---

## Layer 6: Celebration Layer

### Purpose

Reward screen.

### Asset

```txt
celebration_laughing_kubera.webp
```

### Behavior

- Full-screen display
- Coin rain effect via CSS/JS
- Star burst effect via CSS/JS
- Final celebratory payoff

### z-index

```css
z-index: 40;
```

---

# 7. Complete Gameplay Flow

---

# STAGE 1 — START SCREEN

## Active Assets

```txt
castle_interior_bg.webp
game_title.webp
start_button.webp
```

## Active Systems

- title rendering
- button interaction
- fade transition
- scroll entry animation

## Flow

### Step 1

Render castle background.

### Step 2

Render title.

### Step 3

Render start button.

### Step 4

Player taps start.

### Step 5

Execute:

- title fade out
- button fade out
- scroll slide-in animation

### Step 6

Transition game state:

```js
START_SCREEN → SCROLL_ENTRY
```

---

# STAGE 2 — MAIN GAMEPLAY LOOP

---

# Phase 1 — Base Scroll Initialization

## Active Asset

```txt
base_parchment_scroll.webp
```

## Systems Activated

- ruby button (`btn-ruby`)
- brooch button (`btn-brooch`)
- border button (`btn-border`)

## Gameplay Goal

Introduce workspace and guide player to decorate corners.

---

# Phase 2 — Ruby Placement Loop

## Trigger

Player presses:

```txt
btn_ruby_placement.webp (via GEMS shelf button)
```

## Assets Spawned

```txt
ruby.webp (Red Ruby)
saphire.webp (Blue Sapphire)
emerald.webp (Green Emerald)
purple.webp (Purple Amethyst)
```

## Spawn Count

4 selectable gems.

## Logic System

### Step 1

Gems drawer translates up onto screen shelf.

### Step 2

Scroll corner sockets (Top Left, Top Right, Bottom Left, Bottom Right) start glowing.

### Step 3

Player selects a gem from the shelf.

### Step 4

Player selects a glowing corner socket.

### Step 5

Selected gem flies from shelf to socket with rotating scale ease.

### Step 6

Upon impact, gem snaps, spawns gold dust particles, locks, and increments `placedGemsCount`.

### Step 7

When:

```js
placedGemsCount === 4
```

Execute:
- Fade out gems shelf menu
- Play success fanfare
- Automatically transition to Brooch Phase after 600ms

---

# Phase 3 — Brooch Placement Loop

## Trigger

Player presses:

```txt
btn_brooch_placement.webp (via BROOCH shelf button)
```

## Assets Spawned

```txt
brooch-1.webp
brooch-2.webp
```

## Spawn Count

2 selectable handle brooches.

## Logic System

### Step 1

Brooch drawer translates up onto screen shelf.

### Step 2

Scroll handle sockets start glowing.

### Step 3

Player selects a brooch from the shelf.

### Step 4

Player selects a glowing handle socket.

### Step 5

Selected brooch flies with rotation ease from shelf to socket.

### Step 6

Upon impact, brooch snaps, spawns gold dust, locks, and increments `placedBroochesCount`.

### Step 7

When:

```js
placedBroochesCount === 2
```

Execute:
- Fade out brooch shelf menu
- Play success fanfare
- Automatically transition to Content Text Phase after 600ms

---

# Phase 4 — Content Text Phase

## Trigger

Transitioned automatically from Brooch Phase.

## Assets Spawned

```txt
pen.webp (Floating Quill Pen)
```

## Logic System

### Step 1

Display speech bubble prompting player to click the Quill Pen.

### Step 2

Player clicks the Quill Pen.

### Step 3

Center-scroll socket starts glowing.

### Step 4

Player clicks the center-scroll socket.

### Step 5

Quill Pen stamps onto center scroll, plays writing sound effect, spawns gold particles, and renders `invite-text.webp` script overlay.

### Step 6

Automatically transition to Content Castle Phase after 600ms.

---

# Phase 5 — Content Castle Phase

## Trigger

Transitioned automatically from Content Text Phase.

## Assets Spawned

```txt
castle.webp (Floating Castle Model)
```

## Logic System

### Step 1

Display speech bubble prompting player to click the Castle Model.

### Step 2

Player clicks the Castle Model.

### Step 3

Top-center scroll socket starts glowing.

### Step 4

Player clicks the top-center scroll socket.

### Step 5

Castle Model stamps onto top-center, plays snap sound, spawns gold particles, and renders castle sigil overlay.

### Step 6

Automatically transition to Border Phase after 600ms.

---

# Phase 6 — Border Transformation

## Trigger

Transitioned automatically from Content Castle Phase.

## Systems Activated

- Border button (`btn-border` / Frame Button) enabled and glows.

## Logic System

### Step 1

Display speech bubble prompting player to click the Frame Button to finalize the border.

### Step 2

Player clicks the Frame Button (`btn-border`).

### Step 3

Frame Button disables. Base scroll elements and content fade out/shrink.

### Step 4

Scroll texture is swapped with `invite-template-2.webp` (fully completed royal invitation) with a double gold particle explosion.

### Step 5

Automatically transition to Finale Cinematic after 1.2 seconds.

---

# STAGE 3 — FINAL CINEMATIC

## Asset

```txt
scroll_rolling_finale.webm
```

## Flow

### Step 1

Fade out gameplay scene.

### Step 2

Reveal cinematic layer.

### Step 3

Play rolling video.

### Step 4

Video completes.

### Step 5

Transition to celebration.

---

# STAGE 4 — CELEBRATION RESULT SCREEN

## Asset

```txt
celebration_laughing_kubera.webp
```

## Systems

- coin rain
- star bursts
- ambient celebration animation

## Goal

Deliver emotional reward.

Children should feel:

> “I completed the royal invitation.”

---

# 8. Interaction System Architecture

## Core Pattern

All placements follow:

```txt
SELECT OBJECT
→
SELECT TARGET
→
SNAP INTO POSITION
→
LOCK
```

This creates:

- clarity
- predictability
- low frustration
- accessibility for children

---

# 9. Animation Architecture

## Animation Categories

### UI Animations

- fade in
- fade out
- slide in
- pulse

### Object Animations

- float
- rotate
- scale
- snap

### Scene Animations

- scroll entry
- cinematic transitions
- celebration reveal

---

# 10. Performance Architecture

## Why This Structure Is Efficient

The game avoids real 3D rendering, heavy runtime lighting calculations, and physics simulations, relying on pre-rendered assets. Furthermore, it incorporates advanced optimization strategies to guarantee responsive mobile playback:

### 1. Silent Background Asset Preloader
All 20+ decoration assets (WebP) and sound effects (MP3) are preloaded asynchronously into the browser's disk/memory cache using `assetLoader.js` immediately on window load. This prevents on-demand network delays, layout shifts, or graphic pop-in when swapping templates or placing decorations.

### 2. Audio Node Reuse
Rather than instantiating new `Audio` nodes on every click or placement action (which triggers garbage collection spikes and decoding latency), the audio subsystem preloads and stores singleton audio objects. Playback is triggered instantly by resetting `currentTime = 0` and calling `play()`.

### 3. GPU Offscreen Canvas Rendering
Dynamic rendering techniques like `shadowBlur` and complex radial gradients (used for floating glowing sparks and celebration gold coins) are CPU-bound and cause layout reflow/composite lag. We pre-render these assets onto hidden offscreen canvas buffers at startup, allowing the active animation frame loops to copy them via hardware-accelerated `drawImage` scaling at a locked 60 FPS.

### 4. Delayed Cinematic Loading
To prevent the heavy 6.28 MB cinematic video from blocking the preloading of critical gameplay textures, its `autoplay` attribute is omitted. It buffers quietly in the background and plays programmatically.

### 5. Conditional Dev-Environment Security
The debugger detector is bypassed locally (`localhost`, `127.0.0.1`, `file:`) to allow smooth framework profiling and debugging.

---

# 11. Core Illusion System

The premium feel comes from:

- asset quality
- timing
- animation easing
- visual layering
- transformation moments
- reward sequencing

Not technical complexity.

This is important.

The experience feels expensive while remaining technically lightweight.

That is the core architectural philosophy of Grand Invitation.

Humans call this “magic.”

Developers call it “carefully hiding the machinery behind pretty PNGs.”

