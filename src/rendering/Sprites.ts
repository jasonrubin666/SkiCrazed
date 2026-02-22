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

// ======= RENDERING FUNCTION =======

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
