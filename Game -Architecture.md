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
│   │     castle_interior_bg.png
│   │
│   ├── /ui
│   │     game_title.png
│   │     start_button.png
│   │     btn_ruby_placement.png
│   │     btn_crown_placement.png
│   │     btn_border_assemble.png
│   │
│   ├── /scrolls
│   │     base_parchment_scroll.png
│   │     transformed_premium_scroll.png
│   │
│   ├── /gems
│   │     ruby_red.png
│   │     ruby_blue.png
│   │     ruby_green.png
│   │
│   ├── /ornaments
│   │     golden_crown.png
│   │
│   ├── /video
│   │     scroll_rolling_finale.mp4
│   │
│   └── /celebration
│         celebration_laughing_kubera.png
│
├── /css
│     animations.css
│     layout.css
│     ui.css
│
└── /js
      stateManager.js
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
const GAME_STATE = {
    START_SCREEN: 'start_screen',
    SCROLL_ENTRY: 'scroll_entry',
    RUBY_PHASE: 'ruby_phase',
    CROWN_PHASE: 'crown_phase',
    BORDER_PHASE: 'border_phase',
    LOGO_PHASE: 'logo_phase',
    HEADER_PHASE: 'header_phase',
    MIDDLE_PHASE: 'middle_phase',
    FINALE_VIDEO: 'finale_video',
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
castle_interior_bg.png
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
base_parchment_scroll.png
transformed_premium_scroll.png
```

### Behavior

#### Initial State

Render:

```txt
base_parchment_scroll.png
```

#### Border Completion

Swap to:

```txt
transformed_premium_scroll.png
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
ruby_red.png
ruby_blue.png
ruby_green.png
golden_crown.png
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
game_title.png
start_button.png
btn_ruby_placement.png
btn_crown_placement.png
btn_border_assemble.png
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
scroll_rolling_finale.mp4
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
celebration_laughing_kubera.png
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
castle_interior_bg.png
game_title.png
start_button.png
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
base_parchment_scroll.png
```

## Systems Activated

- ruby button
- crown button

## Gameplay Goal

Introduce workspace.

---

# Phase 2 — Ruby Placement Loop

## Trigger

Player presses:

```txt
btn_ruby_placement.png
```

## Assets Spawned

```txt
ruby_red.png
ruby_blue.png
ruby_green.png
```

## Spawn Count

6 total rubies.

## Logic System

### Step 1

Rubies animate onto parchment.

### Step 2

Handle sockets glow.

### Step 3

Player selects ruby.

### Step 4

Player selects socket.

### Step 5

Ruby snaps into place.

### Step 6

Placement counter increases.

```js
placedRubies++;
```

### Step 7

When:

```js
placedRubies === 4
```

Execute:

- remove remaining rubies
- unlock crown phase

## Ruby Socket Map

```txt
Top Left
Top Right
Bottom Left
Bottom Right
```

---

# Phase 3 — Crown Placement Loop

## Trigger

Player presses:

```txt
btn_crown_placement.png
```

## Assets Spawned

```txt
golden_crown.png
```

## Spawn Count

2 crowns.

## Logic System

### Step 1

Crowns slide and rotate onto parchment.

### Step 2

Target areas glow.

### Step 3

Player selects crown.

### Step 4

Player selects handle target.

### Step 5

Crown snaps into place.

### Step 6

Increment:

```js
placedCrowns++;
```

### Step 7

When:

```js
placedCrowns === 2
```

Unlock border button.

---

# Phase 4 — Border Transformation

## Trigger

Player presses:

```txt
btn_border_assemble.png
```

## Main Event

Replace:

```txt
base_parchment_scroll.png
```

With:

```txt
transformed_premium_scroll.png
```

## Gameplay Effect

This is the major visual payoff moment.

The invitation transforms into its final royal version.

---

# STAGE 3 — FINAL CINEMATIC

## Asset

```txt
scroll_rolling_finale.mp4
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
celebration_laughing_kubera.png
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

The game avoids:

- real 3D rendering
- physics simulation
- dynamic mesh generation
- runtime lighting
- particle engines

Everything is:

- pre-rendered
- state-controlled
- lightweight
- mobile-friendly

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

