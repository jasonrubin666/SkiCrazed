import { FIXED_DT, MAX_FALLS } from '../data/Constants';
import { Renderer } from '../rendering/Renderer';
import { Background } from '../rendering/Background';
import { HUD } from '../rendering/HUD';
import { TouchControls } from '../input/TouchControls';
import { InputManager } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { Skier } from './Skier';
import { Slope } from './Slope';
import { checkCollisions } from './Collision';
import { getAllSlopes, SlopeDef } from './SlopeData';
import { TitleScreen, TitleMenuOption } from '../screens/TitleScreen';
import { SlopeSelect } from '../screens/SlopeSelect';
import { ResultScreen, SlopeResult } from '../screens/ResultScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { EditorScreen } from '../screens/EditorScreen';
import { SaveData, loadProgress, saveProgress } from '../data/Storage';

type GameState = 'title' | 'lessons' | 'slope_select' | 'playing' | 'paused' | 'result' | 'editor' | 'practice';

export class Game {
  private renderer: Renderer;
  private input: InputManager;
  private audio: AudioManager;
  private background: Background;
  private hud: HUD;
  private touchControls: TouchControls;

  private state: GameState = 'title';
  private allSlopes: SlopeDef[];
  private saveData: SaveData;

  // Active game objects
  private skier!: Skier;
  private slope!: Slope;

  // Screens
  private titleScreen: TitleScreen;
  private slopeSelect!: SlopeSelect;
  private resultScreen!: ResultScreen;
  private lessonScreen!: LessonScreen;
  private editorScreen!: EditorScreen;

  // Gameplay stats for current run
  private falls = 0;
  private mogulsPassed = 0;
  private mogulsTotal = 0;
  private flagsPassed = 0;
  private flagsTotal = 0;
  private tricksLanded = 0;
  private currentSlopeIndex = 0;

  // Game loop
  private lastTime = 0;
  private accumulator = 0;
  private running = false;

  // Input debounce for menus
  private inputCooldown = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.input = new InputManager(canvas);
    this.audio = new AudioManager();
    this.background = new Background();
    this.hud = new HUD();
    this.touchControls = new TouchControls(
      this.renderer.ctx,
      this.renderer.canvas.width,
      this.renderer.canvas.height
    );

    this.allSlopes = getAllSlopes();

    // Load save data
    const saved = loadProgress();
    this.saveData = saved || {
      currentSlope: 0,
      slopePerformance: [],
      bestPerformance: [],
    };

    // Initialize screens
    this.titleScreen = new TitleScreen();
    this.lessonScreen = new LessonScreen();
    this.editorScreen = new EditorScreen();
    this.slopeSelect = new SlopeSelect(this.allSlopes, this.saveData);
  }

  start(): void {
    this.running = true;
    this.state = 'title';
    this.titleScreen.enter(this.audio);

    // Unlock audio on first user interaction (required by iOS Safari)
    const unlockAudio = () => {
      this.audio.init();
      this.audio.resume();
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  private loop(time: number): void {
    if (!this.running) return;

    const dt = time - this.lastTime;
    this.lastTime = time;
    this.accumulator += dt;

    // Fixed timestep updates
    while (this.accumulator >= FIXED_DT) {
      this.update();
      this.accumulator -= FIXED_DT;
    }

    this.render();
    this.input.endFrame();
    requestAnimationFrame((t) => this.loop(t));
  }

  private update(): void {
    const inputState = this.input.getState();

    if (this.inputCooldown > 0) {
      this.inputCooldown--;
    }

    switch (this.state) {
      case 'title':
        this.updateTitle(inputState);
        break;
      case 'lessons':
        this.updateLessons(inputState);
        break;
      case 'slope_select':
        this.updateSlopeSelect(inputState);
        break;
      case 'playing':
        this.updatePlaying(inputState);
        break;
      case 'paused':
        this.updatePaused(inputState);
        break;
      case 'result':
        this.updateResult(inputState);
        break;
      case 'editor':
        this.updateEditor(inputState);
        break;
      case 'practice':
        this.updatePlaying(inputState); // Same as playing
        break;
    }
  }

  private updateTitle(input: ReturnType<InputManager['getState']>): void {
    if (this.inputCooldown > 0) return;
    const result = this.titleScreen.update(input, this.audio);
    if (!result) return;

    this.inputCooldown = 15;
    this.titleScreen.exit();

    switch (result) {
      case 'start':
        this.slopeSelect = new SlopeSelect(this.allSlopes, this.saveData);
        this.state = 'slope_select';
        break;
      case 'lessons':
        this.lessonScreen = new LessonScreen();
        this.state = 'lessons';
        break;
      case 'practice':
        this.startSlope(this.allSlopes[12]); // Slalom Sprint
        this.state = 'practice';
        break;
      case 'editor':
        this.editorScreen = new EditorScreen();
        this.state = 'editor';
        break;
      case 'options':
        // Toggle mute for now (simple options)
        this.audio.toggleMute();
        break;
    }
  }

  private updateLessons(input: ReturnType<InputManager['getState']>): void {
    if (this.inputCooldown > 0) return;
    const result = this.lessonScreen.update(input, this.audio);
    if (result === 'done') {
      this.inputCooldown = 15;
      this.state = 'title';
      this.titleScreen = new TitleScreen();
      this.titleScreen.enter(this.audio);
    }
  }

  private updateSlopeSelect(input: ReturnType<InputManager['getState']>): void {
    if (this.inputCooldown > 0) return;
    const result = this.slopeSelect.update(input, this.audio);
    if (result === null) return;

    this.inputCooldown = 15;
    if (result === 'back') {
      this.state = 'title';
      this.titleScreen = new TitleScreen();
      this.titleScreen.enter(this.audio);
    } else {
      this.currentSlopeIndex = result;
      this.startSlope(this.allSlopes[result]);
      this.state = 'playing';
    }
  }

  private startSlope(slopeDef: SlopeDef): void {
    this.skier = new Skier();
    this.slope = new Slope(slopeDef);
    this.falls = 0;
    this.mogulsPassed = 0;
    this.flagsPassed = 0;
    this.tricksLanded = 0;

    // Count totals
    this.mogulsTotal = slopeDef.obstacles.filter(
      (o) => o.type === 'mogul_small' || o.type === 'mogul_large'
    ).length;
    this.flagsTotal = slopeDef.obstacles.filter(
      (o) => o.type === 'flag_red' || o.type === 'flag_blue'
    ).length;

    this.skier.state = 'skiing';
    this.background = new Background();
  }

  private updatePlaying(input: ReturnType<InputManager['getState']>): void {
    // Pause
    if (input.pause) {
      this.state = 'paused';
      return;
    }

    // Skier movement
    if (input.up) this.skier.moveUp();
    if (input.down) this.skier.moveDown();

    // Tricks
    if (input.trick1 && this.skier.isAirborne) {
      if (this.skier.doTrick('bs')) {
        this.audio.trick();
      }
    }
    if (input.trick2 && this.skier.isAirborne) {
      if (this.skier.doTrick('daffy')) {
        this.audio.trick();
      }
    }

    // Update game objects
    if (!this.skier.isCrashing) {
      this.slope.update();
    }
    this.skier.update();

    // Collision detection
    const collidable = this.slope.getCollidableObstacles(this.skier.x);
    const collisionResult = checkCollisions(
      this.skier,
      collidable,
      this.audio,
      input.up,
      input.down,
    );

    if (collisionResult.fell) {
      this.falls++;
      this.audio.crash();
    }
    if (collisionResult.trickSucceeded) {
      this.tricksLanded++;
    }
    if (collisionResult.flagPassed) {
      this.flagsPassed++;
    }

    // Count moguls passed (that weren't falls)
    for (const obs of collidable) {
      if (obs.passed && (obs.type === 'mogul_small' || obs.type === 'mogul_large') && !collisionResult.fell) {
        this.mogulsPassed++;
      }
    }

    // Check disqualification or completion
    if (this.falls >= MAX_FALLS) {
      this.finishSlope(true);
    } else if (this.slope.finished) {
      this.finishSlope(false);
    }
  }

  private updatePaused(input: ReturnType<InputManager['getState']>): void {
    if (input.pause || input.confirm) {
      this.state = 'playing';
    }
    if (input.back) {
      // Return to slope select
      this.slopeSelect = new SlopeSelect(this.allSlopes, this.saveData);
      this.state = 'slope_select';
    }
  }

  private finishSlope(disqualified: boolean): void {
    const result: SlopeResult = {
      slopeName: this.slope.def.name,
      slopeNumber: this.slope.def.number,
      falls: this.falls,
      mogulsPassed: this.mogulsPassed,
      mogulsTotal: this.mogulsTotal,
      flagsPassed: this.flagsPassed,
      flagsTotal: this.flagsTotal,
      tricksLanded: this.tricksLanded,
      disqualified,
    };

    this.resultScreen = new ResultScreen(result);
    this.state = 'result';

    // Update save data
    const perf = this.resultScreen.getPerformance();
    if (this.resultScreen.isQualified() && this.currentSlopeIndex === this.saveData.currentSlope) {
      this.saveData.currentSlope = Math.min(this.allSlopes.length - 1, this.saveData.currentSlope + 1);
    }
    this.saveData.slopePerformance[this.currentSlopeIndex] = perf;
    if (!this.saveData.bestPerformance[this.currentSlopeIndex] || perf > this.saveData.bestPerformance[this.currentSlopeIndex]) {
      this.saveData.bestPerformance[this.currentSlopeIndex] = perf;
    }
    saveProgress(this.saveData);
  }

  private updateResult(input: ReturnType<InputManager['getState']>): void {
    if (this.inputCooldown > 0) return;
    const result = this.resultScreen.update(input, this.audio);
    if (!result) return;

    this.inputCooldown = 15;
    if (result === 'continue') {
      this.slopeSelect = new SlopeSelect(this.allSlopes, this.saveData);
      this.state = 'slope_select';
    } else if (result === 'retry') {
      this.startSlope(this.allSlopes[this.currentSlopeIndex]);
      this.state = 'playing';
    }
  }

  private updateEditor(input: ReturnType<InputManager['getState']>): void {
    const result = this.editorScreen.update(input, this.audio);
    if (result === 'back') {
      this.state = 'title';
      this.titleScreen = new TitleScreen();
      this.titleScreen.enter(this.audio);
    } else if (result === 'test') {
      const customSlope = this.editorScreen.toSlopeDef();
      this.startSlope(customSlope);
      this.state = 'playing';
    }
  }

  private render(): void {
    this.renderer.clear();
    const ctx = this.renderer.ctx;

    switch (this.state) {
      case 'title':
        this.titleScreen.render(ctx);
        break;
      case 'lessons':
        this.lessonScreen.render(ctx);
        break;
      case 'slope_select':
        this.slopeSelect.render(ctx);
        break;
      case 'playing':
      case 'practice':
      case 'paused':
        this.renderGameplay(ctx);
        break;
      case 'result':
        this.resultScreen.render(ctx);
        break;
      case 'editor':
        this.editorScreen.render(ctx);
        break;
    }

    // Show touch controls during gameplay on touch devices
    if (this.input.isTouchDevice && (this.state === 'playing' || this.state === 'practice')) {
      this.touchControls.render();
    }
  }

  private renderGameplay(ctx: CanvasRenderingContext2D): void {
    // Background
    this.background.render(ctx, this.slope.scrollX);

    // Slope obstacles
    this.slope.render(ctx);

    // Skier
    this.skier.render(ctx);

    // HUD
    this.hud.render(
      ctx,
      this.slope.progress,
      this.falls,
      this.slope.def.name,
      this.slope.def.number,
      this.state === 'paused',
    );
  }
}
