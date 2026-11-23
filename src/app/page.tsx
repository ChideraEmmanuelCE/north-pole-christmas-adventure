"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const GameWorld = dynamic(() => import("@/components/GameWorld"), { ssr: false });
export default function Home() {
 const [started,setStarted] = useState(false);
 return <main className="game-shell"><div className="world"><GameWorld started={started}/><header className="topbar"><div className="brand"><span className="brand-mark">N</span><span>NORTH POLE<small>THE CHRISTMAS MISSION</small></span></div><div className="season-pill"><i/> CHRISTMAS EVE · 24 DEC</div></header><section className="mission-card"><div className="eyebrow">YOUR FIRST MISSION</div><h1>{started ? "Welcome to the North Pole" : "Christmas starts here."}</h1><p>{started ? "Explore the village, find the toy workshop and prepare for Christmas Eve." : "The workshop is waiting. The reindeer are ready. The world needs Santa."}</p><div className="progress"><span/><span/><span/><span/><span/></div><small>MISSION 01 · NORTH POLE ARRIVAL</small><button onClick={()=>setStarted(true)}>{started ? "CONTINUE EXPLORING" : "ENTER THE NORTH POLE"} <b>↗</b></button></section><aside className="right-hud"><div className="eyebrow">CHRISTMAS READINESS</div><strong>12%</strong><small>Preparations underway</small><hr/><p>TOYS MADE <b>0 / 120</b></p><p>GIFTS DELIVERED <b>0 / 250</b></p><p>REINDEER <b>8 READY</b></p></aside><div className="bottom-hud">● NORTH POLE VILLAGE <span>WASD / ARROWS TO MOVE · DRAG TO LOOK</span></div></div><footer>A NEW CHRISTMAS ADVENTURE IS BEING BUILT · OPTIMIZED FOR MOBILE</footer></main>;
}
