// Enhanced Web Audio API Synthesizer for F1 sound effects & soundboard

class F1SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;

  private initCtx() {
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

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // F1 Gantry Start Light Beep
  public playLightBeep(index: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700 + index * 50, this.ctx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.value = 900;
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Engine launch roar "LIGHTS OUT AND AWAY WE GO"
  public playLightsOutLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub rumble (low cylinders)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(75, now);
    subOsc.frequency.exponentialRampToValueAtTime(360, now + 1.2);
    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.0);

    // Turbo whistle & high harmonics
    const turboOsc = this.ctx.createOscillator();
    const turboGain = this.ctx.createGain();
    turboOsc.type = 'sine';
    turboOsc.frequency.setValueAtTime(900, now);
    turboOsc.frequency.exponentialRampToValueAtTime(4200, now + 1.4);
    turboGain.gain.setValueAtTime(0.07, now);
    turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    turboOsc.connect(turboGain);
    turboGain.connect(this.ctx.destination);
    turboOsc.start(now);
    turboOsc.stop(now + 1.8);

    // Exhaust air whoosh
    const bufferSize = this.ctx.sampleRate * 1.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(350, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(2600, now + 1.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.14, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.7);
  }

  // Gear downshift blip / throttle kick
  public playGearShift() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Turbo flutter ("su-tu-tu-tu") on lift-off
  public playTurboFlutter() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 - i * 150, startTime);
      osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.05);

      gain.gain.setValueAtTime(0.08 - i * 0.015, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.06);
    }
  }

  // Cockpit switch click
  public playClick(pitch: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1500 * pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Team Radio Transmission Beep & static
  public playRadioBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1300, now);
    osc.frequency.setValueAtTime(1900, now + 0.07);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);

    // Subtle radio static burst
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const staticNode = this.ctx.createBufferSource();
    staticNode.buffer = buffer;
    const staticGain = this.ctx.createGain();
    staticGain.gain.setValueAtTime(0.05, now + 0.15);
    staticGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    staticNode.connect(staticGain);
    staticGain.connect(this.ctx.destination);
    staticNode.start(now + 0.15);
    staticNode.stop(now + 0.45);
  }

  // Victory celebration chime (for merch buy & trophy reveals)
  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.4);
    });
  }
}

export const f1Audio = new F1SoundManager();
