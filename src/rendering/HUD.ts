import { GAME_WIDTH, GAME_HEIGHT, COLORS, HUD_Y, HUD_HEIGHT, MAX_FALLS } from '../data/Constants';

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

    // Bar outline
    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Progress fill
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(barX + 1, barY + 1, Math.floor((barW - 2) * progress), barH - 2);

    // Position marker
    const markerX = barX + 1 + Math.floor((barW - 2) * progress);
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(markerX - 1, barY - 1, 3, barH + 2);

    // Falls counter
    ctx.fillStyle = falls >= MAX_FALLS - 3 ? COLORS.ORANGE : COLORS.WHITE;
    ctx.font = '6px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`FALLS:${falls}/${MAX_FALLS}`, GAME_WIDTH - 4, barY + 5);

    // Slope name
    ctx.fillStyle = COLORS.WHITE;
    ctx.textAlign = 'left';
    ctx.fillText(`${slopeNumber}. ${slopeName}`, barX, HUD_Y + 18);

    // Pause indicator
    if (isPaused) {
      ctx.fillStyle = COLORS.ORANGE;
      ctx.textAlign = 'center';
      ctx.font = '8px monospace';
      ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
  }
}
