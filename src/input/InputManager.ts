export interface InputState {
  up: boolean;
  down: boolean;
  trick1: boolean; // back scratcher
  trick2: boolean; // daffy
  confirm: boolean;
  pause: boolean;
  back: boolean;
}

export class InputManager {
  private keys: Set<string> = new Set();
  private keysJustPressed: Set<string> = new Set();
  private gamepadIndex: number | null = null;

  // Touch state
  private touchUp = false;
  private touchDown = false;
  private touchTrick1 = false;
  private touchTrick2 = false;
  private touchConfirm = false;
  private activeTouches: Map<number, { x: number; y: number }> = new Map();

  private canvasRect: DOMRect | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.bindKeyboard();
    this.bindTouch();
    this.bindGamepad();
    this.updateCanvasRect();
    window.addEventListener('resize', () => this.updateCanvasRect());
  }

  private updateCanvasRect(): void {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  private bindKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      if (!this.keys.has(e.code)) {
        this.keysJustPressed.add(e.code);
      }
      this.keys.add(e.code);
      e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      e.preventDefault();
    });
  }

  private bindTouch(): void {
    const opts: AddEventListenerOptions = { passive: false };

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        this.activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
      this.updateTouchState();
    }, opts);

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        this.activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
      this.updateTouchState();
    }, opts);

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        this.activeTouches.delete(e.changedTouches[i].identifier);
      }
      this.updateTouchState();
    }, opts);

    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        this.activeTouches.delete(e.changedTouches[i].identifier);
      }
      this.updateTouchState();
    }, opts);
  }

  private updateTouchState(): void {
    this.touchUp = false;
    this.touchDown = false;
    this.touchTrick1 = false;
    this.touchTrick2 = false;
    this.touchConfirm = false;

    if (!this.canvasRect || this.activeTouches.size === 0) return;

    const rect = this.canvasRect;

    for (const [, pos] of this.activeTouches) {
      const relX = (pos.x - rect.left) / rect.width;
      const relY = (pos.y - rect.top) / rect.height;

      // Left side of screen = trick buttons
      if (relX < 0.25) {
        // Upper-left = trick1 (back scratcher)
        if (relY < 0.5) {
          this.touchTrick1 = true;
        } else {
          // Lower-left = trick2 (daffy)
          this.touchTrick2 = true;
        }
      }
      // Right side of screen = movement
      else if (relX > 0.4) {
        if (relY < 0.4) {
          this.touchUp = true;
        } else if (relY > 0.6) {
          this.touchDown = true;
        }
      }
      // Middle tap = confirm (for menus)
      if (relX > 0.3 && relX < 0.7 && relY > 0.3 && relY < 0.7) {
        this.touchConfirm = true;
      }
    }
  }

  private bindGamepad(): void {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null;
    });
  }

  private getGamepadState(): Partial<InputState> {
    if (this.gamepadIndex === null) return {};
    const gp = navigator.getGamepads()[this.gamepadIndex];
    if (!gp) return {};

    return {
      up: gp.axes[1] < -0.3 || gp.buttons[12]?.pressed,
      down: gp.axes[1] > 0.3 || gp.buttons[13]?.pressed,
      trick1: gp.buttons[0]?.pressed,
      trick2: gp.buttons[1]?.pressed,
      confirm: gp.buttons[0]?.pressed,
      pause: gp.buttons[9]?.pressed,
      back: gp.buttons[8]?.pressed,
    };
  }

  getState(): InputState {
    const gp = this.getGamepadState();

    return {
      up: this.keys.has('ArrowUp') || this.keys.has('KeyW') || this.touchUp || !!gp.up,
      down: this.keys.has('ArrowDown') || this.keys.has('KeyS') || this.touchDown || !!gp.down,
      trick1: this.keys.has('KeyZ') || this.keys.has('Space') || this.touchTrick1 || !!gp.trick1,
      trick2: this.keys.has('KeyX') || this.touchTrick2 || !!gp.trick2,
      confirm: this.keysJustPressed.has('Enter') || this.keysJustPressed.has('Space') || this.touchConfirm || !!gp.confirm,
      pause: this.keysJustPressed.has('Escape') || !!gp.pause,
      back: this.keysJustPressed.has('Escape') || this.keysJustPressed.has('Backspace') || !!gp.back,
    };
  }

  /** Call at end of each frame to clear one-shot inputs */
  endFrame(): void {
    this.keysJustPressed.clear();
    this.touchConfirm = false;
  }

  /** Whether we should show touch UI overlay */
  get isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}
