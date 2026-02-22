import { COLORS } from '../data/Constants';

/**
 * Renders semi-transparent touch control overlays on mobile devices.
 * These are drawn directly onto the game canvas over the game content.
 */
export class TouchControls {
  private visible = true;
  private opacity = 0.25;

  constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number) {}

  setVisible(v: boolean): void {
    this.visible = v;
  }

  render(): void {
    if (!this.visible) return;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Left side: trick buttons
    // Upper-left: Trick 1 (Back Scratcher)
    ctx.strokeStyle = COLORS.ORANGE;
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, w * 0.24, h * 0.48);
    ctx.fillStyle = COLORS.ORANGE;
    ctx.font = '6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TRICK1', w * 0.12, h * 0.25);

    // Lower-left: Trick 2 (Daffy)
    ctx.strokeStyle = COLORS.PURPLE;
    ctx.strokeRect(2, h * 0.52, w * 0.24, h * 0.46);
    ctx.fillStyle = COLORS.PURPLE;
    ctx.fillText('TRICK2', w * 0.12, h * 0.75);

    // Right side: movement arrows
    // Up zone
    ctx.strokeStyle = COLORS.GREEN;
    ctx.strokeRect(w * 0.42, 2, w * 0.56, h * 0.38);
    ctx.fillStyle = COLORS.GREEN;
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.08);
    ctx.lineTo(w * 0.67, h * 0.18);
    ctx.lineTo(w * 0.73, h * 0.18);
    ctx.closePath();
    ctx.fill();

    // Down zone
    ctx.strokeStyle = COLORS.BLUE;
    ctx.strokeRect(w * 0.42, h * 0.62, w * 0.56, h * 0.36);
    ctx.fillStyle = COLORS.BLUE;
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.92);
    ctx.lineTo(w * 0.67, h * 0.82);
    ctx.lineTo(w * 0.73, h * 0.82);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
