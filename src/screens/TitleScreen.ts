import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawSprite, TITLE_SKIER, drawMenuSkierHead, drawTerrain } from '../rendering/Sprites';
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

    // Credits text (matching original Apple IIe layout)
    ctx.textAlign = 'center';

    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '6px monospace';
    ctx.fillText('PROGRAMMING AND ART', GAME_WIDTH / 2, skierY + TITLE_SKIER.height + 20);
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillText('JASON RUBIN', GAME_WIDTH / 2, skierY + TITLE_SKIER.height + 30);

    ctx.fillStyle = COLORS.GREEN;
    ctx.fillText('PROGRAMMING', GAME_WIDTH / 2, skierY + TITLE_SKIER.height + 44);
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillText('ANDY GAVIN', GAME_WIDTH / 2, skierY + TITLE_SKIER.height + 54);

    // JAM Software logo text
    ctx.fillStyle = COLORS.ORANGE;
    ctx.font = '7px monospace';
    ctx.fillText('JAM SOFTWARE', GAME_WIDTH / 2, GAME_HEIGHT - 40);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '5px monospace';
    ctx.fillText('COPYRIGHT (C) 1987', GAME_WIDTH / 2, GAME_HEIGHT - 28);
    ctx.fillText('PRODUCED BY: BAUDVILLE', GAME_WIDTH / 2, GAME_HEIGHT - 20);

    // Blinking "press any key" text
    if (Math.floor(this.animTimer / 30) % 2 === 0) {
      ctx.fillStyle = COLORS.GREEN;
      ctx.font = '5px monospace';
      ctx.fillText('PRESS ANY KEY / TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT - 6);
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
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    const menuCenterX = 200;
    ctx.fillText('MAIN MENU', menuCenterX, 18);

    // Menu items on the right
    const menuStartY = 44;
    const lineHeight = 20;

    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const y = menuStartY + i * lineHeight;
      const selected = i === this.selectedIndex;

      if (selected) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(145, y - 8, 110, 14);
        ctx.fillStyle = COLORS.BLACK;
      } else {
        ctx.fillStyle = COLORS.GREEN;
      }

      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(MENU_ITEMS[i].label, menuCenterX, y);
    }

    // Controls info
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('USE ARROWS AND RETURN', menuCenterX, GAME_HEIGHT - 38);

    // Baudville
    ctx.fillStyle = COLORS.ORANGE;
    ctx.textAlign = 'right';
    ctx.fillText('BAUDVILLE', GAME_WIDTH - 8, GAME_HEIGHT - 4);
  }
}
