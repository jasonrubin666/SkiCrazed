import { SKIER_Y_MIN, SKIER_Y_MAX, SKIER_X, SKIER_MOVE_SPEED, GRAVITY, JUMP_VELOCITY, TRICK_AIR_EXTENSION } from '../data/Constants';
import {
  SKIER_SKIING, SKIER_JUMPING, SKIER_TRICK_BACKSCRATCHER,
  SKIER_TRICK_DAFFY, SKIER_CRASH, SKIER_STANDING, drawSprite, SpriteData
} from '../rendering/Sprites';

export type SkierState = 'skiing' | 'jumping' | 'trick_bs' | 'trick_daffy' | 'crashing' | 'standing' | 'crashed';

export class Skier {
  x = SKIER_X;
  y = 110;
  vy = 0; // Vertical velocity (for jumping)
  airborneY = 0; // Visual offset when jumping (negative = up)
  state: SkierState = 'standing';
  animFrame = 0;
  animTimer = 0;
  crashTimer = 0;
  invincibleTimer = 0; // Brief invincibility after crash

  private readonly CRASH_DURATION = 60; // frames
  private readonly INVINCIBLE_DURATION = 30;

  get isAirborne(): boolean {
    return this.state === 'jumping' || this.state === 'trick_bs' || this.state === 'trick_daffy';
  }

  get isCrashing(): boolean {
    return this.state === 'crashing' || this.state === 'crashed';
  }

  get isInvincible(): boolean {
    return this.invincibleTimer > 0;
  }

  get hitboxY(): number {
    return this.y + this.airborneY;
  }

  moveUp(): void {
    if (this.isCrashing) return;
    if (this.isAirborne) return;
    this.y = Math.max(SKIER_Y_MIN, this.y - SKIER_MOVE_SPEED);
    this.state = 'skiing';
  }

  moveDown(): void {
    if (this.isCrashing) return;
    if (this.isAirborne) return;
    this.y = Math.min(SKIER_Y_MAX, this.y + SKIER_MOVE_SPEED);
    this.state = 'skiing';
  }

  startJump(): void {
    if (this.isCrashing || this.isAirborne) return;
    this.state = 'jumping';
    this.vy = JUMP_VELOCITY;
    this.airborneY = 0;
  }

  doTrick(type: 'bs' | 'daffy'): boolean {
    if (!this.isAirborne) return false;
    if (this.state === 'trick_bs' || this.state === 'trick_daffy') return false;
    this.state = type === 'bs' ? 'trick_bs' : 'trick_daffy';
    return true;
  }

  crash(): void {
    if (this.isInvincible) return;
    this.state = 'crashing';
    this.crashTimer = this.CRASH_DURATION;
    this.airborneY = 0;
    this.vy = 0;
  }

  update(): void {
    // Animation
    this.animTimer++;
    if (this.animTimer >= 10) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }

    // Invincibility countdown
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
    }

    // Crash recovery
    if (this.state === 'crashing') {
      this.crashTimer--;
      if (this.crashTimer <= 0) {
        this.state = 'skiing';
        this.invincibleTimer = this.INVINCIBLE_DURATION;
      }
      return;
    }

    // Airborne physics
    if (this.isAirborne) {
      const gravityMod = (this.state === 'trick_bs' || this.state === 'trick_daffy')
        ? TRICK_AIR_EXTENSION
        : 1.0;
      this.vy += GRAVITY * gravityMod;
      this.airborneY += this.vy;

      // Landed
      if (this.airborneY >= 0) {
        this.airborneY = 0;
        this.vy = 0;
        this.state = 'skiing';
      }
    }

    // If not moving and on ground, default to skiing
    if (!this.isAirborne && !this.isCrashing && this.state === 'standing') {
      this.state = 'skiing';
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Blink when invincible
    if (this.isInvincible && Math.floor(this.invincibleTimer / 3) % 2 === 0) return;

    const drawY = this.y + this.airborneY;
    let sprite: SpriteData;

    switch (this.state) {
      case 'skiing':
        sprite = SKIER_SKIING[this.animFrame % SKIER_SKIING.length];
        break;
      case 'jumping':
        sprite = SKIER_JUMPING;
        break;
      case 'trick_bs':
        sprite = SKIER_TRICK_BACKSCRATCHER;
        break;
      case 'trick_daffy':
        sprite = SKIER_TRICK_DAFFY;
        break;
      case 'crashing':
        sprite = SKIER_CRASH[Math.min(Math.floor((this.CRASH_DURATION - this.crashTimer) / 20), SKIER_CRASH.length - 1)];
        break;
      case 'crashed':
        sprite = SKIER_CRASH[SKIER_CRASH.length - 1];
        break;
      case 'standing':
      default:
        sprite = SKIER_STANDING;
        break;
    }

    drawSprite(ctx, sprite, this.x - Math.floor(sprite.width / 2), drawY - Math.floor(sprite.height / 2));

    // Draw shadow on ground when airborne
    if (this.isAirborne) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(this.x - 3, this.y + 2, 7, 2);
    }
  }
}
