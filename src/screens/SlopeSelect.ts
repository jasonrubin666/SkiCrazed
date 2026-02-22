import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { SlopeDef } from '../game/SlopeData';
import { SaveData } from '../data/Storage';

export class SlopeSelect {
  private selectedIndex = 0;
  private scrollOffset = 0;

  constructor(
    private slopes: SlopeDef[],
    private saveData: SaveData,
  ) {
    // Default to the current/next slope
    this.selectedIndex = Math.min(saveData.currentSlope, slopes.length - 1);
  }

  update(input: InputState, audio: AudioManager): number | 'back' | null {
    if (input.up && this.selectedIndex > 0) {
      this.selectedIndex--;
      audio.menuMove();
    }
    if (input.down && this.selectedIndex < this.slopes.length - 1) {
      this.selectedIndex++;
      audio.menuMove();
    }
    if (input.back) return 'back';

    // Scroll to keep selection visible
    const maxVisible = 10;
    if (this.selectedIndex < this.scrollOffset) {
      this.scrollOffset = this.selectedIndex;
    }
    if (this.selectedIndex >= this.scrollOffset + maxVisible) {
      this.scrollOffset = this.selectedIndex - maxVisible + 1;
    }

    if (input.confirm) {
      // Can only select unlocked slopes
      if (this.selectedIndex <= this.saveData.currentSlope) {
        audio.menuSelect();
        return this.selectedIndex;
      } else {
        audio.mogulFail();
      }
    }

    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT SLOPE', GAME_WIDTH / 2, 14);

    // Slope list
    const startY = 28;
    const lineHeight = 14;
    const maxVisible = 10;

    for (let i = 0; i < Math.min(maxVisible, this.slopes.length - this.scrollOffset); i++) {
      const idx = this.scrollOffset + i;
      const slope = this.slopes[idx];
      const unlocked = idx <= this.saveData.currentSlope;
      const selected = idx === this.selectedIndex;
      const y = startY + i * lineHeight;

      if (selected) {
        ctx.fillStyle = COLORS.GREEN;
        ctx.fillRect(8, y - 7, GAME_WIDTH - 16, 12);
      }

      // Slope number and name
      ctx.fillStyle = selected ? COLORS.BLACK : (unlocked ? COLORS.WHITE : COLORS.PURPLE);
      ctx.font = '6px monospace';
      ctx.textAlign = 'left';
      const typeTag = slope.type === 'slalom' ? ' [SL]' : '';
      ctx.fillText(
        unlocked ? `${slope.number}. ${slope.name}${typeTag}` : `${slope.number}. ???`,
        14, y
      );

      // Performance bar for completed slopes
      if (unlocked && this.saveData.bestPerformance[idx] !== undefined) {
        const perf = this.saveData.bestPerformance[idx];
        const barW = 40;
        const barX = GAME_WIDTH - 56;
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(barX, y - 5, barW, 6);
        ctx.fillStyle = perf >= 70 ? COLORS.GREEN : (perf >= 40 ? COLORS.ORANGE : COLORS.PURPLE);
        ctx.fillRect(barX, y - 5, Math.floor(barW * perf / 100), 6);
        ctx.fillStyle = selected ? COLORS.BLACK : COLORS.WHITE;
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.floor(perf)}%`, GAME_WIDTH - 12, y);
      }
    }

    // Scroll indicators
    if (this.scrollOffset > 0) {
      ctx.fillStyle = COLORS.WHITE;
      ctx.textAlign = 'center';
      ctx.fillText('▲', GAME_WIDTH / 2, startY - 6);
    }
    if (this.scrollOffset + maxVisible < this.slopes.length) {
      ctx.fillStyle = COLORS.WHITE;
      ctx.textAlign = 'center';
      ctx.fillText('▼', GAME_WIDTH / 2, startY + maxVisible * lineHeight + 4);
    }

    // Footer
    ctx.fillStyle = COLORS.BLUE;
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ENTER/TAP TO SKI  -  ESC/BACK TO MENU', GAME_WIDTH / 2, GAME_HEIGHT - 8);
  }
}
