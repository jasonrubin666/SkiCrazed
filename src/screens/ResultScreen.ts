import { GAME_WIDTH, GAME_HEIGHT, COLORS, MAX_FALLS } from '../data/Constants';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { drawTerrain, drawMountains, drawSprite, LODGE } from '../rendering/Sprites';
import { drawText, drawTextCentered, CHAR_H } from '../rendering/BitmapFont';

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

    // "SKI CRAZED" banner with result
    const bannerText = this.qualified ? 'SKI CRAZED  GOOD JOB!' :
      (this.result.disqualified ? 'SKI CRAZED  OH NO!' : 'SKI CRAZED  TRY AGAIN');
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 0, GAME_WIDTH, 16);
    drawTextCentered(ctx, bannerText, 4, this.qualified ? COLORS.GREEN : COLORS.ORANGE);

    // Mountains in background
    drawMountains(ctx, 50, GAME_WIDTH);

    // Orange cross-hatched terrain
    drawTerrain(ctx, 0, 50, GAME_WIDTH, GAME_HEIGHT - 50);

    // Lodge at bottom right
    drawSprite(ctx, LODGE, GAME_WIDTH - LODGE.width - 8, GAME_HEIGHT - LODGE.height - 20);

    // Stats panel (solid black — no transparency on Apple IIe)
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(15, 22, GAME_WIDTH - 30, 120);

    // Slope name
    drawTextCentered(ctx, `${this.result.slopeNumber}. ${this.result.slopeName}`, 26, COLORS.WHITE);

    // Performance bar (animated fill)
    const barX = 30;
    const barY = 40;
    const barW = GAME_WIDTH - 60;
    const barH = 14;
    const fillAmount = Math.min(1, this.animTimer / 90);
    const fillW = Math.floor(barW * (this.performance / 100) * fillAmount);

    // Bar border (pixel-perfect)
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(barX, barY, barW, 1);
    ctx.fillRect(barX, barY + barH, barW, 1);
    ctx.fillRect(barX, barY, 1, barH);
    ctx.fillRect(barX + barW - 1, barY, 1, barH);

    const barColor = this.performance >= 70 ? COLORS.GREEN :
      (this.performance >= 50 ? COLORS.ORANGE : COLORS.PURPLE);
    ctx.fillStyle = barColor;
    ctx.fillRect(barX + 1, barY + 1, fillW, barH - 2);

    // Percentage text
    drawTextCentered(ctx, `${Math.floor(this.performance * fillAmount)}%`, barY + 3, COLORS.WHITE);

    // Stats
    const statsY = 64;
    const statLine = CHAR_H + 4;

    drawText(ctx, `FALLS: ${this.result.falls}/${MAX_FALLS}`, 30, statsY, COLORS.WHITE);
    drawText(ctx, `MOGULS: ${this.result.mogulsPassed}/${this.result.mogulsTotal}`, 30, statsY + statLine, COLORS.WHITE);

    if (this.result.flagsTotal > 0) {
      drawText(ctx, `FLAGS: ${this.result.flagsPassed}/${this.result.flagsTotal}`, 30, statsY + statLine * 2, COLORS.WHITE);
    }

    drawText(ctx, `TRICKS: ${this.result.tricksLanded}`, 30, statsY + statLine * 3, COLORS.WHITE);

    // Qualification message
    if (this.animTimer > 60) {
      if (this.result.disqualified) {
        drawTextCentered(ctx, 'TOO MANY FALLS! TRY AGAIN.', 122, COLORS.ORANGE);
      } else if (this.qualified) {
        drawTextCentered(ctx, 'QUALIFIED! MOVING ON!', 122, COLORS.GREEN);
      } else {
        drawTextCentered(ctx, 'NOT ENOUGH. TRY AGAIN!', 122, COLORS.PURPLE);
      }

      drawTextCentered(ctx, 'PRESS ENTER/TAP TO CONTINUE', GAME_HEIGHT - 8, COLORS.WHITE);
    }
  }
}
