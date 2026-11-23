"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, PerspectiveCamera, Stars } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type MoveInput = { x: number; y: number };
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}><mesh position={[0,.7,0]}><cylinderGeometry args={[.12,.18,1.4,7]}/><meshStandardMaterial color="#594031"/></mesh>{[.8,1.3,1.8].map((y,i)=><mesh key={i} position={[0,y,0]} castShadow><coneGeometry args={[.82-i*.13,1.2,8]}/><meshStandardMaterial color="#1b5146" roughness={.95}/></mesh>)}</group>;
}
function Cabin({position}:{position:[number,number,number]}) {
  return <group position={position}><mesh position={[0,1,0]} castShadow><boxGeometry args={[2.8,2,2.5]}/><meshStandardMaterial color="#79513d"/></mesh><mesh position={[0,2.3,0]} rotation={[0,Math.PI/4,0]} castShadow><coneGeometry args={[2.1,1.5,4]}/><meshStandardMaterial color="#314754"/></mesh><mesh position={[0,1.3,1.27]}><boxGeometry args={[.5,.55,.06]}/><meshStandardMaterial color="#ffd38a" emissive="#e7a84b" emissiveIntensity={1.4}/></mesh></group>;
}
function Workshop() {
  return <group position={[0,0,-7]}>
    <mesh position={[0,1.35,0]} castShadow><boxGeometry args={[5.5,2.7,4.2]}/><meshStandardMaterial color="#75452f" roughness={.82}/></mesh>
    <mesh position={[0,3,0]} rotation={[0,Math.PI/4,0]} castShadow><coneGeometry args={[4.1,2,4]}/><meshStandardMaterial color="#263f45"/></mesh>
    <mesh position={[0,1.2,2.12]}><boxGeometry args={[1.25,2.1,.12]}/><meshStandardMaterial color="#35251e"/></mesh>
    <mesh position={[-1.55,1.65,2.14]}><boxGeometry args={[.75,.8,.08]}/><meshStandardMaterial color="#ffd38a" emissive="#e7a84b" emissiveIntensity={2}/></mesh>
    <mesh position={[1.55,1.65,2.14]}><boxGeometry args={[.75,.8,.08]}/><meshStandardMaterial color="#ffd38a" emissive="#e7a84b" emissiveIntensity={2}/></mesh>
    <mesh position={[0,3.8,0]}><boxGeometry args={[2.8,.48,.18]}/><meshStandardMaterial color="#d7bd8b"/></mesh>
    <mesh position={[0,3.82,.12]}><boxGeometry args={[2.3,.24,.08]}/><meshStandardMaterial color="#283c3d"/></mesh>
    <pointLight position={[0,2.5,2.8]} color="#ffc979" intensity={8} distance={10}/>
  </group>;
}
function Santa({started,input,cameraYaw,onWorkshopNearby}:{started:boolean;input:MoveInput;cameraYaw:number;onWorkshopNearby:(near:boolean)=>void}) {
  const ref=useRef<THREE.Group>(null);
  const nearRef=useRef(false);
  const {camera}=useThree();
  useFrame((_,delta)=>{
    if(!ref.current)return;
    const santa=ref.current;
    const magnitude=Math.hypot(input.x,input.y);
    if(started&&magnitude>.08){
      const speed=3.4,fx=-Math.sin(cameraYaw),fz=-Math.cos(cameraYaw),rx=Math.cos(cameraYaw),rz=-Math.sin(cameraYaw);
      const dx=(rx*input.x+fx*-input.y)*speed*delta,dz=(rz*input.x+fz*-input.y)*speed*delta;
      santa.position.x=THREE.MathUtils.clamp(santa.position.x+dx,-22,22);
      santa.position.z=THREE.MathUtils.clamp(santa.position.z+dz,-22,22);
      santa.rotation.y=Math.atan2(dx,dz);
    }
    const near=Math.hypot(santa.position.x,santa.position.z+7)<5.2;
    if(near!==nearRef.current){nearRef.current=near;onWorkshopNearby(near);}
    const distance=8.5;
    const targetCamera=new THREE.Vector3(santa.position.x+Math.sin(cameraYaw)*distance,6.2,santa.position.z+Math.cos(cameraYaw)*distance);
    camera.position.lerp(targetCamera,1-Math.exp(-5*delta));
    camera.lookAt(santa.position.x,1.1,santa.position.z);
  });
  return <group ref={ref} position={[0,0,2]}><mesh position={[0,.9,0]} castShadow><capsuleGeometry args={[.36,.7,5,10]}/><meshStandardMaterial color="#a9252b"/></mesh><mesh position={[0,1.55,0]}><sphereGeometry args={[.3,16,16]}/><meshStandardMaterial color="#e9b995"/></mesh><mesh position={[0,1.9,0]}><coneGeometry args={[.28,.55,12]}/><meshStandardMaterial color="#b92a31"/></mesh><mesh position={[0,2.18,0]}><sphereGeometry args={[.1,12,12]}/><meshStandardMaterial color="#fff4e6"/></mesh><mesh position={[0,.43,.02]}><boxGeometry args={[.68,.12,.48]}/><meshStandardMaterial color="#252525"/></mesh></group>;
}
function Scene({started,input,cameraYaw,onWorkshopNearby}:{started:boolean;input:MoveInput;cameraYaw:number;onWorkshopNearby:(near:boolean)=>void}) {
  const trees=useMemo(()=>Array.from({length:36},(_,i)=>{const a=i/36*Math.PI*2,r=10+(i%4)*2;return {p:[Math.cos(a)*r,0,Math.sin(a)*r] as [number,number,number],s:.8+(i%4)*.12};}),[]);
  return <><color attach="background" args={["#081923"]}/><fog attach="fog" args={["#102a36",18,65]}/><PerspectiveCamera makeDefault position={[8,7,12]} fov={48}/><ambientLight intensity={.65}/><directionalLight position={[-8,14,7]} intensity={2} castShadow shadow-mapSize={[1024,1024]}/><pointLight position={[0,5,0]} color="#f3c98c" intensity={15} distance={24}/><Stars radius={75} depth={45} count={800} factor={3} fade speed={.2}/><Environment preset="night"/><Physics gravity={[0,-9.81,0]}><RigidBody type="fixed" colliders="cuboid"><mesh position={[0,-.35,0]} receiveShadow><boxGeometry args={[100,.5,100]}/><meshStandardMaterial color="#dce9ed"/></mesh></RigidBody><Cabin position={[-5,0,-5]}/><Cabin position={[5,0,-8]}/><Cabin position={[7,0,4]}/><Workshop/>{trees.map((t,i)=><Tree key={i} position={t.p} scale={t.s}/>)}<Santa started={started} input={input} cameraYaw={cameraYaw} onWorkshopNearby={onWorkshopNearby}/></Physics><ContactShadows position={[0,-.08,0]} opacity={.3} scale={25} blur={2.5}/></>;
}
export default function GameWorld({started,input,cameraYaw,onWorkshopNearby}:{started:boolean;input:MoveInput;cameraYaw:number;onWorkshopNearby:(near:boolean)=>void}) {
 return <Canvas dpr={[1,1.5]} shadows gl={{antialias:false,powerPreference:"high-performance",alpha:false}} performance={{min:.5}} onCreated={({gl})=>{gl.setPixelRatio(Math.min(window.devicePixelRatio,1.5));gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;}}><Suspense fallback={null}><Scene started={started} input={input} cameraYaw={cameraYaw} onWorkshopNearby={onWorkshopNearby}/></Suspense></Canvas>;
}
