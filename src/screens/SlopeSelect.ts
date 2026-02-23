import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { SlopeDef } from '../game/SlopeData';
import { SaveData } from '../data/Storage';
import { drawTerrain, drawMountains, drawSprite, SKIER_STANDING } from '../rendering/Sprites';
import { drawText, drawTextCentered, drawTextRight, CHAR_H } from '../rendering/BitmapFont';

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
    // Blue sky background
    ctx.fillStyle = COLORS.BLUE;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // "SKI CRAZED" banner at top
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 0, GAME_WIDTH, 16);
    drawTextCentered(ctx, 'SKI CRAZED', 4, COLORS.BLUE);

    // Mountain silhouettes
    drawMountains(ctx, 80, GAME_WIDTH);

    // Orange cross-hatched terrain at bottom
    drawTerrain(ctx, 0, 80, GAME_WIDTH, GAME_HEIGHT - 80);

    // Small skier on the terrain
    drawSprite(ctx, SKIER_STANDING, 40, 72);

    // Slope info panel (solid black background — no transparency on Apple IIe)
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(10, 90, GAME_WIDTH - 20, GAME_HEIGHT - 100);

    // Slope list
    const startY = 100;
    const lineHeight = 12;
    const maxVisible = 7;

    for (let i = 0; i < Math.min(maxVisible, this.slopes.length - this.scrollOffset); i++) {
      const idx = this.scrollOffset + i;
      const slope = this.slopes[idx];
      const unlocked = idx <= this.saveData.currentSlope;
      const selected = idx === this.selectedIndex;
      const y = startY + i * lineHeight;

      if (selected) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(14, y - 1, GAME_WIDTH - 28, CHAR_H + 2);
      }

      // Slope number and name
      const typeTag = slope.type === 'slalom' ? ' [SL]' : '';
      const label = unlocked ? `${slope.number}. ${slope.name}${typeTag}` : `${slope.number}. ???`;
      const color = selected ? COLORS.BLACK : (unlocked ? COLORS.GREEN : COLORS.PURPLE);
      drawText(ctx, label, 20, y, color);

      // Performance bar for completed slopes
      if (unlocked && this.saveData.bestPerformance[idx] !== undefined) {
        const perf = this.saveData.bestPerformance[idx];
        const barW = 36;
        const barX = GAME_WIDTH - 60;
        ctx.fillStyle = selected ? COLORS.PURPLE : COLORS.BLACK;
        ctx.fillRect(barX, y, barW, 6);
        ctx.fillStyle = perf >= 70 ? COLORS.GREEN : (perf >= 40 ? COLORS.ORANGE : COLORS.WHITE);
        ctx.fillRect(barX, y, Math.floor(barW * perf / 100), 6);
        drawTextRight(ctx, `${Math.floor(perf)}%`, GAME_WIDTH - 16, y, selected ? COLORS.BLACK : COLORS.WHITE);
      }
    }

    // Scroll indicators
    if (this.scrollOffset > 0) {
      drawTextCentered(ctx, '\u25B2', startY - 10, COLORS.WHITE);
    }
    if (this.scrollOffset + maxVisible < this.slopes.length) {
      drawTextCentered(ctx, '\u25BC', startY + maxVisible * lineHeight + 2, COLORS.WHITE);
    }

    // Footer
    drawTextCentered(ctx, 'ENTER/TAP TO SKI - ESC/BACK', GAME_HEIGHT - 6, COLORS.WHITE);
  }
}
