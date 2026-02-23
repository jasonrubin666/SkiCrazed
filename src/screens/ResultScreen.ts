import { GAME_WIDTH, GAME_HEIGHT, COLORS, MAX_FALLS } from '../data/Constants';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { drawTerrain, drawMountains, drawSprite, LODGE } from '../rendering/Sprites';

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
    // Blue sky background
    ctx.fillStyle = COLORS.BLUE;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // "Ski Crazed" banner with result
    const bannerText = this.qualified ? 'Ski Crazed  GOOD JOB!' :
      (this.result.disqualified ? 'Ski Crazed  OH NO!' : 'Ski Crazed  TRY AGAIN');
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 0, GAME_WIDTH, 16);
    ctx.fillStyle = this.qualified ? COLORS.GREEN : COLORS.ORANGE;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(bannerText, GAME_WIDTH / 2, 12);

    // Mountains in background
    drawMountains(ctx, 50, GAME_WIDTH);

    // Orange cross-hatched terrain
    drawTerrain(ctx, 0, 50, GAME_WIDTH, GAME_HEIGHT - 50);

    // Lodge at bottom right
    drawSprite(ctx, LODGE, GAME_WIDTH - LODGE.width - 8, GAME_HEIGHT - LODGE.height - 20);

    // Stats panel (dark overlay)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(15, 22, GAME_WIDTH - 30, 120);

    // Slope name
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.result.slopeNumber}. ${this.result.slopeName}`, GAME_WIDTH / 2, 34);

    // Performance bar (animated fill)
    const barX = 30;
    const barY = 42;
    const barW = GAME_WIDTH - 60;
    const barH = 14;
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
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.floor(this.performance * fillAmount)}%`, GAME_WIDTH / 2, barY + 12);

    // Stats
    const statsY = 72;
    const statLine = 12;
    ctx.font = '6px monospace';
    ctx.textAlign = 'left';

    ctx.fillStyle = COLORS.WHITE;
    ctx.fillText(`FALLS: ${this.result.falls}/${MAX_FALLS}`, 30, statsY);
    ctx.fillText(`MOGULS: ${this.result.mogulsPassed}/${this.result.mogulsTotal}`, 30, statsY + statLine);

    if (this.result.flagsTotal > 0) {
      ctx.fillText(`FLAGS: ${this.result.flagsPassed}/${this.result.flagsTotal}`, 30, statsY + statLine * 2);
    }

    ctx.fillText(`TRICKS: ${this.result.tricksLanded}`, 30, statsY + statLine * 3);

    // Qualification message
    if (this.animTimer > 60) {
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      if (this.result.disqualified) {
        ctx.fillStyle = COLORS.ORANGE;
        ctx.fillText('TOO MANY FALLS! TRY AGAIN.', GAME_WIDTH / 2, 126);
      } else if (this.qualified) {
        ctx.fillStyle = COLORS.GREEN;
        ctx.fillText('QUALIFIED! MOVING ON!', GAME_WIDTH / 2, 126);
      } else {
        ctx.fillStyle = COLORS.PURPLE;
        ctx.fillText('NOT ENOUGH. TRY AGAIN!', GAME_WIDTH / 2, 126);
      }

      ctx.fillStyle = COLORS.WHITE;
      ctx.font = '5px monospace';
      ctx.fillText('PRESS ENTER/TAP TO CONTINUE', GAME_WIDTH / 2, GAME_HEIGHT - 8);
    }
  }
}
