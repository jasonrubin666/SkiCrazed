import { GAME_WIDTH, GAME_HEIGHT, COLORS, HUD_Y, HUD_HEIGHT, MAX_FALLS } from '../data/Constants';
import { drawText, drawTextCentered, drawTextRight } from './BitmapFont';

/**
 * Heads-up display: slope progress bar and fall counter.
 */
export class HUD {
  render(
    ctx: CanvasRenderingContext2D,
    progress: number, // 0–1: how far through the slope
    falls: number,
    slopeName: string,
    slopeNumber: number,
    isPaused: boolean
  ): void {
    // HUD background
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, HUD_Y, GAME_WIDTH, HUD_HEIGHT);

    // Slope progress bar
    const barX = 4;
    const barY = HUD_Y + 4;
    const barW = GAME_WIDTH - 80;
    const barH = 6;

    // Bar outline (pixel-perfect, no strokeRect)
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(barX, barY, barW, 1);
    ctx.fillRect(barX, barY + barH, barW, 1);
    ctx.fillRect(barX, barY, 1, barH);
    ctx.fillRect(barX + barW - 1, barY, 1, barH);

    // Progress fill
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(barX + 1, barY + 1, Math.floor((barW - 2) * progress), barH - 2);

    // Position marker
    const markerX = barX + 1 + Math.floor((barW - 2) * progress);
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(markerX - 1, barY - 1, 3, barH + 2);

    // Falls counter
    const fallColor = falls >= MAX_FALLS - 3 ? COLORS.ORANGE : COLORS.WHITE;
    drawTextRight(ctx, `FALLS:${falls}/${MAX_FALLS}`, GAME_WIDTH - 4, barY, fallColor);

    // Slope name
    drawText(ctx, `${slopeNumber}. ${slopeName}`, barX, HUD_Y + 14, COLORS.WHITE);

    // Pause indicator
    if (isPaused) {
      drawTextCentered(ctx, 'PAUSED', GAME_HEIGHT / 2 - 4, COLORS.ORANGE);
    }
  }
}
