"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
const GameWorld=dynamic(()=>import("@/components/GameWorld"),{ssr:false});
type MoveInput={x:number;y:number};
type Toy="Teddy bear"|"Toy train"|"Toy car";
export default function Home(){
 const [started,setStarted]=useState(false),[input,setInput]=useState<MoveInput>({x:0,y:0}),[cameraYaw,setCameraYaw]=useState(0);
 const [nearWorkshop,setNearWorkshop]=useState(false),[selectedToy,setSelectedToy]=useState<Toy>("Teddy bear"),[inventory,setInventory]=useState<Record<Toy,number>>({"Teddy bear":0,"Toy train":0,"Toy car":0});
 const [notice,setNotice]=useState("");
 const joystickPointer=useRef<number|null>(null),lookPointer=useRef<number|null>(null),lastLookX=useRef(0);
 const onWorkshopNearby=useCallback((near:boolean)=>setNearWorkshop(near),[]);
 function updateJoystick(event:ReactPointerEvent<HTMLDivElement>){
  const b=event.currentTarget.getBoundingClientRect(),dx=event.clientX-(b.left+b.width/2),dy=event.clientY-(b.top+b.height/2),radius=b.width*.34,length=Math.max(1,Math.hypot(dx,dy)),scale=Math.min(1,radius/length);
  setInput({x:dx*scale/radius,y:dy*scale/radius});
 }
 function stopJoystick(){joystickPointer.current=null;setInput({x:0,y:0});}
 function startLook(event:ReactPointerEvent<HTMLDivElement>){if(!started||(event.target as HTMLElement).closest(".joystick,.factory-panel"))return;lookPointer.current=event.pointerId;lastLookX.current=event.clientX;}
 function moveLook(event:ReactPointerEvent<HTMLDivElement>){if(lookPointer.current!==event.pointerId)return;const delta=event.clientX-lastLookX.current;lastLookX.current=event.clientX;setCameraYaw(yaw=>yaw-delta*.006);}
 function manufacture(){setInventory(items=>({...items,[selectedToy]:items[selectedToy]+1}));setNotice(selectedToy+" added to Santa's gift inventory.");}
 const total=Object.values(inventory).reduce((sum,count)=>sum+count,0);
 return <main className="game-shell"><div className="world" onPointerDown={startLook} onPointerMove={moveLook} onPointerUp={()=>lookPointer.current=null} onPointerCancel={()=>lookPointer.current=null}>
  <GameWorld started={started} input={input} cameraYaw={cameraYaw} onWorkshopNearby={onWorkshopNearby}/>
  <header className="topbar"><div className="brand"><span className="brand-mark">N</span><span>NORTH POLE<small>THE CHRISTMAS MISSION</small></span></div><div className="season-pill"><i/> CHRISTMAS EVE · 24 DEC</div></header>
  {!started&&<section className="mission-card"><div className="eyebrow">YOUR FIRST MISSION</div><h1>Christmas starts here.</h1><p>The workshop is waiting. The reindeer are ready. The world needs Santa.</p><div className="progress"><span/><span/><span/><span/><span/></div><small>MISSION 01 · NORTH POLE ARRIVAL</small><button onClick={()=>setStarted(true)}>ENTER THE NORTH POLE <b>↗</b></button></section>}
  <aside className="right-hud"><div className="eyebrow">CHRISTMAS READINESS</div><strong>{Math.min(100,12+total)}%</strong><small>Preparations underway</small><hr/><p>TOYS MADE <b>{total} / 120</b></p><p>GIFTS DELIVERED <b>0 / 250</b></p><p>REINDEER <b>8 READY</b></p></aside>
  {started&&<div className="joystick" onPointerDown={event=>{event.stopPropagation();joystickPointer.current=event.pointerId;event.currentTarget.setPointerCapture(event.pointerId);updateJoystick(event);}} onPointerMove={event=>{if(joystickPointer.current===event.pointerId)updateJoystick(event);}} onPointerUp={stopJoystick} onPointerCancel={stopJoystick}><div className="joystick-knob" style={{transform:`translate(${input.x*25}px,${input.y*25}px)`}}/></div>}
  {started&&nearWorkshop&&<section className="factory-panel"><div className="eyebrow">NORTH POLE WORKSHOP</div><h2>Make a gift.</h2><p>Choose a toy to manufacture and add it to Santa's sleigh inventory.</p><div className="toy-options">{(["Teddy bear","Toy train","Toy car"] as Toy[]).map(toy=><button key={toy} className={selectedToy===toy?"selected":""} onClick={()=>setSelectedToy(toy)}>{toy}<small>{inventory[toy]} made</small></button>)}</div><button className="manufacture-button" onClick={manufacture}>MANUFACTURE {selectedToy.toUpperCase()} <span>+</span></button>{notice&&<small className="factory-notice">{notice}</small>}<div className="inventory-total">GIFT INVENTORY <b>{total} TOYS</b></div></section>}
  <div className="bottom-hud"><span>● NORTH POLE VILLAGE</span><span>{nearWorkshop?"WORKSHOP ACCESSIBLE":started?"LEFT STICK TO MOVE · DRAG TO LOOK":"A NEW CHRISTMAS ADVENTURE"}</span></div>
 </div><footer>THIRD-PERSON EXPLORATION · OPTIMIZED FOR MOBILE</footer></main>;
}
