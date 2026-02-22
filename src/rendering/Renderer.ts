import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';

/**
 * Core renderer that manages the scaled Canvas.
 * Renders at 280x192 internal resolution and scales to fill screen.
 */
export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    // Set internal resolution
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;

    // Disable smoothing for crisp pixels
    this.ctx.imageSmoothingEnabled = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Calculate scale to fill screen while maintaining aspect ratio
    const scaleX = screenW / GAME_WIDTH;
    const scaleY = screenH / GAME_HEIGHT;
    this.scale = Math.floor(Math.min(scaleX, scaleY));
    if (this.scale < 1) this.scale = 1;
    // Allow non-integer scale for very small screens (phones)
    if (this.scale < 2) {
      this.scale = Math.min(scaleX, scaleY);
    }

    const displayW = Math.floor(GAME_WIDTH * this.scale);
    const displayH = Math.floor(GAME_HEIGHT * this.scale);
    this.offsetX = Math.floor((screenW - displayW) / 2);
    this.offsetY = Math.floor((screenH - displayH) / 2);

    // Style the canvas to the display size
    this.canvas.style.width = displayW + 'px';
    this.canvas.style.height = displayH + 'px';
    this.canvas.style.marginLeft = this.offsetX + 'px';
    this.canvas.style.marginTop = this.offsetY + 'px';

    // Keep internal resolution the same
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(): void {
    this.ctx.fillStyle = COLORS.BLACK;
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  getScale(): number {
    return this.scale;
  }
}
