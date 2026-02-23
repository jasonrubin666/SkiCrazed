import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawSprite, JAMMER, SKIER_SKIING, SKIER_JUMPING, SKIER_TRICK_BACKSCRATCHER, SKIER_TRICK_DAFFY, SpriteData } from '../rendering/Sprites';
import { drawText, drawTextCentered, CHAR_H } from '../rendering/BitmapFont';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';

interface Lesson {
  title: string;
  text: string[];
  sprite?: SpriteData;
}

const LESSONS: Lesson[] = [
  {
    title: 'WELCOME!',
    text: [
      "I'M JAMMER, YOUR SKI PRO!",
      "I'LL TEACH YOU TO SKI THE",
      'MOUNT KILIMANJARO TOURNAMENT.',
      '',
      'PRESS ENTER OR TAP TO CONTINUE.',
    ],
  },
  {
    title: 'BASIC MOVEMENT',
    text: [
      'USE UP/DOWN ARROWS OR TOUCH',
      'THE RIGHT SIDE OF SCREEN TO',
      'MOVE YOUR SKIER UP AND DOWN.',
      '',
      'THIS IS HOW YOU DODGE HAZARDS!',
    ],
    sprite: SKIER_SKIING[0],
  },
  {
    title: 'MOGULS',
    text: [
      'MOGULS ARE BUMPS ON THE SLOPE.',
      'LOOK FOR THE ARROW INDICATOR:',
      'MOVE UP OR DOWN AS SHOWN TO',
      'PASS SAFELY. WRONG MOVE = FALL!',
    ],
  },
  {
    title: 'JUMPS',
    text: [
      'SMALL JUMPS ARE AUTOMATIC.',
      'LARGE JUMPS LAUNCH YOU HIGH!',
      'WATCH OUT: ICE PATCHES APPEAR',
      'AFTER LARGE JUMPS.',
    ],
    sprite: SKIER_JUMPING,
  },
  {
    title: 'TRICKS',
    text: [
      'WHILE IN THE AIR, DO A TRICK',
      'TO STAY AIRBORNE LONGER AND',
      'CLEAR THE ICE!',
      'Z/LEFT-TOP = BACK SCRATCHER',
      'X/LEFT-BOT = DAFFY',
    ],
    sprite: SKIER_TRICK_BACKSCRATCHER,
  },
  {
    title: 'SLALOM FLAGS',
    text: [
      'RED FLAGS: PASS BELOW THEM.',
      'BLUE FLAGS: PASS ABOVE THEM.',
      'WRONG SIDE = CRASH!',
    ],
  },
  {
    title: 'WARNING SIGNS',
    text: [
      'SIGNS WARN OF UPCOMING HAZARDS.',
      'BUT BEWARE: ON HARDER SLOPES,',
      'SIGNS MAY LIE!',
    ],
  },
  {
    title: 'PERFORMANCE',
    text: [
      'YOUR GOAL IS A HIGH PERCENTAGE',
      'ON THE PERFORMANCE CHART.',
      '50% OR HIGHER = QUALIFIED!',
      '15 FALLS = DISQUALIFIED!',
      '',
      'GOOD LUCK ON THE MOUNTAIN!',
    ],
  },
];

export class LessonScreen {
  private lessonIndex = 0;
  private animTimer = 0;

  update(input: InputState, audio: AudioManager): 'done' | null {
    this.animTimer++;

    if (input.confirm && this.animTimer > 20) {
      this.animTimer = 0;
      this.lessonIndex++;
      audio.menuSelect();

      if (this.lessonIndex >= LESSONS.length) {
        return 'done';
      }
    }
    if (input.back) {
      return 'done';
    }

    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const lesson = LESSONS[this.lessonIndex];

    // Jammer sprite
    drawSprite(ctx, JAMMER, 20, 30);

    // Speech bubble area (pixel-perfect box)
    ctx.fillStyle = COLORS.WHITE;
    // Top and bottom edges
    ctx.fillRect(45, 15, GAME_WIDTH - 55, 1);
    ctx.fillRect(45, 85, GAME_WIDTH - 55, 1);
    // Left and right edges
    ctx.fillRect(45, 15, 1, 71);
    ctx.fillRect(GAME_WIDTH - 11, 15, 1, 71);

    // Title
    drawText(ctx, lesson.title, 50, 20, COLORS.GREEN);

    // Text
    lesson.text.forEach((line, i) => {
      drawText(ctx, line, 50, 32 + i * (CHAR_H + 2), COLORS.WHITE);
    });

    // Optional sprite demo
    if (lesson.sprite) {
      drawSprite(ctx, lesson.sprite, GAME_WIDTH / 2 - 3, 100);
    }

    // Progress indicator
    drawTextCentered(ctx, `LESSON ${this.lessonIndex + 1}/${LESSONS.length}`, GAME_HEIGHT - 22, COLORS.PURPLE);
    drawTextCentered(ctx, 'ENTER/TAP = NEXT - ESC = SKIP', GAME_HEIGHT - 8, COLORS.BLUE);
  }
}
