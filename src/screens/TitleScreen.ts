import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawSprite, TITLE_SKIER } from '../rendering/Sprites';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';

export type TitleMenuOption = 'start' | 'lessons' | 'practice' | 'editor' | 'options';

const MENU_ITEMS: { label: string; value: TitleMenuOption }[] = [
  { label: 'THE KILIMANJARO SKI TOURNAMENT', value: 'start' },
  { label: 'SKI LESSONS', value: 'lessons' },
  { label: 'PRACTICE COURSE', value: 'practice' },
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
      // Any input transitions to menu
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

    // Title text at top
    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SKI CRAZED', GAME_WIDTH / 2, 18);

    // Draw the large skier centered
    const skierX = Math.floor((GAME_WIDTH - TITLE_SKIER.width) / 2);
    const skierY = 28;
    drawSprite(ctx, TITLE_SKIER, skierX, skierY);

    // White snow ground line under skier
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, skierY + TITLE_SKIER.height + 2, GAME_WIDTH, 3);

    // Credits
    ctx.fillStyle = COLORS.ORANGE;
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ORIGINALLY BY JAM SOFTWARE 1987', GAME_WIDTH / 2, GAME_HEIGHT - 30);

    // Blinking "press any key" text
    if (Math.floor(this.animTimer / 30) % 2 === 0) {
      ctx.fillStyle = COLORS.WHITE;
      ctx.font = '6px monospace';
      ctx.fillText('PRESS ANY KEY / TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT - 12);
    }
  }

  private renderMenu(ctx: CanvasRenderingContext2D): void {
    // Blue background (matches original Apple IIe menu)
    ctx.fillStyle = COLORS.BLUE;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title at top
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SKI CRAZED', GAME_WIDTH / 2, 20);

    // Subtitle
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '6px monospace';
    ctx.fillText('SELECT AN OPTION:', GAME_WIDTH / 2, 38);

    // Menu items
    const menuStartY = 60;
    const lineHeight = 18;

    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const y = menuStartY + i * lineHeight;
      const selected = i === this.selectedIndex;

      if (selected) {
        // White selection highlight bar
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(20, y - 8, GAME_WIDTH - 40, 13);
        ctx.fillStyle = COLORS.BLUE;
      } else {
        ctx.fillStyle = COLORS.WHITE;
      }

      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(MENU_ITEMS[i].label, GAME_WIDTH / 2, y);
    }

    // Footer hint
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ARROWS/TOUCH TO SELECT  -  ENTER/TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT - 10);
    ctx.fillText('ESC/BACK FOR TITLE', GAME_WIDTH / 2, GAME_HEIGHT - 3);
  }
}
