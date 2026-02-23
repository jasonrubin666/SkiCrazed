import { GAME_WIDTH, COLORS, HUD_Y } from '../data/Constants';
import { LODGE, drawSprite, drawTerrain } from './Sprites';

/**
 * Renders the static background matching the original Apple IIe game:
 * - Blue sky (static, does not scroll)
 * - Orange cross-hatched terrain
 * - Lodge/building at bottom right of the slope
 */
export class Background {
  render(ctx: CanvasRenderingContext2D, _scrollX: number): void {
    // Blue sky - static (matches original Apple IIe)
    ctx.fillStyle = COLORS.BLUE;
    ctx.fillRect(0, 0, GAME_WIDTH, 50);

    // Orange cross-hatched terrain
    drawTerrain(ctx, 0, 50, GAME_WIDTH, HUD_Y - 50);

    // Lodge/building at bottom-right of slope
    const lodgeX = GAME_WIDTH - LODGE.width - 4;
    const lodgeY = HUD_Y - LODGE.height;
    drawSprite(ctx, LODGE, lodgeX, lodgeY);
  }
}
