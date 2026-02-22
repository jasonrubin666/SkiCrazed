/**
 * Retro sound effects using Web Audio API oscillators.
 * Emulates the Apple II beeper-style audio with square/triangle/noise waves.
 */
export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  /** Must be called from a user gesture to unlock audio on iOS */
  init(): void {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) this.init();
    return this.ctx!;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.3;
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 1): void {
    const ctx = this.ensureCtx();
    if (!this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume * 0.5;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume = 0.3): void {
    const ctx = this.ensureCtx();
    if (!this.masterGain) return;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(this.masterGain!);
    source.start(ctx.currentTime);
  }

  // ======= GAME SOUND EFFECTS =======

  jump(): void {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  land(): void {
    this.playTone(80, 0.1, 'sine', 0.5);
  }

  trick(): void {
    // Quick ascending arpeggio
    const ctx = this.ensureCtx();
    const notes = [400, 500, 600, 800];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.06);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.07);
    });
  }

  crash(): void {
    this.playNoise(0.3, 0.5);
    this.playTone(150, 0.2, 'sawtooth', 0.3);
    // Descending thud
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
    gain.gain.value = 0.4;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  }

  mogulPass(): void {
    this.playTone(880, 0.08, 'square', 0.3);
  }

  mogulFail(): void {
    this.playTone(120, 0.15, 'sawtooth', 0.4);
  }

  flagPass(): void {
    this.playTone(660, 0.06, 'triangle', 0.4);
    setTimeout(() => this.playTone(880, 0.06, 'triangle', 0.3), 60);
  }

  iceSlide(): void {
    this.playNoise(0.4, 0.2);
  }

  menuSelect(): void {
    this.playTone(440, 0.05, 'square', 0.3);
  }

  menuMove(): void {
    this.playTone(330, 0.03, 'square', 0.2);
  }

  levelComplete(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'square', 0.3), i * 150);
    });
  }

  disqualified(): void {
    const notes = [400, 350, 300, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'square', 0.3), i * 200);
    });
  }

  titleMusic(): { stop: () => void } {
    const ctx = this.ensureCtx();
    if (!this.masterGain) return { stop: () => {} };

    // Simple looping chiptune melody
    const melody = [
      523, 587, 659, 784, 659, 587, 523, 440,
      523, 587, 659, 784, 880, 784, 659, 523,
    ];
    const noteLength = 0.18;
    let stopped = false;
    let timeoutId: number;

    const playMelody = () => {
      if (stopped) return;
      melody.forEach((freq, i) => {
        if (stopped) return;
        timeoutId = window.setTimeout(() => {
          if (!stopped) this.playTone(freq, noteLength * 0.8, 'square', 0.15);
        }, i * noteLength * 1000);
      });
      // Loop
      timeoutId = window.setTimeout(() => {
        if (!stopped) playMelody();
      }, melody.length * noteLength * 1000);
    };

    playMelody();
    return {
      stop: () => {
        stopped = true;
        clearTimeout(timeoutId);
      },
    };
  }

  /** Resume AudioContext after user gesture (required by iOS Safari) */
  resume(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }
}
