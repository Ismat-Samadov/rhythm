/**
 * AudioEngine — Web Audio API based music and SFX engine.
 * Generates all audio procedurally (no external files needed).
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private bpm: number = 128;
  private nextBeatTime: number = 0;
  private beatIndex: number = 0;
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private isPlaying: boolean = false;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  /** Must be called inside a user gesture (click/touch) to satisfy browser policy */
  initialize(): void {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    // Master → destination
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.ctx.destination);

    // Music sub-bus
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.55;
    this.musicGain.connect(this.masterGain);

    // SFX sub-bus
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.9;
    this.sfxGain.connect(this.masterGain);
  }

  destroy(): void {
    this.stopMusic();
    this.ctx?.close();
    this.ctx = null;
  }

  resume(): void {
    this.ctx?.resume();
  }

  suspend(): void {
    this.ctx?.suspend();
  }

  // ─── Volume controls ───────────────────────────────────────────────────────

  setMusicEnabled(enabled: boolean): void {
    if (!this.musicGain) return;
    this.musicGain.gain.value = enabled ? 0.55 : 0;
  }

  setSfxEnabled(enabled: boolean): void {
    if (!this.sfxGain) return;
    this.sfxGain.gain.value = enabled ? 0.9 : 0;
  }

  // ─── Background music ──────────────────────────────────────────────────────

  startMusic(bpm: number): void {
    if (!this.ctx) this.initialize();
    this.ctx!.resume();
    this.bpm = bpm;
    this.nextBeatTime = this.ctx!.currentTime + 0.1;
    this.beatIndex = 0;
    this.isPlaying = true;
    this.runScheduler();
  }

  stopMusic(): void {
    this.isPlaying = false;
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  private runScheduler(): void {
    const LOOKAHEAD_SEC = 0.12;   // schedule this far ahead
    const INTERVAL_MS   = 25;     // check every 25 ms

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      while (this.nextBeatTime < this.ctx.currentTime + LOOKAHEAD_SEC) {
        this.scheduleBeat(this.beatIndex, this.nextBeatTime);
        // Advance by one 8th note
        this.nextBeatTime += (60 / this.bpm) / 2;
        this.beatIndex++;
      }
    };

    tick();
    this.schedulerTimer = setInterval(tick, INTERVAL_MS);
  }

  /**
   * Schedules drum + bass sounds for a single 8th-note grid slot.
   * Beat grid (16-slot cycle = 2 measures of 4/4 in 8th notes):
   *   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
   * K        K     K  K        K        K        K
   *    H  H     H     H  H        H  H     H  H
   * S           S                    S           S     (snare on 4 and 12)
   */
  private scheduleBeat(beat: number, time: number): void {
    if (!this.ctx || !this.musicGain) return;

    const slot = beat % 16;

    // Kick drum
    if ([0, 4, 6, 8, 12].includes(slot)) {
      this.kick(time);
    }

    // Snare
    if (slot === 4 || slot === 12) {
      this.snare(time);
    }

    // Hi-hat (every odd slot)
    if (slot % 2 === 1) {
      this.hihat(time, slot % 4 === 3 ? 0.06 : 0.12); // accented every 4th
    }

    // Bass synth (every 4 slots)
    if (slot % 4 === 0) {
      const bassFreqs = [55, 55, 65.41, 55, 73.42, 55, 65.41, 73.42]; // A1, C2, D2…
      const freq = bassFreqs[Math.floor(beat / 4) % bassFreqs.length];
      this.bass(time, freq);
    }

    // Pad chord (on beat 0 of every 8-slot cycle = every bar)
    if (slot === 0) {
      const padFreqs = [110, 138.59, 164.81]; // A2, C#3, E3 major triad
      padFreqs.forEach(f => this.pad(time, f));
    }
  }

  // ─── Drum synthesis ────────────────────────────────────────────────────────

  private kick(time: number): void {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.connect(env);
    env.connect(this.musicGain);

    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);
    env.gain.setValueAtTime(0.9, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.start(time);
    osc.stop(time + 0.18);
  }

  private snare(time: number): void {
    if (!this.ctx || !this.musicGain) return;

    // Noise body
    const bufSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const noiseEnv = this.ctx.createGain();
    src.connect(noiseEnv);
    noiseEnv.connect(this.musicGain);
    noiseEnv.gain.setValueAtTime(0.35, time);
    noiseEnv.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    src.start(time);
    src.stop(time + 0.15);

    // Tone layer
    const osc = this.ctx.createOscillator();
    const toneEnv = this.ctx.createGain();
    osc.connect(toneEnv);
    toneEnv.connect(this.musicGain);
    osc.frequency.value = 220;
    toneEnv.gain.setValueAtTime(0.35, time);
    toneEnv.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  private hihat(time: number, volume: number): void {
    if (!this.ctx || !this.musicGain) return;

    const bufSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 8000;

    const env = this.ctx.createGain();
    src.connect(hp);
    hp.connect(env);
    env.connect(this.musicGain);
    env.gain.setValueAtTime(volume, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    src.start(time);
    src.stop(time + 0.04);
  }

  // ─── Melodic synthesis ─────────────────────────────────────────────────────

  private bass(time: number, freq: number): void {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 380;
    filter.Q.value = 3;

    const env = this.ctx.createGain();
    osc.connect(filter);
    filter.connect(env);
    env.connect(this.musicGain);
    env.gain.setValueAtTime(0.45, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  private pad(time: number, freq: number): void {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const env = this.ctx.createGain();
    osc.connect(env);
    env.connect(this.musicGain);
    // Long fade-in / fade-out pad
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(0.06, time + 0.3);
    env.gain.exponentialRampToValueAtTime(0.001, time + 1.8);
    osc.start(time);
    osc.stop(time + 2);
  }

  // ─── SFX ───────────────────────────────────────────────────────────────────

  /** Hit sound — different pitch for perfect vs good */
  playHitSfx(result: 'perfect' | 'good'): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (result === 'perfect') {
      // Rising tone + shimmer
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

      const env = ctx.createGain();
      osc.connect(env);
      env.connect(this.sfxGain);
      env.gain.setValueAtTime(0.4, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);

      // High shimmer layer
      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 2640;
      const sEnv = ctx.createGain();
      shimmer.connect(sEnv);
      sEnv.connect(this.sfxGain);
      sEnv.gain.setValueAtTime(0.15, now + 0.02);
      sEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      shimmer.start(now + 0.02);
      shimmer.stop(now + 0.18);
    } else {
      // Simple mid-range blip
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 660;

      const env = ctx.createGain();
      osc.connect(env);
      env.connect(this.sfxGain);
      env.gain.setValueAtTime(0.28, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }

  /** Miss sound — downward buzz */
  playMissSfx(): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

    const env = ctx.createGain();
    osc.connect(env);
    env.connect(this.sfxGain);
    env.gain.setValueAtTime(0.25, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Countdown beep */
  playCountdownBeep(final: boolean): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = final ? 1200 : 880;

    const env = ctx.createGain();
    osc.connect(env);
    env.connect(this.sfxGain);
    env.gain.setValueAtTime(0.35, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + (final ? 0.35 : 0.18));
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /** Victory fanfare */
  playVictoryFanfare(): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    // Rising major arpeggio
    const freqs = [440, 550, 660, 880];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const env = ctx.createGain();
      osc.connect(env);
      env.connect(this.sfxGain!);
      env.gain.setValueAtTime(0, now + i * 0.12);
      env.gain.linearRampToValueAtTime(0.3, now + i * 0.12 + 0.05);
      env.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  }
}

/** Singleton instance shared across the application */
export const audioEngine = new AudioEngine();
