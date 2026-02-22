import { SlopeDef, ObstacleDef } from './SlopeData';
import { GAME_WIDTH, BASE_SCROLL_SPEED } from '../data/Constants';
import {
  MOGUL_SMALL, MOGUL_LARGE, JUMP_SMALL, JUMP_LARGE,
  ICE_PATCH, FLAG_RED, FLAG_BLUE, WARNING_SIGN,
  drawSprite, SpriteData
} from '../rendering/Sprites';

export interface ActiveObstacle extends ObstacleDef {
  passed: boolean;
  screenX: number;
}

const SPRITE_MAP: Record<string, SpriteData> = {
  mogul_small: MOGUL_SMALL,
  mogul_large: MOGUL_LARGE,
  jump_small: JUMP_SMALL,
  jump_large: JUMP_LARGE,
  ice: ICE_PATCH,
  flag_red: FLAG_RED,
  flag_blue: FLAG_BLUE,
  sign: WARNING_SIGN,
};

export class Slope {
  readonly def: SlopeDef;
  scrollX = 0;
  speed: number;
  active: ActiveObstacle[] = [];
  finished = false;

  constructor(def: SlopeDef) {
    this.def = def;
    this.speed = BASE_SCROLL_SPEED * def.baseSpeed;

    // Initialize all obstacles
    this.active = def.obstacles.map((o) => ({
      ...o,
      passed: false,
      screenX: o.x,
    }));
  }

  get progress(): number {
    return Math.min(1, this.scrollX / this.def.length);
  }

  update(): void {
    if (this.finished) return;
    this.scrollX += this.speed;

    if (this.scrollX >= this.def.length) {
      this.finished = true;
    }

    // Update screen positions
    for (const obs of this.active) {
      obs.screenX = obs.x - this.scrollX;
    }
  }

  /** Get obstacles currently near the skier (for collision) */
  getVisibleObstacles(): ActiveObstacle[] {
    return this.active.filter(
      (o) => o.screenX > -20 && o.screenX < GAME_WIDTH + 20
    );
  }

  /** Get obstacles near the skier's X position for collision checks */
  getCollidableObstacles(skierX: number): ActiveObstacle[] {
    return this.active.filter(
      (o) => !o.passed && Math.abs(o.screenX - skierX) < 12
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    const visible = this.getVisibleObstacles();

    for (const obs of visible) {
      const sprite = SPRITE_MAP[obs.type];
      if (!sprite) continue;

      // Draw obstacle
      drawSprite(
        ctx,
        sprite,
        Math.floor(obs.screenX - sprite.width / 2),
        Math.floor(obs.y - sprite.height / 2)
      );

      // Draw direction indicator for moguls and flags (small arrow)
      if (obs.passDirection && !obs.passed && obs.type !== 'sign') {
        ctx.fillStyle = obs.passDirection === 'up' ? '#14B81A' : '#0078F0';
        const arrowY = obs.y - sprite.height / 2 - 6;
        const arrowX = obs.screenX;
        if (obs.passDirection === 'up') {
          // Up arrow
          ctx.fillRect(Math.floor(arrowX) - 1, Math.floor(arrowY), 3, 1);
          ctx.fillRect(Math.floor(arrowX), Math.floor(arrowY) - 1, 1, 1);
        } else {
          // Down arrow
          ctx.fillRect(Math.floor(arrowX) - 1, Math.floor(arrowY), 3, 1);
          ctx.fillRect(Math.floor(arrowX), Math.floor(arrowY) + 1, 1, 1);
        }
      }
    }
  }
}
