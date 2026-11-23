"use client";

import { useEffect, useRef, useState } from "react";

type AudioContextWindow = typeof window & { webkitAudioContext?: typeof AudioContext };
const melody = [
  659.25,659.25,659.25,659.25,659.25,659.25,659.25,783.99,
  523.25,587.33,659.25,0,698.46,698.46,698.46,698.46,
  698.46,659.25,659.25,659.25,659.25,587.33,587.33,659.25,
  587.33,783.99,0,0,659.25,659.25,659.25,659.25
];

export default function ChristmasAudio() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stepRef = useRef(0);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    void contextRef.current?.close();
  }, []);

  function playNote(frequency: number, start: number, duration: number, volume: number, wave: OscillatorType) {
    const context = contextRef.current;
    const master = masterRef.current;
    if (!context || !master || frequency === 0) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function schedulePhrase() {
    const context = contextRef.current;
    if (!context) return;
    const beat = 60 / 112;
    const start = context.currentTime + 0.06;
    for (let i = 0; i < melody.length; i++) {
      const note = melody[(stepRef.current + i) % melody.length];
      const at = start + i * beat * 0.5;
      if (note) {
        playNote(note, at, beat * 0.43, 0.11, "sine");
        playNote(note * 2, at, beat * 0.24, 0.035, "triangle");
      }
      if (i % 4 === 0) {
        const bass = [130.81, 174.61, 196, 174.61][Math.floor((stepRef.current + i) / 4) % 4];
        playNote(bass, at, beat * 1.7, 0.045, "triangle");
      }
    }
    stepRef.current = (stepRef.current + melody.length) % melody.length;
  }

  async function toggleMusic() {
    if (playing) {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
      setPlaying(false);
      return;
    }
    const AudioContextClass = window.AudioContext || (window as AudioContextWindow).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!contextRef.current) {
      contextRef.current = new AudioContextClass();
      masterRef.current = contextRef.current.createGain();
      masterRef.current.gain.value = muted ? 0 : 0.55;
      masterRef.current.connect(contextRef.current.destination);
    }
    await contextRef.current.resume();
    schedulePhrase();
    timerRef.current = window.setInterval(schedulePhrase, melody.length * (60 / 112) * 500);
    setPlaying(true);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (masterRef.current) masterRef.current.gain.setTargetAtTime(next ? 0 : 0.55, contextRef.current!.currentTime, 0.08);
  }

  return (
    <div className="audio-control" aria-label="Christmas soundtrack controls">
      <button className={playing ? "audio-main is-playing" : "audio-main"} onClick={toggleMusic} aria-pressed={playing}>
        <span className="audio-indicator" />
        {playing ? "SOUNDTRACK ON" : "PLAY SOUNDTRACK"}
      </button>
      <button className="audio-mute" onClick={toggleMute} aria-label={muted ? "Unmute soundtrack" : "Mute soundtrack"}>{muted ? "UNMUTE" : "MUTE"}</button>
      <span className="audio-caption">ORIGINAL JINGLE BELLS ARRANGEMENT</span>
    </div>
  );
}
