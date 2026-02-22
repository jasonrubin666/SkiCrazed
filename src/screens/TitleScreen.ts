import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawSprite, SKIER_SKIING } from '../rendering/Sprites';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';

export type TitleMenuOption = 'start' | 'lessons' | 'practice' | 'editor' | 'options';

const MENU_ITEMS: { label: string; value: TitleMenuOption }[] = [
  { label: 'START GAME', value: 'start' },
  { label: 'LESSONS', value: 'lessons' },
  { label: 'PRACTICE SLALOM', value: 'practice' },
  { label: 'MAKE A SLOPE', value: 'editor' },
  { label: 'OPTIONS', value: 'options' },
];

export class TitleScreen {
  private selectedIndex = 0;
  private animTimer = 0;
  private skierX = -10;
  private music: { stop: () => void } | null = null;

  enter(audio: AudioManager): void {
    this.music = audio.titleMusic();
  }

  exit(): void {
    this.music?.stop();
    this.music = null;
  }

  update(input: InputState, audio: AudioManager): TitleMenuOption | null {
    this.animTimer++;
    this.skierX = (this.skierX + 1) % (GAME_WIDTH + 30);

    if (input.up) {
      this.selectedIndex = (this.selectedIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
      audio.menuMove();
    }
    if (input.down) {
      this.selectedIndex = (this.selectedIndex + 1) % MENU_ITEMS.length;
      audio.menuMove();
    }
    if (input.confirm) {
      audio.menuSelect();
      return MENU_ITEMS[this.selectedIndex].value;
    }

    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Background
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Mountain silhouette
    ctx.fillStyle = COLORS.BLUE;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(40, 35);
    ctx.lineTo(80, 55);
    ctx.lineTo(120, 25);
    ctx.lineTo(160, 50);
    ctx.lineTo(200, 30);
    ctx.lineTo(240, 45);
    ctx.lineTo(280, 60);
    ctx.lineTo(280, 80);
    ctx.closePath();
    ctx.fill();

    // Snow ground
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 80, GAME_WIDTH, 4);

    // Title text
    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SKI CRAZED', GAME_WIDTH / 2, 20);

    // Subtitle
    ctx.fillStyle = COLORS.PURPLE;
    ctx.font = '6px monospace';
    ctx.fillText('MOUNT KILIMANJARO TOURNAMENT', GAME_WIDTH / 2, 32);

    // Credits
    ctx.fillStyle = COLORS.ORANGE;
    ctx.font = '5px monospace';
    ctx.fillText('ORIGINALLY BY JAM SOFTWARE 1987', GAME_WIDTH / 2, 42);

    // Animated skier across snow
    const skierFrame = SKIER_SKIING[Math.floor(this.animTimer / 10) % SKIER_SKIING.length];
    drawSprite(ctx, skierFrame, this.skierX - 10, 70);

    // Menu items
    const menuStartY = 100;
    const lineHeight = 14;

    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const y = menuStartY + i * lineHeight;
      const selected = i === this.selectedIndex;

      if (selected) {
        // Selection highlight
        ctx.fillStyle = COLORS.GREEN;
        ctx.fillRect(60, y - 7, GAME_WIDTH - 120, 11);
        ctx.fillStyle = COLORS.BLACK;
      } else {
        ctx.fillStyle = COLORS.WHITE;
      }

      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(MENU_ITEMS[i].label, GAME_WIDTH / 2, y);
    }

    // Controls hint
    ctx.fillStyle = COLORS.BLUE;
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ARROWS/TOUCH TO SELECT  -  ENTER/TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT - 8);
  }
}
