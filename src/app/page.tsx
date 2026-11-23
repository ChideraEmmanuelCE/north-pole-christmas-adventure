"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const GameWorld = dynamic(() => import("@/components/GameWorld"), { ssr: false });
type MoveInput = { x: number; y: number };

export default function Home() {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState<MoveInput>({ x: 0, y: 0 });
  const [cameraYaw, setCameraYaw] = useState(0);
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickPointer = useRef<number | null>(null);
  const lookPointer = useRef<number | null>(null);
  const lastLookX = useRef(0);

  function updateJoystick(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height / 2);
    const radius = bounds.width * .34;
    const length = Math.max(1, Math.hypot(dx, dy));
    const scale = Math.min(1, radius / length);
    setInput({ x: (dx * scale) / radius, y: (dy * scale) / radius });
  }
  function stopJoystick() { joystickPointer.current = null; setInput({ x: 0, y: 0 }); }
  function startLook(event: ReactPointerEvent<HTMLDivElement>) {
    if (!started || (event.target as HTMLElement).closest(".joystick")) return;
    lookPointer.current = event.pointerId;
    lastLookX.current = event.clientX;
  }
  function moveLook(event: ReactPointerEvent<HTMLDivElement>) {
    if (lookPointer.current !== event.pointerId) return;
    const delta = event.clientX - lastLookX.current;
    lastLookX.current = event.clientX;
    setCameraYaw((yaw) => yaw - delta * .006);
  }
  function stopLook() { lookPointer.current = null; }

  return <main className="game-shell">
    <div className="world" onPointerDown={startLook} onPointerMove={moveLook} onPointerUp={stopLook} onPointerCancel={stopLook}>
      <GameWorld started={started} input={input} cameraYaw={cameraYaw} />
      <header className="topbar"><div className="brand"><span className="brand-mark">N</span><span>NORTH POLE<small>THE CHRISTMAS MISSION</small></span></div><div className="season-pill"><i /> CHRISTMAS EVE · 24 DEC</div></header>
      {!started && <section className="mission-card"><div className="eyebrow">YOUR FIRST MISSION</div><h1>Christmas starts here.</h1><p>The workshop is waiting. The reindeer are ready. The world needs Santa.</p><div className="progress"><span /><span /><span /><span /><span /></div><small>MISSION 01 · NORTH POLE ARRIVAL</small><button onClick={() => setStarted(true)}>ENTER THE NORTH POLE <b>↗</b></button></section>}
      <aside className="right-hud"><div className="eyebrow">CHRISTMAS READINESS</div><strong>12%</strong><small>Preparations underway</small><hr /><p>TOYS MADE <b>0 / 120</b></p><p>GIFTS DELIVERED <b>0 / 250</b></p><p>REINDEER <b>8 READY</b></p></aside>
      {started && <div className="joystick" ref={joystickRef} onPointerDown={(event) => { event.stopPropagation(); joystickPointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); updateJoystick(event); }} onPointerMove={(event) => { if (joystickPointer.current === event.pointerId) updateJoystick(event); }} onPointerUp={stopJoystick} onPointerCancel={stopJoystick}><div className="joystick-knob" style={{ transform: `translate(${input.x * 25}px, ${input.y * 25}px)` }} /></div>}
      <div className="bottom-hud"><span>● NORTH POLE VILLAGE</span><span>{started ? "LEFT STICK TO MOVE · DRAG TO LOOK" : "A NEW CHRISTMAS ADVENTURE"}</span></div>
    </div>
    <footer>THIRD-PERSON EXPLORATION · OPTIMIZED FOR MOBILE</footer>
  </main>;
}
