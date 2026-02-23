import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawSprite, TITLE_SKIER, drawMenuSkierHead, drawTerrain } from '../rendering/Sprites';
import { drawText, drawTextCentered, drawTextRight, CHAR_H } from '../rendering/BitmapFont';
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
    // Black background
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw the colorful title skier centered
    const skierX = Math.floor((GAME_WIDTH - TITLE_SKIER.width) / 2);
    const skierY = 10;
    drawSprite(ctx, TITLE_SKIER, skierX, skierY);

    // White snow ground line under skier
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(skierX - 20, skierY + TITLE_SKIER.height + 2, TITLE_SKIER.width + 40, 2);

    // Credits text (Apple IIe grid-aligned)
    const creditsY = skierY + TITLE_SKIER.height + 16;

    drawTextCentered(ctx, 'PROGRAMMING AND ART', creditsY, COLORS.GREEN);
    drawTextCentered(ctx, 'JASON RUBIN', creditsY + CHAR_H + 2, COLORS.WHITE);

    drawTextCentered(ctx, 'PROGRAMMING', creditsY + CHAR_H * 3, COLORS.GREEN);
    drawTextCentered(ctx, 'ANDY GAVIN', creditsY + CHAR_H * 4 + 2, COLORS.WHITE);

    // JAM Software logo text
    drawTextCentered(ctx, 'JAM SOFTWARE', GAME_HEIGHT - 42, COLORS.ORANGE);

    drawTextCentered(ctx, 'COPYRIGHT (C) 1987', GAME_HEIGHT - 30, COLORS.WHITE);
    drawTextCentered(ctx, 'PRODUCED BY: BAUDVILLE', GAME_HEIGHT - 20, COLORS.WHITE);

    // Blinking "press any key" text
    if (Math.floor(this.animTimer / 30) % 2 === 0) {
      drawTextCentered(ctx, 'PRESS ANY KEY / TAP TO START', GAME_HEIGHT - 6, COLORS.GREEN);
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
      const labelW = label.length * 7;
      const labelX = menuCenterX - Math.floor(labelW / 2);

      if (selected) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(labelX - 4, y - 2, labelW + 8, 12);
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
