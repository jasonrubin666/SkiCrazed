import { GAME_WIDTH, GAME_HEIGHT, COLORS, MAX_CUSTOM_SLOPES } from '../data/Constants';
import { InputState } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { ObstacleType, ObstacleDef, SlopeDef } from '../game/SlopeData';
import { CustomSlope, saveCustomSlopes, loadCustomSlopes } from '../data/Storage';
import {
  MOGUL_SMALL, MOGUL_LARGE, JUMP_SMALL, JUMP_LARGE,
  ICE_PATCH, FLAG_RED, FLAG_BLUE, WARNING_SIGN,
  drawSprite, SpriteData
} from '../rendering/Sprites';

type EditorMode = 'slot_select' | 'editing';

const PALETTE: { type: ObstacleType; label: string; sprite: SpriteData }[] = [
  { type: 'mogul_small', label: 'SM MOG', sprite: MOGUL_SMALL },
  { type: 'mogul_large', label: 'LG MOG', sprite: MOGUL_LARGE },
  { type: 'jump_small', label: 'SM JMP', sprite: JUMP_SMALL },
  { type: 'jump_large', label: 'LG JMP', sprite: JUMP_LARGE },
  { type: 'ice', label: 'ICE', sprite: ICE_PATCH },
  { type: 'flag_red', label: 'RED FL', sprite: FLAG_RED },
  { type: 'flag_blue', label: 'BLU FL', sprite: FLAG_BLUE },
  { type: 'sign', label: 'SIGN', sprite: WARNING_SIGN },
];

export class EditorScreen {
  private mode: EditorMode = 'slot_select';
  private slots: CustomSlope[] = [];
  private selectedSlot = 0;
  private selectedPalette = 0;
  private cursorX = 100;
  private cursorY = 100;
  private obstacles: { type: ObstacleType; x: number; y: number }[] = [];
  private slopeName = 'CUSTOM';
  private scrollX = 0;
  private slopeLength = 1200;

  constructor() {
    this.slots = loadCustomSlopes();
    // Pad to MAX_CUSTOM_SLOPES
    while (this.slots.length < MAX_CUSTOM_SLOPES) {
      this.slots.push({ name: '', obstacles: [] });
    }
  }

  update(input: InputState, audio: AudioManager): 'back' | 'test' | null {
    if (this.mode === 'slot_select') {
      return this.updateSlotSelect(input, audio);
    }
    return this.updateEditing(input, audio);
  }

  private updateSlotSelect(input: InputState, audio: AudioManager): 'back' | null {
    if (input.up && this.selectedSlot > 0) {
      this.selectedSlot--;
      audio.menuMove();
    }
    if (input.down && this.selectedSlot < MAX_CUSTOM_SLOPES - 1) {
      this.selectedSlot++;
      audio.menuMove();
    }
    if (input.confirm) {
      audio.menuSelect();
      const slot = this.slots[this.selectedSlot];
      this.obstacles = slot.obstacles.map((o) => ({ ...o, type: o.type as ObstacleType }));
      this.slopeName = slot.name || `CUSTOM ${this.selectedSlot + 1}`;
      this.mode = 'editing';
      this.scrollX = 0;
    }
    if (input.back) return 'back';
    return null;
  }

  private updateEditing(input: InputState, audio: AudioManager): 'back' | 'test' | null {
    // Move cursor
    if (input.up) this.cursorY = Math.max(50, this.cursorY - 3);
    if (input.down) this.cursorY = Math.min(150, this.cursorY + 3);

    // Scroll viewport
    if (input.trick1) {
      this.scrollX = Math.max(0, this.scrollX - 4);
    }
    if (input.trick2) {
      this.scrollX = Math.min(this.slopeLength - GAME_WIDTH, this.scrollX + 4);
    }

    // Place obstacle
    if (input.confirm) {
      audio.menuSelect();
      const worldX = this.cursorX + this.scrollX;
      this.obstacles.push({
        type: PALETTE[this.selectedPalette].type,
        x: worldX,
        y: this.cursorY,
      });
      this.save();
    }

    // Cycle palette (using pause as palette cycle since we don't have many buttons)
    if (input.pause) {
      this.selectedPalette = (this.selectedPalette + 1) % PALETTE.length;
      audio.menuMove();
    }

    if (input.back) {
      this.save();
      this.mode = 'slot_select';
    }

    return null;
  }

  private save(): void {
    this.slots[this.selectedSlot] = {
      name: this.slopeName,
      obstacles: this.obstacles.map((o) => ({ type: o.type, x: o.x, y: o.y })),
    };
    saveCustomSlopes(this.slots);
  }

  /** Convert current editor state to a playable SlopeDef */
  toSlopeDef(): SlopeDef {
    const obsDefs: ObstacleDef[] = this.obstacles.map((o) => ({
      type: o.type,
      x: o.x,
      y: o.y,
      passDirection: (o.type === 'flag_red' ? 'down' :
        o.type === 'flag_blue' ? 'up' :
        o.type.startsWith('mogul') ? (Math.random() < 0.5 ? 'up' : 'down') : undefined),
    }));
    obsDefs.sort((a, b) => a.x - b.x);

    return {
      name: this.slopeName,
      number: 0,
      type: 'downhill',
      length: this.slopeLength,
      baseSpeed: 1.0,
      obstacles: obsDefs,
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.mode === 'slot_select') {
      this.renderSlotSelect(ctx);
    } else {
      this.renderEditing(ctx);
    }
  }

  private renderSlotSelect(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SLOPE EDITOR', GAME_WIDTH / 2, 16);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '6px monospace';
    ctx.fillText('SELECT A SLOT:', GAME_WIDTH / 2, 30);

    for (let i = 0; i < MAX_CUSTOM_SLOPES; i++) {
      const y = 44 + i * 12;
      const selected = i === this.selectedSlot;

      if (selected) {
        ctx.fillStyle = COLORS.GREEN;
        ctx.fillRect(40, y - 7, GAME_WIDTH - 80, 10);
        ctx.fillStyle = COLORS.BLACK;
      } else {
        ctx.fillStyle = COLORS.WHITE;
      }

      ctx.font = '5px monospace';
      ctx.textAlign = 'center';
      const name = this.slots[i].name || '(EMPTY)';
      const count = this.slots[i].obstacles.length;
      ctx.fillText(`${i + 1}. ${name} ${count > 0 ? `(${count} OBS)` : ''}`, GAME_WIDTH / 2, y);
    }

    ctx.fillStyle = COLORS.BLUE;
    ctx.font = '5px monospace';
    ctx.fillText('ENTER TO EDIT  -  ESC TO GO BACK', GAME_WIDTH / 2, GAME_HEIGHT - 8);
  }

  private renderEditing(ctx: CanvasRenderingContext2D): void {
    // Snow background
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Grid lines
    ctx.strokeStyle = COLORS.BLUE;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    for (let x = 0; x < GAME_WIDTH; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_HEIGHT - 20);
      ctx.stroke();
    }
    for (let y = 50; y < 160; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_WIDTH, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw placed obstacles
    for (const obs of this.obstacles) {
      const screenX = obs.x - this.scrollX;
      if (screenX < -20 || screenX > GAME_WIDTH + 20) continue;
      const paletteItem = PALETTE.find((p) => p.type === obs.type);
      if (paletteItem) {
        drawSprite(ctx, paletteItem.sprite, screenX - paletteItem.sprite.width / 2, obs.y - paletteItem.sprite.height / 2);
      }
    }

    // Cursor with current palette item
    const currentPalette = PALETTE[this.selectedPalette];
    ctx.globalAlpha = 0.6;
    drawSprite(ctx, currentPalette.sprite, this.cursorX - currentPalette.sprite.width / 2, this.cursorY - currentPalette.sprite.height / 2);
    ctx.globalAlpha = 1;

    // Cursor crosshair
    ctx.strokeStyle = COLORS.ORANGE;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.cursorX - 2, this.cursorY - 2, 5, 5);

    // HUD bar at bottom
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, GAME_HEIGHT - 18, GAME_WIDTH, 18);

    ctx.fillStyle = COLORS.GREEN;
    ctx.font = '5px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ITEM: ${currentPalette.label}`, 4, GAME_HEIGHT - 9);
    ctx.fillText(`POS: ${this.cursorX + this.scrollX},${this.cursorY}`, 80, GAME_HEIGHT - 9);
    ctx.fillText(`OBS: ${this.obstacles.length}`, 160, GAME_HEIGHT - 9);

    ctx.fillStyle = COLORS.BLUE;
    ctx.textAlign = 'right';
    ctx.fillText('ESC=CYCLE  Z/X=SCROLL', GAME_WIDTH - 4, GAME_HEIGHT - 9);
  }
}
