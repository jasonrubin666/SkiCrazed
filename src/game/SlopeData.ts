/**
 * Obstacle types that can appear on a slope.
 */
export type ObstacleType =
  | 'mogul_small'
  | 'mogul_large'
  | 'jump_small'
  | 'jump_large'
  | 'ice'
  | 'flag_red'
  | 'flag_blue'
  | 'sign';

/**
 * An obstacle placed on a slope.
 * x = distance from slope start (scrolling coordinate)
 * y = vertical position on the slope
 * passDirection = which way the player should go ('up' | 'down') for moguls/flags
 */
export interface ObstacleDef {
  type: ObstacleType;
  x: number;
  y: number;
  passDirection?: 'up' | 'down';
  signWarning?: string; // For signs: what they warn about
  reliable?: boolean;   // For signs: whether the warning is accurate
}

export interface SlopeDef {
  name: string;
  number: number;
  type: 'downhill' | 'slalom';
  length: number;       // Total scrollable length in pixels
  baseSpeed: number;    // Speed multiplier
  obstacles: ObstacleDef[];
}

/**
 * Generate obstacles for a slope procedurally based on difficulty parameters.
 */
function generateSlope(
  name: string,
  number: number,
  type: 'downhill' | 'slalom',
  length: number,
  baseSpeed: number,
  config: {
    mogulSmallCount: number;
    mogulLargeCount: number;
    jumpSmallCount: number;
    jumpLargeCount: number;
    flagCount: number;
    signReliability: number; // 0–1, how often signs tell the truth
  }
): SlopeDef {
  const obstacles: ObstacleDef[] = [];
  const minGap = 50;
  const usedPositions: number[] = [];

  function placeX(): number {
    let x: number;
    let attempts = 0;
    do {
      x = 100 + Math.floor(Math.random() * (length - 200));
      attempts++;
    } while (usedPositions.some((px) => Math.abs(px - x) < minGap) && attempts < 100);
    usedPositions.push(x);
    return x;
  }

  function randY(): number {
    return 70 + Math.floor(Math.random() * 80);
  }

  // Place small moguls
  for (let i = 0; i < config.mogulSmallCount; i++) {
    const dir = Math.random() < 0.5 ? 'up' : 'down';
    const x = placeX();
    obstacles.push({ type: 'mogul_small', x, y: randY(), passDirection: dir });
    // Maybe add a warning sign before it
    if (Math.random() < 0.5) {
      const reliable = Math.random() < config.signReliability;
      obstacles.push({
        type: 'sign',
        x: x - 40,
        y: randY(),
        signWarning: 'mogul',
        reliable,
      });
    }
  }

  // Place large moguls
  for (let i = 0; i < config.mogulLargeCount; i++) {
    const dir = Math.random() < 0.5 ? 'up' : 'down';
    const x = placeX();
    obstacles.push({ type: 'mogul_large', x, y: randY(), passDirection: dir });
  }

  // Place small jumps
  for (let i = 0; i < config.jumpSmallCount; i++) {
    obstacles.push({ type: 'jump_small', x: placeX(), y: 120 + Math.floor(Math.random() * 30) });
  }

  // Place large jumps (with ice after them)
  for (let i = 0; i < config.jumpLargeCount; i++) {
    const x = placeX();
    obstacles.push({ type: 'jump_large', x, y: 110 + Math.floor(Math.random() * 30) });
    obstacles.push({ type: 'ice', x: x + 50, y: 110 + Math.floor(Math.random() * 30) });
    // Warning sign
    if (Math.random() < 0.6) {
      const reliable = Math.random() < config.signReliability;
      obstacles.push({
        type: 'sign',
        x: x - 45,
        y: randY(),
        signWarning: 'jump+ice',
        reliable,
      });
    }
  }

  // Place flags (for slalom or mixed)
  for (let i = 0; i < config.flagCount; i++) {
    const isRed = Math.random() < 0.5;
    obstacles.push({
      type: isRed ? 'flag_red' : 'flag_blue',
      x: placeX(),
      y: randY(),
      passDirection: isRed ? 'down' : 'up',
    });
  }

  // Sort by x position
  obstacles.sort((a, b) => a.x - b.x);

  return { name, number, type, length, baseSpeed, obstacles };
}

/**
 * All 15 official slopes, with escalating difficulty.
 */
export function getAllSlopes(): SlopeDef[] {
  return [
    // --- DOWNHILL SLOPES 1–12 ---
    generateSlope('Bunny Hill', 1, 'downhill', 800, 1.0, {
      mogulSmallCount: 4, mogulLargeCount: 0, jumpSmallCount: 1, jumpLargeCount: 0,
      flagCount: 0, signReliability: 1.0,
    }),
    generateSlope('Green Meadow', 2, 'downhill', 1000, 1.05, {
      mogulSmallCount: 5, mogulLargeCount: 1, jumpSmallCount: 2, jumpLargeCount: 0,
      flagCount: 0, signReliability: 1.0,
    }),
    generateSlope('Pine Trail', 3, 'downhill', 1100, 1.1, {
      mogulSmallCount: 5, mogulLargeCount: 2, jumpSmallCount: 2, jumpLargeCount: 1,
      flagCount: 0, signReliability: 0.95,
    }),
    generateSlope('Snowdrift', 4, 'downhill', 1200, 1.15, {
      mogulSmallCount: 6, mogulLargeCount: 3, jumpSmallCount: 2, jumpLargeCount: 1,
      flagCount: 2, signReliability: 0.9,
    }),
    generateSlope('Frozen Creek', 5, 'downhill', 1300, 1.2, {
      mogulSmallCount: 6, mogulLargeCount: 4, jumpSmallCount: 3, jumpLargeCount: 2,
      flagCount: 2, signReliability: 0.85,
    }),
    generateSlope('Timber Ridge', 6, 'downhill', 1400, 1.25, {
      mogulSmallCount: 7, mogulLargeCount: 4, jumpSmallCount: 3, jumpLargeCount: 2,
      flagCount: 3, signReliability: 0.8,
    }),
    generateSlope('Avalanche Alley', 7, 'downhill', 1500, 1.3, {
      mogulSmallCount: 7, mogulLargeCount: 5, jumpSmallCount: 3, jumpLargeCount: 3,
      flagCount: 3, signReliability: 0.7,
    }),
    generateSlope('Ice Canyon', 8, 'downhill', 1600, 1.35, {
      mogulSmallCount: 8, mogulLargeCount: 5, jumpSmallCount: 4, jumpLargeCount: 3,
      flagCount: 4, signReliability: 0.65,
    }),
    generateSlope('Black Diamond', 9, 'downhill', 1700, 1.4, {
      mogulSmallCount: 8, mogulLargeCount: 6, jumpSmallCount: 4, jumpLargeCount: 4,
      flagCount: 4, signReliability: 0.55,
    }),
    generateSlope('Devils Descent', 10, 'downhill', 1800, 1.45, {
      mogulSmallCount: 9, mogulLargeCount: 7, jumpSmallCount: 5, jumpLargeCount: 4,
      flagCount: 5, signReliability: 0.45,
    }),
    generateSlope('Whiteout', 11, 'downhill', 1900, 1.5, {
      mogulSmallCount: 10, mogulLargeCount: 7, jumpSmallCount: 5, jumpLargeCount: 5,
      flagCount: 5, signReliability: 0.35,
    }),
    generateSlope('Summit Plunge', 12, 'downhill', 2000, 1.55, {
      mogulSmallCount: 10, mogulLargeCount: 8, jumpSmallCount: 6, jumpLargeCount: 5,
      flagCount: 6, signReliability: 0.25,
    }),

    // --- SLALOM SLOPES 13–14 ---
    generateSlope('Slalom Sprint', 13, 'slalom', 1500, 1.3, {
      mogulSmallCount: 3, mogulLargeCount: 2, jumpSmallCount: 1, jumpLargeCount: 1,
      flagCount: 15, signReliability: 0.5,
    }),
    generateSlope('Giant Slalom', 14, 'slalom', 1800, 1.4, {
      mogulSmallCount: 4, mogulLargeCount: 3, jumpSmallCount: 2, jumpLargeCount: 2,
      flagCount: 20, signReliability: 0.3,
    }),

    // --- FINAL SLOPE ---
    generateSlope('Ohh La La', 15, 'downhill', 2200, 1.6, {
      mogulSmallCount: 12, mogulLargeCount: 10, jumpSmallCount: 6, jumpLargeCount: 6,
      flagCount: 8, signReliability: 0.15,
    }),
  ];
}
