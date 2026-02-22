# Ski Crazed PWA — Recreation Plan

## Overview

Recreate **Ski Crazed** (JAM Software, 1987) as a modern Progressive Web App using HTML5 Canvas, Web Audio API, and vanilla JavaScript/TypeScript. The game will faithfully reproduce the side-scrolling ski gameplay, retro Apple II aesthetic, sound effects, and full progression system — playable on desktop and mobile browsers, installable as a PWA.

---

## 1. Project Setup & Tooling

### Tech Stack
- **Language:** TypeScript
- **Rendering:** HTML5 Canvas 2D (no framework — keeps it lean and retro)
- **Audio:** Web Audio API + pre-generated retro sound effects
- **Build:** Vite (fast dev server, PWA plugin available)
- **PWA:** vite-plugin-pwa (service worker, manifest, offline support)
- **Testing:** Vitest for unit tests
- **No heavy game frameworks** — the game is simple enough that Canvas 2D is sufficient, and it keeps the retro feel authentic

### Project Structure
```
SkiCrazed/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── manifest.json
│   ├── icons/           # PWA icons (192x192, 512x512)
│   └── fonts/           # Retro pixel font (e.g., Press Start 2P)
├── src/
│   ├── main.ts          # Entry point, game bootstrap
│   ├── game/
│   │   ├── Game.ts      # Main game loop, state machine
│   │   ├── Skier.ts     # Player skier entity
│   │   ├── Slope.ts     # Slope model (hazards, terrain)
│   │   ├── SlopeData.ts # Definitions for all 15 slopes
│   │   ├── Physics.ts   # Movement, gravity, jumping, ice
│   │   ├── Collision.ts # Collision detection
│   │   └── SlopeEditor.ts # Custom slope creator
│   ├── rendering/
│   │   ├── Renderer.ts      # Canvas rendering engine
│   │   ├── SpriteSheet.ts   # Sprite atlas loader/drawer
│   │   ├── Sprites.ts       # Sprite definitions & pixel art data
│   │   ├── Background.ts    # Mountain/sky background layers
│   │   └── HUD.ts           # Performance bar, slope progress
│   ├── audio/
│   │   ├── AudioManager.ts  # Sound effect & music manager
│   │   └── SoundGen.ts      # Procedural retro sound generation
│   ├── input/
│   │   ├── InputManager.ts  # Keyboard + touch + gamepad
│   │   └── TouchControls.ts # Mobile touch overlay
│   ├── screens/
│   │   ├── TitleScreen.ts   # Title / main menu
│   │   ├── LessonScreen.ts  # Tutorial with "Jammer"
│   │   ├── SlopeSelect.ts   # Slope selection screen
│   │   ├── ResultScreen.ts  # Performance chart / results
│   │   └── EditorScreen.ts  # Slope editor UI
│   ├── data/
│   │   ├── Constants.ts     # Game constants
│   │   └── Storage.ts       # LocalStorage for saves/custom slopes
│   └── pwa/
│       └── sw.ts            # Service worker customization
├── assets/
│   ├── sprites/         # Source pixel art (PNG)
│   └── sounds/          # Sound effect source files
└── tests/
    └── *.test.ts
```

---

## 2. Game Engine & Core Loop

### Game State Machine
States: `TITLE` → `LESSON` → `SLOPE_SELECT` → `PLAYING` → `RESULT` → `SLOPE_SELECT` ...
Also: `EDITOR` (accessible from menu), `PRACTICE` (slalom practice)

### Game Loop
- Fixed timestep (60 FPS target) using `requestAnimationFrame` with delta accumulation
- Update → Render cycle
- Pause support (pressing Escape / tapping pause button)

### Camera / Scrolling
- **Side-scrolling view**: the slope scrolls horizontally from right to left as the skier moves downhill
- Camera follows the skier with the slope terrain scrolling beneath
- The slope is procedurally laid out as a series of terrain segments and hazard placements

---

## 3. Graphics & Visual Style

### Retro Apple II Aesthetic
- **Canvas resolution:** Render at a low internal resolution (e.g., 280×192, matching Apple II hi-res) then scale up to fill the screen with nearest-neighbor interpolation (`image-rendering: pixelated`)
- **Color palette:** Restrict to the Apple II 6-color hi-res palette:
  - Black (`#000000`)
  - White (`#FFFFFF`)
  - Green (`#14B81A`)
  - Purple/Magenta (`#C840E0`)
  - Orange (`#E06010`)
  - Blue (`#0078F0`)
- **Pixel art sprites:** All sprites drawn in this constrained palette using chunky pixels
- **CRT effect (optional toggle):** Subtle scanlines and slight color bleed for authenticity

### Sprites to Create
| Sprite | Frames | Description |
|--------|--------|-------------|
| Skier skiing | 2-3 | Side view, skiing downhill animation |
| Skier jumping | 2 | In-air pose |
| Skier back scratcher | 2 | Trick: skis behind back |
| Skier daffy | 2 | Trick: one ski forward, one back |
| Skier crash/fall | 3-4 | Tumbling/falling animation |
| Skier standing | 1 | Idle/stopped pose |
| Small mogul | 1 | Small bump on slope |
| Large mogul | 1 | Large bump on slope |
| Jump ramp (small) | 1 | Small jump |
| Jump ramp (large) | 1 | Large jump leading to ice |
| Ice patch | 1-2 | Glistening ice surface |
| Slalom flag (red) | 1 | Red gate flag |
| Slalom flag (blue) | 1 | Blue gate flag |
| Warning sign | 2-3 | Various hazard warnings |
| Trees | 2-3 | Background decoration variants |
| "Jammer" ski pro | 2-3 | Tutorial instructor character |

### Background
- **Sky:** Gradient or flat color at top
- **Mountains:** Parallax mountain silhouettes in background (using purple/blue palette tones)
- **Snow/slope:** White slope surface with terrain contour
- **Position indicator:** Black bar at bottom of screen with white dash showing progress

---

## 4. Gameplay Mechanics

### Skier Physics
- Constant downhill velocity (increases on steeper segments, varies by slope difficulty)
- Joystick/keyboard up/down controls skier's vertical position on the slope (to navigate around moguls)
- Gravity applies during jumps; velocity affected by jump type
- Ice patches cause uncontrollable sliding → crash unless avoided via tricks

### Obstacle Interactions

| Obstacle | Mechanic |
|----------|----------|
| **Small mogul** | Move joystick in correct direction (up or down based on mogul type) to pass safely; wrong input = fall |
| **Large mogul** | Same as small but requires more precise timing |
| **Small jump** | Automatic — minor air, no trick needed |
| **Large jump** | Launches skier into air; ice patch follows landing zone. Must perform trick (back scratcher or daffy) to extend airtime and clear the ice |
| **Ice patch** | If landed on, skier slides and crashes. Must be avoided via tricks or correct positioning |
| **Slalom flags (red)** | Must pass on correct side; joystick direction depends on flag color |
| **Slalom flags (blue)** | Must pass on correct side; opposite of red |
| **Warning signs** | Indicate upcoming hazards; become less reliable on harder slopes (may lie) |

### Tricks
- **Back Scratcher:** Press specific key/button while airborne — extends hang time
- **Daffy:** Press different key/button while airborne — also extends hang time
- Both tricks serve to clear ice patches after large jumps

### Controls Mapping
| Action | Keyboard | Touch | Gamepad |
|--------|----------|-------|---------|
| Navigate up | Arrow Up / W | Swipe/hold upper zone | D-pad Up |
| Navigate down | Arrow Down / S | Swipe/hold lower zone | D-pad Down |
| Trick 1 (Back Scratcher) | Z / Space | Button A | Button A |
| Trick 2 (Daffy) | X | Button B | Button B |
| Pause | Escape | Pause button | Start |
| Performance chart | Space (while paused) | Tap chart icon | Select |

---

## 5. Progression System

### Tournament Structure
- **Goal:** Qualify for the Kilimanjaro Annual International Skiing Tournament
- **15 slopes total:**
  - Slopes 1–12: Downhill courses (increasing difficulty)
  - Slopes 13–14: Slalom courses
  - Slope 15: "Ohh La La" — the ultimate final slope
- Each slope introduces more/harder hazards, faster speed, and less reliable warning signs

### Performance System
- **No numerical score** — performance measured by percentage on the Performance Chart
- **Green bar** = good performance → qualifies for next slope / tournament
- **Red bar** = poor performance → must retry or risk disqualification
- **Falling 15 times** on a single slope = automatic disqualification
- Performance calculated from:
  - Number of falls
  - Correct mogul/flag navigation
  - Tricks performed successfully
  - Completion time (secondary factor)

### Save System
- Progress saved to `localStorage`
- Custom slopes saved to `localStorage` (up to 10 slots, matching original)
- Export/import custom slopes as JSON (modern enhancement)

---

## 6. Sound Design

### Sound Generation Approach
- Use **Web Audio API** with oscillators to generate retro 8-bit sounds procedurally
- This matches the Apple II's simple beeper-style audio
- Fallback: pre-rendered audio files for browsers with limited Web Audio support

### Sound Effects
| Sound | Description | Generation |
|-------|-------------|------------|
| Skiing/swoosh | Continuous white noise modulated by speed | Filtered noise oscillator |
| Jump launch | Rising pitch beep | Ascending square wave |
| Landing | Short thud | Low-frequency burst |
| Trick execution | Quick ascending arpeggio | Square wave arpeggio |
| Crash/fall | Descending noise burst + thud | Noise + sine burst |
| Mogul pass (success) | Short positive blip | High square wave ping |
| Mogul pass (fail) | Buzz/error tone | Low sawtooth |
| Flag pass (success) | Chime | Triangle wave ding |
| Ice sliding | Scraping noise | Filtered noise |
| Menu select | Click/beep | Short square wave |
| Level complete | Victory fanfare (short) | Ascending arpeggio melody |
| Disqualification | Sad descending tone | Descending melody |
| Title music | Simple looping chiptune melody | Multi-oscillator sequence |

---

## 7. Screens & UI

### Title Screen
- Retro pixel art title "SKI CRAZED" in large text
- Mountain backdrop
- Menu options: Start Game, Lessons, Practice Slalom, Make a Slope, Options
- Animated skier sprite on the title

### Lessons Screen (Tutorial)
- "Jammer" the ski pro character teaches controls
- Step-by-step interactive tutorial:
  1. Basic movement (up/down)
  2. Passing moguls
  3. Jumping
  4. Performing tricks
  5. Slalom navigation
- Player practices each skill before proceeding

### Slope Selection Screen
- Shows list of 15 slopes with names and difficulty indicators
- Locked slopes shown grayed out
- Current performance status for completed slopes

### Results / Performance Chart Screen
- Bar chart showing performance percentage
- Green/red color coding
- Qualify/disqualify messaging
- Option to retry or proceed

### Slope Editor Screen
- Grid-based editor to place hazards on a custom slope
- Palette of elements: moguls (small/large), jumps, ice, flags, signs
- Save/load slots (up to 10)
- Test play from editor

---

## 8. PWA Features

### Manifest
```json
{
  "name": "Ski Crazed",
  "short_name": "SkiCrazed",
  "description": "A faithful PWA recreation of the classic 1987 Apple II ski game",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#000000",
  "theme_color": "#0078F0",
  "icons": [...]
}
```

### Offline Support
- Full game playable offline via service worker caching
- All assets cached on first load
- No server-side dependencies

### Installation
- Add to Home Screen prompt on mobile
- Installable on desktop (Chrome, Edge)
- Landscape orientation preferred

### Responsive Design
- Canvas scales to fill viewport while maintaining aspect ratio
- Touch controls appear on mobile/tablet
- Keyboard/gamepad controls on desktop

---

## 9. Implementation Phases

### Phase 1: Foundation
1. Initialize project with Vite + TypeScript
2. Set up HTML5 Canvas with retro resolution (280×192 scaled up)
3. Implement game loop with fixed timestep
4. Set up input manager (keyboard + touch + gamepad)
5. Create PWA manifest and service worker
6. Apply Apple II color palette and `image-rendering: pixelated`

### Phase 2: Core Gameplay
7. Create skier sprite and animation system
8. Implement side-scrolling slope terrain rendering
9. Build skier physics (movement, gravity, speed)
10. Implement obstacle system (moguls, jumps, ice, flags, signs)
11. Add collision detection and response (fall, pass, trick)
12. Implement trick system (back scratcher, daffy)
13. Build the HUD (slope progress bar, fall counter)

### Phase 3: Progression & Menus
14. Define all 15 slope layouts with escalating difficulty
15. Implement performance percentage calculation
16. Build the Performance Chart screen
17. Create title screen with menu system
18. Build slope selection screen with lock/unlock
19. Implement save/load with localStorage

### Phase 4: Tutorial & Editor
20. Build the Lessons screen with "Jammer" instructor
21. Implement interactive tutorial steps
22. Create the slope editor UI (grid, hazard palette, placement)
23. Implement editor save/load slots
24. Add Practice Slalom mode

### Phase 5: Sound & Polish
25. Implement Web Audio sound generation engine
26. Create all sound effects (skiing, jumps, crashes, etc.)
27. Add title screen music (chiptune loop)
28. Optional: CRT scanline shader overlay toggle
29. Add screen transitions and visual polish
30. Mobile touch control UI refinement

### Phase 6: PWA & Release
31. Finalize service worker and offline caching
32. Generate PWA icons at all required sizes
33. Test installability on iOS Safari, Android Chrome, Desktop
34. Performance optimization (target 60fps on mobile)
35. Cross-browser testing and bug fixes

---

## 10. Technical Notes

### Apple II Fidelity vs. Playability
- The internal 280×192 resolution faithfully matches the Apple II hi-res mode
- The 6-color palette constraint will be followed for all game graphics
- Sound will use simple waveforms (square, triangle, noise) matching the Apple II beeper
- However, we will add modern conveniences: smooth scaling, touch controls, save states, and the option to toggle CRT effects

### Performance Considerations
- Canvas 2D is sufficient for this complexity level (no WebGL needed)
- Sprite batching for terrain elements that repeat
- Object pooling for hazards to minimize garbage collection
- OffscreenCanvas for background pre-rendering if needed

### Mobile Considerations
- Touch zones clearly indicated with semi-transparent overlays
- Haptic feedback on crashes (if supported via Vibration API)
- Prevent default touch behaviors (scroll, zoom) during gameplay
- Support both portrait (with letterboxing) and landscape (preferred)
