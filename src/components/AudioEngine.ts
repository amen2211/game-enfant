/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) {
      this.stopBackgroundMusic();
    }
  }

  playTap() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  playCoin() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
      
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  playCardFlip() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + index * 0.07);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + index * 0.07 + 0.01);
        gain.gain.linearRampToValueAtTime(0.001, t + index * 0.07 + 0.25);
        
        osc.start(t + index * 0.07);
        osc.stop(t + index * 0.07 + 0.28);
      });
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  playFail() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  playLevelUp() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const t = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Chords rising
      
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + index * 0.05);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + index * 0.05 + 0.02);
        gain.gain.linearRampToValueAtTime(0.001, t + index * 0.05 + 0.45);
        
        osc.start(t + index * 0.05);
        osc.stop(t + index * 0.05 + 0.5);
      });
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  // Soft rhythmic ambient soundtrack generator for children that has zero external latency!
  startBackgroundMusic() {
    if (this.isMuted) return;
    if (this.musicInterval) return;
    
    try {
      let measure = 0;
      // Simple loop playing child-friendly happy tones
      this.musicInterval = setInterval(() => {
        if (this.isMuted) {
          this.stopBackgroundMusic();
          return;
        }
        
        try {
          this.init();
          if (!this.ctx) return;
          
          // Happy pentatonic kids scale
          const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5
          const patterns = [
            [2, 3, 4, 3, 2, 0, 1, 1], // Phrase 1
            [3, 4, 5, 4, 3, 2, 0, 0]  // Phrase 2
          ];
          
          const activePattern = patterns[Math.floor(measure / 8) % patterns.length];
          const noteIndex = activePattern[measure % 8];
          const freq = melody[noteIndex] / 2; // low register, extremely quiet base pad
          
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime); // Ambient soft sound
          
          // Extremely quiet volume so it is calming and soft on the ears
          gain.gain.setValueAtTime(0, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 0.1);
          gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
          
          osc.start();
          osc.stop(this.ctx.currentTime + 1.2);
          measure++;
        } catch (_) {}
      }, 1500);
    } catch (e) {
      console.warn('Audio check:', e);
    }
  }

  stopBackgroundMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sfx = new AudioEngine();
