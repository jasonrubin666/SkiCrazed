import { GAME_WIDTH, COLORS, HUD_Y } from '../data/Constants';
import { LODGE, drawSprite } from './Sprites';

/**
 * Renders the static background matching the original Apple IIe game:
 * - Orange sky (static, does not scroll)
 * - White slope area
 * - Lodge/building at bottom right of the slope
 */
export class Background {
  render(ctx: CanvasRenderingContext2D, _scrollX: number): void {
    // Orange sky - static, does not move (matches original)
    ctx.fillStyle = COLORS.ORANGE;
    ctx.fillRect(0, 0, GAME_WIDTH, 50);

    // White snow slope - static ground area
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 50, GAME_WIDTH, HUD_Y - 50);

    // Lodge/building at bottom-right of slope
    const lodgeX = GAME_WIDTH - LODGE.width - 4;
    const lodgeY = HUD_Y - LODGE.height;
    drawSprite(ctx, LODGE, lodgeX, lodgeY);
  }
}
