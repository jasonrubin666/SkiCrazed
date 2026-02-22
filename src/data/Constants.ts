// Internal resolution matching Apple II hi-res mode
export const GAME_WIDTH = 280;
export const GAME_HEIGHT = 192;

// Apple II 6-color hi-res palette
export const COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  GREEN: '#14B81A',
  PURPLE: '#C840E0',
  ORANGE: '#E06010',
  BLUE: '#0078F0',
} as const;

// Gameplay
export const TARGET_FPS = 60;
export const FIXED_DT = 1000 / TARGET_FPS;
export const MAX_FALLS = 15;
export const MAX_CUSTOM_SLOPES = 10;

// Physics
export const GRAVITY = 0.3;
export const BASE_SCROLL_SPEED = 1.5;
export const SKIER_X = 60; // Skier's fixed X position on screen
export const SKIER_Y_MIN = 40; // Top bound for skier movement
export const SKIER_Y_MAX = 155; // Bottom bound for skier movement
export const SKIER_MOVE_SPEED = 2.5;
export const JUMP_VELOCITY = -5;
export const TRICK_AIR_EXTENSION = 0.4; // Multiplier slowing fall during trick

// HUD
export const HUD_HEIGHT = 24;
export const HUD_Y = GAME_HEIGHT - HUD_HEIGHT;

// Obstacle spacing
export const MIN_OBSTACLE_GAP = 60;

// Touch zones (percentage of screen)
export const TOUCH_ZONE = {
  UP_BOTTOM: 0.45, // Top 45% of screen = up zone
  DOWN_TOP: 0.55,  // Bottom 45% = down zone
  TRICK_LEFT: 0.3, // Left 30% = trick zone
} as const;
