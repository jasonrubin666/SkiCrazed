import { GAME_WIDTH, GAME_HEIGHT, COLORS, HUD_Y } from '../data/Constants';
import { TREE, drawSprite } from './Sprites';

interface BackgroundTree {
  x: number;
  y: number;
  variant: number;
  parallaxFactor: number;
}

/**
 * Renders the scrolling mountain background, sky, and decorative trees.
 */
export class Background {
  private trees: BackgroundTree[] = [];
  private mountainPoints: number[] = [];

  constructor() {
    this.generateMountains();
    this.generateTrees();
  }

  private generateMountains(): void {
    // Generate a repeating mountain silhouette
    this.mountainPoints = [];
    let y = 50;
    for (let x = 0; x < GAME_WIDTH * 3; x += 4) {
      y += (Math.random() - 0.52) * 6;
      y = Math.max(20, Math.min(70, y));
      this.mountainPoints.push(y);
    }
  }

  private generateTrees(): void {
    // Scatter background trees
    for (let i = 0; i < 30; i++) {
      this.trees.push({
        x: Math.random() * GAME_WIDTH * 3,
        y: 30 + Math.random() * 40,
        variant: Math.random() < 0.5 ? 0 : 1,
        parallaxFactor: 0.2 + Math.random() * 0.3,
      });
    }
    this.trees.sort((a, b) => a.y - b.y); // Draw far trees first
  }

  render(ctx: CanvasRenderingContext2D, scrollX: number): void {
    // Sky
    ctx.fillStyle = COLORS.BLUE;
    ctx.fillRect(0, 0, GAME_WIDTH, 40);

    // Mountain silhouettes (parallax scrolling at 0.1x)
    const mOffset = Math.floor(scrollX * 0.1) % (GAME_WIDTH * 3);
    ctx.fillStyle = COLORS.PURPLE;
    ctx.beginPath();
    ctx.moveTo(0, HUD_Y);
    for (let x = 0; x < GAME_WIDTH; x++) {
      const idx = ((x + mOffset) % this.mountainPoints.length + this.mountainPoints.length) % this.mountainPoints.length;
      ctx.lineTo(x, this.mountainPoints[idx]);
    }
    ctx.lineTo(GAME_WIDTH, HUD_Y);
    ctx.closePath();
    ctx.fill();

    // Snow-covered slope area
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 60, GAME_WIDTH, HUD_Y - 60);

    // Draw background trees with parallax
    for (const tree of this.trees) {
      const tx = ((tree.x - scrollX * tree.parallaxFactor) % (GAME_WIDTH * 2) + GAME_WIDTH * 2) % (GAME_WIDTH * 2) - GAME_WIDTH * 0.5;
      if (tx >= -20 && tx <= GAME_WIDTH + 20) {
        drawSprite(ctx, TREE[tree.variant], tx, tree.y);
      }
    }
  }
}
