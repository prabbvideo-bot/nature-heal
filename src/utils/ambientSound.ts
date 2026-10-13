/**
 * Procedural Web Audio Ambient Nature Generator
 * Synthesizes organic outdoor soundscapes (wind in canopy, mountain brook, meadow air)
 * entirely in the browser using Web Audio API nodes.
 * Requires zero external audio downloads, zero network latency, and low battery consumption.
 */

type SoundscapeType = 'canopy_wind' | 'mountain_brook' | 'peaceful_meadow' | 'silent';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentPreset: SoundscapeType = 'canopy_wind';
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private chimeTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create 5 seconds of looping pink noise buffer for realistic atmospheric breeze
  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public start(preset: SoundscapeType = 'canopy_wind', volume: number = 0.3) {
    if (preset === 'silent') {
      this.stop();
      this.currentPreset = 'silent';
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    this.stop();
    this.currentPreset = preset;
    this.isPlaying = true;

    try {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Pink noise source for outdoor wind / stream
      const noiseBuffer = this.createPinkNoiseBuffer(this.ctx);
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Filter to simulate tree leaves or water
      this.filterNode = this.ctx.createBiquadFilter();
      if (preset === 'canopy_wind') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(1.8, this.ctx.currentTime);

        // LFO to simulate gentle gusts of wind
        this.lfoOsc = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        this.lfoOsc.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8 second gentle swell
        lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
        this.lfoOsc.connect(lfoGain);
        lfoGain.connect(this.filterNode.frequency);
        this.lfoOsc.start();
      } else if (preset === 'mountain_brook') {
        this.filterNode.type = 'bandpass';
        this.filterNode.frequency.setValueAtTime(750, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

        // Faster subtle ripple
        this.lfoOsc = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        this.lfoOsc.frequency.setValueAtTime(0.4, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
        this.lfoOsc.connect(lfoGain);
        lfoGain.connect(this.filterNode.frequency);
        this.lfoOsc.start();
      } else {
        // Peaceful meadow - high soft warmth
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(1.0, this.ctx.currentTime);
      }

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.noiseNode.start();

      // Trigger periodic organic chimes or harmonic bird tones
      this.scheduleRandomChimes();
    } catch (e) {
      console.warn('Web Audio start ambient error:', e);
    }
  }

  private scheduleRandomChimes() {
    if (!this.isPlaying || !this.ctx) return;

    // Random soft harmonic bell tone every 12 to 24 seconds
    const nextInterval = 12000 + Math.random() * 12000;
    this.chimeTimer = window.setTimeout(() => {
      this.playSoftChime();
      this.scheduleRandomChimes();
    }, nextInterval);
  }

  private playSoftChime() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic meditative frequencies: D4, F#4, A4, B4, D5
      const notes = [293.66, 369.99, 440.00, 493.88, 587.33];
      const freq = notes[Math.floor(Math.random() * notes.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.6);
    } catch {
      // Audio context may be closed
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.chimeTimer) {
      window.clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    try {
      if (this.lfoOsc) {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
        this.lfoOsc = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.filterNode) {
        this.filterNode.disconnect();
        this.filterNode = null;
      }
      if (this.masterGain) {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
    } catch {
      // already stopped
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      preset: this.currentPreset,
    };
  }
}

export const ambientSound = new AmbientSoundEngine();
export type { SoundscapeType };
