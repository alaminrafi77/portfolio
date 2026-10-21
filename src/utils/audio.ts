// 1990s Web Audio synthesizer for nostalgic sound effects & chiptune background music
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playRetroClick(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

export function playRetroBeep(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6 note
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

export function playRetroError(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Classic Windows 95 Chord-style error buzzer
    [160, 220, 277].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

export function playWinStartupChime(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 1.2);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// Dial-up modem handshake simulator
export function playDialUpSound(enabled = true): () => void {
  if (!enabled) return () => {};
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Dial tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 350;
    osc2.frequency.value = 440;

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.setValueAtTime(0.06, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);

    // Beeps (DTMF pulse dialing)
    const dtmfFreqs = [770, 852, 941, 1209, 1336, 1477];
    for (let i = 0; i < 7; i++) {
      const dtmfOsc = ctx.createOscillator();
      const dtmfGain = ctx.createGain();
      const start = now + 1.4 + i * 0.15;
      dtmfOsc.frequency.value = dtmfFreqs[i % dtmfFreqs.length];
      dtmfGain.gain.setValueAtTime(0.08, start);
      dtmfGain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

      dtmfOsc.connect(dtmfGain);
      dtmfGain.connect(ctx.destination);

      dtmfOsc.start(start);
      dtmfOsc.stop(start + 0.08);
    }

    // Carrier handshake hiss
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 3;

    const noiseGain = ctx.createGain();
    const noiseStart = now + 2.6;
    noiseGain.gain.setValueAtTime(0.0001, noiseStart);
    noiseGain.gain.linearRampToValueAtTime(0.07, noiseStart + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, noiseStart + 2.0);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(noiseStart);
    whiteNoise.stop(noiseStart + 2.0);

    return () => {
      try {
        whiteNoise.stop();
        osc1.stop();
        osc2.stop();
      } catch {
        // already stopped
      }
    };
  } catch (e) {
    console.debug('Dialup error:', e);
    return () => {};
  }
}

// Chiptune background music player
class RetroMusicPlayer {
  private isPlaying = false;
  private intervalId: number | null = null;
  private currentStep = 0;
  
  // Nostalgic 90s game progression (Pentatonic key of D)
  private melodyNotes = [
    587.33, 659.25, 739.99, 880.00, 987.77, 880.00, 739.99, 659.25,
    587.33, 739.99, 880.00, 1174.66, 987.77, 880.00, 659.25, 587.33,
    440.00, 587.33, 659.25, 739.99, 587.33, 440.00, 392.00, 440.00,
    587.33, 659.25, 739.99, 880.00, 739.99, 659.25, 587.33, 587.33
  ];

  private bassNotes = [
    146.83, 146.83, 146.83, 146.83, 196.00, 196.00, 196.00, 196.00,
    220.00, 220.00, 220.00, 220.00, 146.83, 146.83, 146.83, 146.83
  ];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;

    const tempoMs = 150; // ~100 bpm 16th notes
    this.intervalId = window.setInterval(() => {
      this.playStep();
    }, tempoMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playStep() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Lead Melody
      const melFreq = this.melodyNotes[this.currentStep % this.melodyNotes.length];
      if (melFreq) {
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();

        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(melFreq, now);

        leadGain.gain.setValueAtTime(0.04, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);

        leadOsc.start(now);
        leadOsc.stop(now + 0.12);
      }

      // Bass line on every 2nd step
      if (this.currentStep % 2 === 0) {
        const bassIndex = Math.floor(this.currentStep / 2) % this.bassNotes.length;
        const bassFreq = this.bassNotes[bassIndex];
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.07, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.25);
      }

      this.currentStep++;
    } catch {
      // Audio context might be restricted
    }
  }
}

export const retroMusicPlayer = new RetroMusicPlayer();
