import { GAME_WIDTH, GAME_HEIGHT, COLORS, MAX_FALLS } from '../data/Constants';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';

export interface SlopeResult {
  slopeName: string;
  slopeNumber: number;
  falls: number;
  mogulsPassed: number;
  mogulsTotal: number;
  flagsPassed: number;
  flagsTotal: number;
  tricksLanded: number;
  disqualified: boolean;
}

function calculatePerformance(result: SlopeResult): number {
  if (result.disqualified) return 0;

  let score = 100;

  // Penalty for falls
  score -= result.falls * 5;

  // Bonus for moguls passed correctly
  if (result.mogulsTotal > 0) {
    score *= (0.5 + 0.5 * (result.mogulsPassed / result.mogulsTotal));
  }

  // Bonus for flags
  if (result.flagsTotal > 0) {
    score *= (0.5 + 0.5 * (result.flagsPassed / result.flagsTotal));
  }

  // Bonus for tricks
  score += result.tricksLanded * 3;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export class ResultScreen {
  private performance: number;
  private qualified: boolean;
  private animTimer = 0;
  private soundPlayed = false;

  constructor(private result: SlopeResult) {
    this.performance = calculatePerformance(result);
    this.qualified = this.performance >= 50 && !result.disqualified;
  }

  getPerformance(): number {
    return this.performance;
  }

  isQualified(): boolean {
    return this.qualified;
  }

  update(input: InputState, audio: AudioManager): 'continue' | 'retry' | null {
    this.animTimer++;

    if (!this.soundPlayed && this.animTimer > 30) {
      this.soundPlayed = true;
      if (this.qualified) {
        audio.levelComplete();
      } else {
        audio.disqualified();
      }
    }

    if (this.animTimer < 60) return null; // wait before accepting input

    if (input.confirm) {
      audio.menuSelect();
      return this.qualified ? 'continue' : 'retry';
    }
    if (input.back) {
      audio.menuSelect();
      return 'continue'; // go back to slope select
    }

    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    ctx.fillStyle = this.qualified ? COLORS.GREEN : COLORS.ORANGE;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      this.result.disqualified ? 'DISQUALIFIED!' : 'PERFORMANCE CHART',
      GAME_WIDTH / 2, 16
    );

    // Slope name
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '6px monospace';
    ctx.fillText(`${this.result.slopeNumber}. ${this.result.slopeName}`, GAME_WIDTH / 2, 28);

    // Performance bar (animated fill)
    const barX = 40;
    const barY = 40;
    const barW = GAME_WIDTH - 80;
    const barH = 16;
    const fillAmount = Math.min(1, this.animTimer / 90);
    const fillW = Math.floor(barW * (this.performance / 100) * fillAmount);

    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    const barColor = this.performance >= 70 ? COLORS.GREEN :
      (this.performance >= 50 ? COLORS.ORANGE : COLORS.PURPLE);
    ctx.fillStyle = barColor;
    ctx.fillRect(barX + 1, barY + 1, fillW, barH - 2);

    // Percentage text
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.floor(this.performance * fillAmount)}%`, GAME_WIDTH / 2, barY + 13);

    // Stats
    const statsY = 72;
    const statLine = 12;
    ctx.font = '6px monospace';
    ctx.textAlign = 'left';

    ctx.fillStyle = COLORS.WHITE;
    ctx.fillText(`FALLS: ${this.result.falls}/${MAX_FALLS}`, 40, statsY);

    ctx.fillText(`MOGULS: ${this.result.mogulsPassed}/${this.result.mogulsTotal}`, 40, statsY + statLine);

    if (this.result.flagsTotal > 0) {
      ctx.fillText(`FLAGS: ${this.result.flagsPassed}/${this.result.flagsTotal}`, 40, statsY + statLine * 2);
    }

    ctx.fillText(`TRICKS: ${this.result.tricksLanded}`, 40, statsY + statLine * 3);

    // Qualification message
    if (this.animTimer > 60) {
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      if (this.result.disqualified) {
        ctx.fillStyle = COLORS.ORANGE;
        ctx.fillText('TOO MANY FALLS! TRY AGAIN.', GAME_WIDTH / 2, 140);
      } else if (this.qualified) {
        ctx.fillStyle = COLORS.GREEN;
        ctx.fillText('QUALIFIED! MOVING ON!', GAME_WIDTH / 2, 140);
      } else {
        ctx.fillStyle = COLORS.PURPLE;
        ctx.fillText('NOT ENOUGH. TRY AGAIN!', GAME_WIDTH / 2, 140);
      }

      ctx.fillStyle = COLORS.BLUE;
      ctx.font = '5px monospace';
      ctx.fillText('PRESS ENTER/TAP TO CONTINUE', GAME_WIDTH / 2, GAME_HEIGHT - 10);
    }
  }
}
