import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { drawSprite, JAMMER, SKIER_SKIING, SKIER_JUMPING, SKIER_TRICK_BACKSCRATCHER, SKIER_TRICK_DAFFY, SpriteData } from '../rendering/Sprites';
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

    // Speech bubble area
    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 15, GAME_WIDTH - 55, 70);

    // Title
    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '7px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(lesson.title, 50, 28);

    // Text
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '5px monospace';
    lesson.text.forEach((line, i) => {
      ctx.fillText(line, 50, 40 + i * 9);
    });

    // Optional sprite demo
    if (lesson.sprite) {
      drawSprite(ctx, lesson.sprite, GAME_WIDTH / 2 - 3, 100);
    }

    // Progress indicator
    ctx.fillStyle = COLORS.PURPLE;
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`LESSON ${this.lessonIndex + 1}/${LESSONS.length}`, GAME_WIDTH / 2, GAME_HEIGHT - 20);

    ctx.fillStyle = COLORS.BLUE;
    ctx.fillText('ENTER/TAP TO CONTINUE  -  ESC TO SKIP', GAME_WIDTH / 2, GAME_HEIGHT - 8);
  }
}
