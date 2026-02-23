import { COLORS } from '../data/Constants';

/**
 * Pixel art sprite data defined as 2D arrays of palette color keys.
 * Each sprite is drawn at 1:1 pixel scale on the 280x192 canvas.
 * '_' = transparent, 'W' = white, 'G' = green, 'P' = purple, 'O' = orange, 'B' = blue, 'K' = black
 */
type PixelChar = '_' | 'W' | 'G' | 'P' | 'O' | 'B' | 'K';

const COLOR_MAP: Record<PixelChar, string | null> = {
  _: null,
  W: COLORS.WHITE,
  G: COLORS.GREEN,
  P: COLORS.PURPLE,
  O: COLORS.ORANGE,
  B: COLORS.BLUE,
  K: COLORS.BLACK,
};

export interface SpriteData {
  width: number;
  height: number;
  pixels: PixelChar[][];
}

function parseSprite(lines: string[]): SpriteData {
  const pixels = lines.map((line) => line.split('') as PixelChar[]);
  return {
    width: pixels[0]?.length || 0,
    height: pixels.length,
    pixels,
  };
}

// ======= SKIER SPRITES =======

export const SKIER_SKIING: SpriteData[] = [
  // Frame 0 - skiing pose
  parseSprite([
    '___W___',
    '__WWW__',
    '__WPW__',
    '__WWW__',
    '_WPPPW_',
    '__PPP__',
    '__P_P__',
    '__P_P__',
    '_P___P_',
    'B_____B',
  ]),
  // Frame 1 - skiing pose alternate
  parseSprite([
    '___W___',
    '__WWW__',
    '__WPW__',
    '__WWW__',
    '_WPPPW_',
    '__PPP__',
    '_PP_PP_',
    '__P_P__',
    '_P___P_',
    'B_____B',
  ]),
];

export const SKIER_JUMPING: SpriteData = parseSprite([
  '___W___',
  '__WWW__',
  '__WPW__',
  '__WWW__',
  '_WPPPW_',
  '__PPP__',
  '__PPP__',
  '_P___P_',
  'P_____P',
  'B_____B',
]);

export const SKIER_TRICK_BACKSCRATCHER: SpriteData = parseSprite([
  '___W___',
  '__WWW__',
  '__WPW__',
  '__WWW__',
  '_WPPPW_',
  '__PPP__',
  '__PPP__',
  '__P_P__',
  '__P__PB',
  '__P__B_',
]);

export const SKIER_TRICK_DAFFY: SpriteData = parseSprite([
  '___W___',
  '__WWW__',
  '__WPW__',
  '__WWW__',
  '_WPPPW_',
  '__PPP__',
  '__PPP__',
  '_P___P_',
  'B_____P',
  '______B',
]);

export const SKIER_CRASH: SpriteData[] = [
  parseSprite([
    '_W__B__',
    'WWW_B__',
    'WPW____',
    'WWW____',
    'PPPPP__',
    '_PPP___',
    '__PP___',
    '___PP__',
    '____PP_',
    '_____B_',
  ]),
  parseSprite([
    '____B__',
    '__B____',
    '__WW___',
    '_WPWW__',
    '__PPPP_',
    '__PPP__',
    '__PPP__',
    '_PPPP__',
    'B____B_',
    '_______',
  ]),
  parseSprite([
    '_B___B_',
    '_______',
    '___WW__',
    '__WPWW_',
    '_PPPPP_',
    '__PPP__',
    'PPPPPPP',
    '_______',
    '_______',
    '_______',
  ]),
];

export const SKIER_STANDING: SpriteData = parseSprite([
  '___W___',
  '__WWW__',
  '__WPW__',
  '__WWW__',
  '_WPPPW_',
  '__PPP__',
  '__P_P__',
  '__P_P__',
  '__P_P__',
  '_BB_BB_',
]);

// ======= OBSTACLE SPRITES =======

export const MOGUL_SMALL: SpriteData = parseSprite([
  '___WW___',
  '__WWWW__',
  '_WWWWWW_',
  'WWWWWWWW',
]);

export const MOGUL_LARGE: SpriteData = parseSprite([
  '____WW____',
  '___WWWW___',
  '__WWWWWW__',
  '_WWWWWWWW_',
  'WWWWWWWWWW',
  'WWWWWWWWWW',
]);

export const JUMP_SMALL: SpriteData = parseSprite([
  '______WW',
  '____WWWW',
  '__WWWWWW',
  'WWWWWWWW',
]);

export const JUMP_LARGE: SpriteData = parseSprite([
  '________WW',
  '______WWWW',
  '____WWWWWW',
  '___WWWWWWW',
  '__WWWWWWWW',
  '_WWWWWWWWW',
  'WWWWWWWWWW',
]);

export const ICE_PATCH: SpriteData = parseSprite([
  '__BBBBBB__',
  '_BBBBBBBB_',
  'BBBBWBBBBB',
  'BBBBBBBWBB',
  '_BBBBBBBB_',
  '__BBBBBB__',
]);

export const FLAG_RED: SpriteData = parseSprite([
  '_OOO_',
  '_OOO_',
  '_OO__',
  '__W__',
  '__W__',
  '__W__',
  '__W__',
  '__W__',
]);

export const FLAG_BLUE: SpriteData = parseSprite([
  '_BBB_',
  '_BBB_',
  '_BB__',
  '__W__',
  '__W__',
  '__W__',
  '__W__',
  '__W__',
]);

export const WARNING_SIGN: SpriteData = parseSprite([
  '___OO___',
  '__OOOO__',
  '_OOWOO__',
  '_OOKOO__',
  'OOOKOOOO',
  'OOOKOOOO',
  '_OOWOOO_',
  '__OOOO__',
]);

export const TREE: SpriteData[] = [
  parseSprite([
    '___G___',
    '__GGG__',
    '_GGGGG_',
    'GGGGGGG',
    '___O___',
    '___O___',
  ]),
  parseSprite([
    '____G____',
    '___GGG___',
    '__GGGGG__',
    '_GGGGGGG_',
    '___GGG___',
    '__GGGGG__',
    '_GGGGGGG_',
    'GGGGGGGGG',
    '____O____',
    '____O____',
  ]),
];

// ======= LARGE TITLE SKIER (for splash/credits screen) =======

export const TITLE_SKIER: SpriteData = parseSprite([
  '________WW________',
  '_______WWWW_______',
  '______WWWWWW______',
  '______WPPPWW______',
  '______WPPPWW______',
  '______WWWWWW______',
  '_______WWWW_______',
  '______PPPPPP______',
  '_____PPPPPPPP_____',
  '____PPPPPPPPPP____',
  '___WWPPPPPPPPWW___',
  '___WWPPPPPPPPWW___',
  '___WWPPPPPPPPWW___',
  '____WPPPPPPPPW____',
  'G____PPPPPPPP____G',
  'GG___BBBBBBBB___GG',
  '_GG__BB____BB__GG_',
  '__GG_BB____BB_GG__',
  '___GGBB____BBGG___',
  '____GBB____BBG____',
  '_____BB____BB_____',
  '_____BB____BB_____',
  '____BBB____BBB____',
]);

// ======= LODGE / BUILDING (at bottom of slope) =======

export const LODGE: SpriteData = parseSprite([
  '____________OO____________',
  '___________OOOO___________',
  '__________OOOOOO__________',
  '_________OOOOOOOO_________',
  '________OOOOOOOOOO________',
  '_______OOOOOOOOOOOO_______',
  '______OOOOOOOOOOOOOO______',
  '_____OOOOOOOOOOOOOOOO_____',
  '____OOOOOOOOOOOOOOOOOO____',
  '___OOOOOOOOOOOOOOOOOOOO___',
  '__OOOOOOOOOOOOOOOOOOOOOO__',
  '_OOOOOOOOOOOOOOOOOOOOOOOO_',
  'OOOOOOOOOOOOOOOOOOOOOOOOOO',
  'OOPPPPPPPPPPPPPPPPPPPPPPOO',
  'OOPPPPPPPPPPPPPPPPPPPPPPOO',
  'OOPPPWWWPPPPPPPPPWWWPPPPOO',
  'OOPPPWBWPPPPPPPPPWBWPPPPOO',
  'OOPPPWBWPPPPPPPPPWBWPPPPOO',
  'OOPPPWWWPPPPPPPPPWWWPPPPOO',
  'OOPPPPPPPPPWWWWPPPPPPPPOO_',
  'OOPPPPPPPPPWBBWPPPPPPPPOO_',
  'OOPPPPPPPPPWBBWPPPPPPPPOO_',
  'OOPPPPPPPPPWBBWPPPPPPPPOO_',
]);

// ======= JAMMER (tutorial instructor) =======

export const JAMMER: SpriteData = parseSprite([
  '___W___',
  '__WOW__',
  '__WOW__',
  '__WWW__',
  '_WOOOW_',
  '__OOO__',
  '__O_O__',
  '__O_O__',
  '__O_O__',
  '_BB_BB_',
]);

// ======= RENDERING FUNCTIONS =======

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: SpriteData,
  x: number,
  y: number,
  flipX = false
): void {
  for (let row = 0; row < sprite.height; row++) {
    for (let col = 0; col < sprite.width; col++) {
      const px = sprite.pixels[row][col];
      const color = COLOR_MAP[px];
      if (!color) continue;
      const drawCol = flipX ? sprite.width - 1 - col : col;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x + drawCol), Math.floor(y + row), 1, 1);
    }
  }
}

/**
 * Draw the large skier head with goggles for the main menu screen.
 * Matches the original Apple IIe close-up of the skier's face.
 */
export function drawMenuSkierHead(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
): void {
  // Purple stocking cap
  ctx.fillStyle = COLORS.PURPLE;
  // Cap top (pointed)
  ctx.fillRect(cx - 2, cy - 52, 4, 4);
  ctx.fillRect(cx - 4, cy - 48, 8, 4);
  ctx.fillRect(cx - 8, cy - 44, 16, 4);
  ctx.fillRect(cx - 14, cy - 40, 28, 4);
  ctx.fillRect(cx - 20, cy - 36, 40, 4);
  ctx.fillRect(cx - 26, cy - 32, 52, 6);
  ctx.fillRect(cx - 30, cy - 26, 60, 6);

  // Pompom on top
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(cx - 4, cy - 56, 8, 6);

  // Face area (orange skin)
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillRect(cx - 30, cy - 20, 60, 40);

  // Goggles - white frame
  ctx.fillStyle = COLORS.WHITE;
  // Left goggle frame
  ctx.fillRect(cx - 28, cy - 16, 24, 20);
  // Right goggle frame
  ctx.fillRect(cx + 4, cy - 16, 24, 20);
  // Bridge between goggles
  ctx.fillRect(cx - 4, cy - 10, 8, 8);

  // Goggle lenses (blue)
  ctx.fillStyle = COLORS.BLUE;
  ctx.fillRect(cx - 24, cy - 12, 16, 12);
  ctx.fillRect(cx + 8, cy - 12, 16, 12);

  // Goggle shine highlights
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(cx - 22, cy - 10, 4, 4);
  ctx.fillRect(cx + 10, cy - 10, 4, 4);

  // Mouth/chin area
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillRect(cx - 26, cy + 4, 52, 8);

  // Purple scarf
  ctx.fillStyle = COLORS.PURPLE;
  ctx.fillRect(cx - 30, cy + 12, 60, 16);
  ctx.fillRect(cx - 26, cy + 28, 52, 8);
  // Scarf tails
  ctx.fillRect(cx + 20, cy + 20, 14, 20);
  ctx.fillRect(cx + 24, cy + 36, 10, 8);
}

/**
 * Draw cross-hatched terrain matching the original Apple IIe look.
 * Orange base with diagonal line pattern.
 */
export function drawTerrain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  // Orange base
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillRect(x, y, w, h);

  // Cross-hatch pattern with darker lines
  ctx.strokeStyle = '#A04000';
  ctx.lineWidth = 1;
  const spacing = 6;

  ctx.beginPath();
  // Diagonal lines (top-left to bottom-right)
  for (let i = -h; i < w + h; i += spacing) {
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h, y + h);
  }
  // Diagonal lines (top-right to bottom-left)
  for (let i = -h; i < w + h; i += spacing) {
    ctx.moveTo(x + i + h, y);
    ctx.lineTo(x + i, y + h);
  }
  ctx.stroke();
}

/**
 * Draw mountain silhouettes for menu/select screens.
 */
export function drawMountains(
  ctx: CanvasRenderingContext2D,
  baseY: number,
  w: number,
): void {
  // Back range (white/snow)
  ctx.fillStyle = COLORS.WHITE;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  ctx.lineTo(30, baseY - 35);
  ctx.lineTo(60, baseY - 20);
  ctx.lineTo(100, baseY - 50);
  ctx.lineTo(130, baseY - 30);
  ctx.lineTo(170, baseY - 55);
  ctx.lineTo(200, baseY - 25);
  ctx.lineTo(240, baseY - 40);
  ctx.lineTo(w, baseY - 15);
  ctx.lineTo(w, baseY);
  ctx.closePath();
  ctx.fill();

  // Front range (purple)
  ctx.fillStyle = COLORS.PURPLE;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  ctx.lineTo(40, baseY - 25);
  ctx.lineTo(80, baseY - 10);
  ctx.lineTo(140, baseY - 35);
  ctx.lineTo(180, baseY - 15);
  ctx.lineTo(220, baseY - 30);
  ctx.lineTo(w, baseY - 8);
  ctx.lineTo(w, baseY);
  ctx.closePath();
  ctx.fill();
}
