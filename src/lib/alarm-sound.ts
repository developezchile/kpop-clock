"use client";

const SONG_SRC = "/alarm.mp3";

export class AlarmSound {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private audio: HTMLAudioElement | null = null;
  private useSong: boolean;

  constructor(useSong = false) {
    this.useSong = useSong;
  }

  private beep() {
    if (!this.ctx) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.start();
    oscillator.stop(this.ctx.currentTime + 0.4);
  }

  private startBeep() {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new AudioContextCtor();
    this.beep();
    this.intervalId = setInterval(() => this.beep(), 700);
  }

  private startSong() {
    this.audio = new Audio(SONG_SRC);
    this.audio.loop = true;
    this.audio.volume = 0.8;
    this.audio.play().catch(() => {
      // autoplay may be blocked without a prior user gesture; fall back to beep
      this.startBeep();
    });
  }

  start() {
    if (this.intervalId || this.audio) return;
    if (this.useSong) {
      this.startSong();
    } else {
      this.startBeep();
    }
    if (navigator.vibrate) {
      navigator.vibrate([400, 200, 400, 200, 400]);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  }
}
