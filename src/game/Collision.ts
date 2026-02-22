import { Skier } from './Skier';
import { ActiveObstacle } from './Slope';
import { AudioManager } from '../audio/AudioManager';
import { SKIER_X } from '../data/Constants';

export interface CollisionResult {
  fell: boolean;
  trickSucceeded: boolean;
  flagPassed: boolean;
}

const HITBOX_HALF_W = 5;
const HITBOX_HALF_H = 8;

/**
 * Check and resolve collisions between the skier and nearby obstacles.
 */
export function checkCollisions(
  skier: Skier,
  obstacles: ActiveObstacle[],
  audio: AudioManager,
  isMovingUp: boolean,
  isMovingDown: boolean,
): CollisionResult {
  const result: CollisionResult = { fell: false, trickSucceeded: false, flagPassed: false };

  for (const obs of obstacles) {
    if (obs.passed) continue;

    // Check if skier is overlapping this obstacle horizontally
    const dx = Math.abs(obs.screenX - SKIER_X);
    if (dx > HITBOX_HALF_W + 6) continue;

    // Check vertical overlap
    const dy = Math.abs(obs.y - skier.y);

    switch (obs.type) {
      case 'mogul_small':
      case 'mogul_large': {
        if (dy > HITBOX_HALF_H + 4) continue;
        obs.passed = true;

        if (skier.isAirborne) {
          // Sail over mogul
          audio.mogulPass();
          break;
        }

        // Check if player is moving in the correct direction
        const correctMove =
          (obs.passDirection === 'up' && isMovingUp) ||
          (obs.passDirection === 'down' && isMovingDown);

        if (correctMove) {
          audio.mogulPass();
        } else {
          audio.mogulFail();
          skier.crash();
          result.fell = true;
        }
        break;
      }

      case 'jump_small':
      case 'jump_large': {
        if (dy > HITBOX_HALF_H + 4) continue;
        if (skier.isAirborne || skier.isCrashing) {
          obs.passed = true;
          break;
        }
        obs.passed = true;
        audio.jump();
        skier.startJump();
        // Large jumps give more air
        if (obs.type === 'jump_large') {
          skier.vy *= 1.5;
        }
        break;
      }

      case 'ice': {
        if (dy > HITBOX_HALF_H + 3) continue;
        obs.passed = true;

        if (skier.isAirborne) {
          // Sailed over ice — success!
          result.trickSucceeded = true;
          break;
        }

        if (skier.isInvincible) break;

        // Landed on ice — crash!
        audio.iceSlide();
        audio.crash();
        skier.crash();
        result.fell = true;
        break;
      }

      case 'flag_red':
      case 'flag_blue': {
        if (dy > HITBOX_HALF_H + 4) continue;
        obs.passed = true;

        // Check if skier passed on the correct side
        const correctPass =
          (obs.passDirection === 'up' && skier.y < obs.y) ||
          (obs.passDirection === 'down' && skier.y > obs.y);

        if (correctPass || skier.isAirborne) {
          audio.flagPass();
          result.flagPassed = true;
        } else {
          audio.mogulFail();
          skier.crash();
          result.fell = true;
        }
        break;
      }

      case 'sign': {
        // Signs don't cause collisions, just pass through
        if (dx < 3) {
          obs.passed = true;
        }
        break;
      }
    }
  }

  return result;
}
