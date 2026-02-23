import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawMenuSkierHead, drawTerrain } from '../rendering/Sprites';
import { drawText, drawTextCentered, drawTextRight, drawTextScaled, CHAR_W, CHAR_H } from '../rendering/BitmapFont';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';

export type TitleMenuOption = 'start' | 'lessons' | 'practice' | 'editor' | 'options';

const MENU_ITEMS: { label: string; value: TitleMenuOption }[] = [
  { label: 'PLAY THE GAME', value: 'start' },
  { label: 'TAKE LESSONS', value: 'lessons' },
  { label: 'SLALOM PRACTICE', value: 'practice' },
  { label: 'MAKE A SLOPE', value: 'editor' },
  { label: 'OPTIONS', value: 'options' },
];

type ScreenMode = 'splash' | 'menu';

// ═══════════════════════════════════════════════════════════
// Large title screen skier — procedural pixel art matching
// the original Apple IIe Ski Crazed title screen
// ═══════════════════════════════════════════════════════════

function drawLargeSkier(ctx: CanvasRenderingContext2D): void {
  // ── SKI POLES (behind body) ──
  ctx.fillStyle = COLORS.WHITE;
  // Left pole: diagonal from upper-left to left hand
  for (let i = 0; i < 52; i++) {
    ctx.fillRect(6 + Math.floor(i * 0.35), 2 + i, 2, 1);
  }
  // Right pole: from right hand going down-right
  for (let i = 0; i < 70; i++) {
    ctx.fillRect(156 + Math.floor(i * 0.35), 82 + Math.floor(i * 1.1), 2, 1);
  }
  // Pole baskets (small cross shapes at tips)
  ctx.fillStyle = COLORS.GREEN;
  ctx.fillRect(2, 0, 8, 3);
  ctx.fillRect(4, 0, 4, 6);
  ctx.fillRect(178, 156, 8, 3);
  ctx.fillRect(180, 154, 4, 7);

  // ── SKIS (green) ──
  ctx.fillStyle = COLORS.GREEN;
  // Left ski
  ctx.fillRect(28, 156, 64, 4);
  ctx.fillRect(24, 157, 6, 3);
  ctx.fillRect(20, 158, 5, 2);
  // Right ski
  ctx.fillRect(68, 160, 64, 4);
  ctx.fillRect(64, 161, 6, 3);
  ctx.fillRect(60, 162, 5, 2);

  // ── BOOTS (black) ──
  ctx.fillStyle = COLORS.BLACK;
  ctx.fillRect(58, 148, 24, 9);
  ctx.fillRect(96, 150, 24, 9);

  // ── LEGS / PANTS (blue) ──
  ctx.fillStyle = COLORS.BLUE;
  // Left leg
  ctx.fillRect(62, 116, 20, 34);
  ctx.fillRect(60, 118, 2, 28);
  ctx.fillRect(82, 118, 2, 28);
  // Right leg
  ctx.fillRect(98, 118, 20, 34);
  ctx.fillRect(96, 120, 2, 28);
  ctx.fillRect(118, 120, 2, 28);

  // ── BELT ──
  ctx.fillStyle = COLORS.BLUE;
  ctx.fillRect(54, 110, 72, 6);
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(86, 111, 8, 4);
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillRect(88, 112, 4, 2);

  // ── TORSO / JACKET (purple) ──
  ctx.fillStyle = COLORS.PURPLE;
  // Main body
  ctx.fillRect(54, 66, 72, 44);
  // Shoulders (wider)
  ctx.fillRect(46, 64, 88, 14);
  // Shoulder rounding
  ctx.fillRect(44, 66, 4, 10);
  ctx.fillRect(132, 66, 4, 10);
  ctx.fillRect(42, 68, 4, 6);
  ctx.fillRect(134, 68, 4, 6);

  // ── JACKET DETAILS ──
  // White zipper
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(89, 68, 2, 42);
  // Blue pockets
  ctx.fillStyle = COLORS.BLUE;
  ctx.fillRect(58, 80, 18, 16);
  ctx.fillRect(60, 78, 14, 2);
  ctx.fillRect(104, 80, 18, 16);
  ctx.fillRect(106, 78, 14, 2);
  // Pocket highlights
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(60, 80, 14, 1);
  ctx.fillRect(106, 80, 14, 1);
  // Jacket bottom trim
  ctx.fillRect(54, 108, 72, 2);

  // ── LEFT ARM (going up-left) ──
  ctx.fillStyle = COLORS.PURPLE;
  ctx.fillRect(34, 56, 14, 12);
  ctx.fillRect(40, 60, 8, 8);
  ctx.fillRect(26, 50, 12, 10);
  ctx.fillRect(30, 54, 8, 6);
  ctx.fillRect(20, 46, 10, 8);
  // Left glove
  ctx.fillStyle = COLORS.GREEN;
  ctx.fillRect(12, 42, 14, 14);
  ctx.fillRect(10, 44, 4, 10);
  ctx.fillRect(8, 46, 4, 6);

  // ── RIGHT ARM (going right) ──
  ctx.fillStyle = COLORS.PURPLE;
  ctx.fillRect(132, 66, 14, 10);
  ctx.fillRect(140, 72, 14, 10);
  ctx.fillRect(148, 76, 12, 8);
  ctx.fillRect(136, 70, 8, 6);
  ctx.fillRect(144, 74, 8, 6);
  // Right glove
  ctx.fillStyle = COLORS.GREEN;
  ctx.fillRect(154, 78, 14, 14);
  ctx.fillRect(164, 80, 4, 10);
  ctx.fillRect(166, 82, 4, 6);

  // ── COLLAR / NECK ──
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(72, 56, 36, 10);
  ctx.fillRect(76, 54, 28, 4);

  // ── HEAD / FACE (orange) ──
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillRect(66, 26, 48, 30);
  ctx.fillRect(64, 30, 4, 22);
  ctx.fillRect(112, 30, 4, 22);
  // Chin
  ctx.fillRect(70, 52, 40, 4);
  ctx.fillRect(74, 54, 32, 2);

  // ── GOGGLES ──
  // White frame
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(62, 30, 56, 18);
  ctx.fillRect(64, 28, 52, 4);
  ctx.fillRect(64, 46, 52, 2);
  // Strap
  ctx.fillRect(58, 34, 6, 10);
  ctx.fillRect(116, 34, 6, 10);
  // Blue lenses
  ctx.fillStyle = COLORS.BLUE;
  ctx.fillRect(66, 32, 18, 14);
  ctx.fillRect(96, 32, 18, 14);
  // Lens shine
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(68, 34, 6, 5);
  ctx.fillRect(98, 34, 6, 5);
  // Bridge
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(84, 36, 12, 8);

  // ── MOUTH / GRIN ──
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(76, 48, 28, 4);
  ctx.fillStyle = COLORS.BLACK;
  ctx.fillRect(76, 48, 28, 1);
  ctx.fillRect(76, 52, 28, 1);
  ctx.fillRect(76, 48, 1, 4);
  ctx.fillRect(103, 48, 1, 4);

  // ── HAIR (orange, flowing right) ──
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillRect(64, 14, 52, 16);
  // Flowing to the right
  ctx.fillRect(110, 16, 18, 12);
  ctx.fillRect(124, 18, 14, 8);
  ctx.fillRect(134, 20, 8, 5);
  ctx.fillRect(138, 22, 5, 3);
  // Left side hair
  ctx.fillRect(60, 18, 6, 12);
  ctx.fillRect(58, 22, 4, 6);
  // Blend into face
  ctx.fillRect(112, 26, 6, 6);

  // ── HAT (white beanie) ──
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillRect(70, 4, 40, 12);
  ctx.fillRect(74, 2, 32, 4);
  ctx.fillRect(78, 0, 24, 4);
  ctx.fillRect(84, 0, 12, 2);
  // Pompom
  ctx.fillRect(86, -4, 8, 6);
  ctx.fillRect(84, -2, 12, 4);
  // Brim
  ctx.fillRect(66, 14, 48, 3);
}

// ═══════════════════════════════════════
// JAM SOFTWARE circular logo with stripes
// ═══════════════════════════════════════

function drawJAMLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  const r = 26;

  // Filled circle with diagonal orange/white stripes
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const stripe = ((dx + dy + r * 4) % 8) < 4;
        ctx.fillStyle = stripe ? COLORS.ORANGE : COLORS.WHITE;
        ctx.fillRect(cx + dx, cy + dy, 1, 1);
      }
    }
  }

  // Black circle border (2px thick)
  ctx.fillStyle = COLORS.BLACK;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const distSq = dx * dx + dy * dy;
      if (distSq <= r * r && distSq >= (r - 2) * (r - 2)) {
        ctx.fillRect(cx + dx, cy + dy, 1, 1);
      }
    }
  }

  // "JAM" at 2x scale centered in the circle
  const jamW = 3 * CHAR_W * 2;
  drawTextScaled(ctx, 'JAM', cx - Math.floor(jamW / 2), cy - 12, COLORS.BLACK, 2);

  // "SOFTWARE" at 1x scale below
  const swW = 8 * CHAR_W;
  drawText(ctx, 'SOFTWARE', cx - Math.floor(swW / 2), cy + 8, COLORS.BLACK);

  // Green drips hanging from the bottom of the circle
  ctx.fillStyle = COLORS.GREEN;
  const drips = [-18, -10, -2, 6, 14];
  const dripH = [8, 12, 10, 14, 7];
  for (let i = 0; i < drips.length; i++) {
    const dx = drips[i];
    const h = dripH[i];
    ctx.fillRect(cx + dx, cy + r - 1, 3, h);
    ctx.fillRect(cx + dx + 1, cy + r - 1 + h, 1, 3);
  }
}

// ═══════════════════════════════════════
// Title Screen class
// ═══════════════════════════════════════

export class TitleScreen {
  private selectedIndex = 0;
  private animTimer = 0;
  private mode: ScreenMode = 'splash';
  private music: { stop: () => void } | null = null;

  enter(audio: AudioManager): void {
    this.music = audio.titleMusic();
    this.mode = 'splash';
    this.animTimer = 0;
  }

  exit(): void {
    this.music?.stop();
    this.music = null;
  }

  update(input: InputState, audio: AudioManager): TitleMenuOption | null {
    this.animTimer++;

    if (this.mode === 'splash') {
      if (input.confirm || input.up || input.down || input.trick1 || input.trick2) {
        this.mode = 'menu';
        this.selectedIndex = 0;
        audio.menuSelect();
      }
      return null;
    }

    // Menu mode
    if (input.up) {
      this.selectedIndex = (this.selectedIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
      audio.menuMove();
    }
    if (input.down) {
      this.selectedIndex = (this.selectedIndex + 1) % MENU_ITEMS.length;
      audio.menuMove();
    }
    if (input.back) {
      this.mode = 'splash';
      return null;
    }
    if (input.confirm) {
      audio.menuSelect();
      return MENU_ITEMS[this.selectedIndex].value;
    }

    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.mode === 'splash') {
      this.renderSplash(ctx);
    } else {
      this.renderMenu(ctx);
    }
  }

  private renderSplash(ctx: CanvasRenderingContext2D): void {
    // White background (matching original Apple IIe)
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Large skier figure (left side of screen)
    drawLargeSkier(ctx);

    // ── Credits text (upper right) ──
    const tx = 176;
    drawText(ctx, 'PROGRAMMING', tx, 10, COLORS.GREEN);
    drawText(ctx, 'AND ART', tx + 14, 20, COLORS.GREEN);
    drawText(ctx, 'JASON RUBIN', tx, 32, COLORS.PURPLE);
    drawText(ctx, 'PROGRAMMING', tx, 46, COLORS.GREEN);
    drawText(ctx, 'ANDY GAVIN', tx + 7, 56, COLORS.PURPLE);

    // ── JAM SOFTWARE logo (right side, middle) ──
    drawJAMLogo(ctx, 215, 105);

    // ── Copyright info (bottom) ──
    drawText(ctx, 'COPYRIGHT (C) 1987', 148, 144, COLORS.BLACK);
    drawText(ctx, 'JASON RUBIN AND', 157, 154, COLORS.BLACK);
    drawText(ctx, 'ANDY GAVIN', 175, 164, COLORS.BLACK);
    drawText(ctx, 'PRODUCED BY:', 162, 176, COLORS.BLACK);

    // BAUDVILLE in larger green text (stylized logo)
    drawTextScaled(ctx, 'BAUDVILLE', 148, 184, COLORS.GREEN, 1);

    // Blinking prompt
    if (Math.floor(this.animTimer / 30) % 2 === 0) {
      drawTextCentered(ctx, 'PRESS ANY KEY / TAP TO START', GAME_HEIGHT - 6, COLORS.BLACK);
    }
  }

  private renderMenu(ctx: CanvasRenderingContext2D): void {
    // Black background
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw terrain at bottom
    drawTerrain(ctx, 0, GAME_HEIGHT - 30, GAME_WIDTH, 30);

    // Draw the large skier head on the left side
    drawMenuSkierHead(ctx, 70, GAME_HEIGHT / 2 - 10);

    // "MAIN MENU" title on the right side
    const menuCenterX = 200;
    drawText(ctx, 'MAIN MENU', menuCenterX - 31, 10, COLORS.WHITE);

    // Menu items on the right
    const menuStartY = 44;
    const lineHeight = 20;

    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const y = menuStartY + i * lineHeight;
      const selected = i === this.selectedIndex;
      const label = MENU_ITEMS[i].label;
      const labelW = label.length * CHAR_W;
      const labelX = menuCenterX - Math.floor(labelW / 2);

      if (selected) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(labelX - 4, y - 2, labelW + 8, CHAR_H + 4);
        drawText(ctx, label, labelX, y, COLORS.BLACK);
      } else {
        drawText(ctx, label, labelX, y, COLORS.GREEN);
      }
    }

    // Controls info
    drawText(ctx, 'USE ARROWS AND RETURN', menuCenterX - 73, GAME_HEIGHT - 38, COLORS.WHITE);

    // Baudville
    drawTextRight(ctx, 'BAUDVILLE', GAME_WIDTH - 4, GAME_HEIGHT - 10, COLORS.ORANGE);
  }
}
