import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { interiorPalette as P } from './palette';
const materials = new Map<string,T.MeshStandardMaterial>();
const boxes = new Map<string,T.BufferGeometry>();
export function material(color:string,metalness=0) {
  const key=color+metalness;
  if(!materials.has(key)) materials.set(key,new T.MeshStandardMaterial({color,roughness:metalness?0.35:0.78,metalness}));
  return materials.get(key)!;
}
export function mesh(parent:T.Object3D,geometry:T.BufferGeometry,color:string,x=0,y=0,z=0) {
  const m=new T.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
export function box(parent:T.Object3D,w:number,h:number,d:number,color:string,x=0,y=0,z=0,round=0.025) {
  const key=[w,h,d,round].join(',');
  if(!boxes.has(key)) boxes.set(key,round?new RoundedBoxGeometry(w,h,d,2,Math.min(round,w/3,h/3,d/3)):new T.BoxGeometry(w,h,d));
  return mesh(parent,boxes.get(key)!,color,x,y,z);
}
export function cylinder(parent:T.Object3D,r:number,h:number,color:string,x=0,y=0,z=0,top=r) {return mesh(parent,new T.CylinderGeometry(top,r,h,16),color,x,y,z);}
export function sphere(parent:T.Object3D,r:number,color:string,x=0,y=0,z=0){return mesh(parent,new T.SphereGeometry(r,14,10),color,x,y,z);}
export function label(parent:T.Object3D,text:string,w:number,h:number,x:number,y:number,z:number,color:string=P.rust,bg:string=P.limestone) {
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 96px Georgia';ctx.fillText(text,512,140,970);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture}));m.position.set(x,y,z);parent.add(m);return m;
}
export function cup(parent:T.Object3D,x:number,y:number,z:number) {
  cylinder(parent,.10,.024,P.limestone,x,y,z);
  cylinder(parent,.066,.13,P.limestone,x,y+.075,z,.085);
  cylinder(parent,.067,.006,P.rust,x,y+.145,z);
  const handle=mesh(parent,new T.TorusGeometry(.035,.012,6,12),P.limestone,x+.083,y+.08,z);handle.rotation.y=Math.PI/2;
}
export function plant(parent:T.Object3D,x:number,y:number,z:number,size=1,interior=false) {
  const g=new T.Group();parent.add(g);g.position.set(x,y,z);
  cylinder(g,.30*size,.50*size,interior?P.rust:'#AAA99A',0,.25*size,0,.36*size);
  cylinder(g,.29*size,.025*size,P.rust,0,.51*size,0);
  for(let i=0;i<9;i++) { const angle=i*2.4;const leaf=sphere(g,.19*size,interior?P.olive:'#507948',Math.cos(angle)*.23*size,(.7+i*.05)*size,Math.sin(angle)*.23*size);leaf.scale.set(.7,2.2,.65);leaf.rotation.z=Math.sin(angle)*.6; }
  return g;
}
export function tree(parent:T.Object3D,x:number,z:number,scale=1) {
  const g=new T.Group();g.position.set(x,.22,z);g.scale.setScalar(scale);parent.add(g);
  box(g,1.6,.12,1.6,'#A8B393',0,.06,0,.1);cylinder(g,.13,2.4,'#76614A',0,1.2,0);
  for(let i=0;i<6;i++){const a=i*2.4;const crown=sphere(g,1,'#567E50',Math.cos(a)*.45,2.5+(i%3)*.4,Math.sin(a)*.45);crown.scale.set(1,1.18,1);}
  return g;
}
export function car(color:string) {
  const g=new T.Group();box(g,1.02,.42,1.95,color,0,.50,0,.16);box(g,.83,.43,1.03,'#374C56',0,.86,-.12,.13);box(g,.88,.07,1.06,color,0,1.08,-.12,.04);
  for(const x of [-.46,.46]) box(g,.045,.38,.07,color,x,.88,-.15);
  box(g,.86,.12,.10,'#EEE8D5',0,.47,.99);box(g,.85,.10,.08,'#383E40',0,.34,.99);
  for(const x of [-.35,.35]){box(g,.19,.12,.045,'#FFF5D2',x,.62,1.00);box(g,.19,.10,.045,'#A74232',x,.60,-1.00);}
  const wheels:T.Mesh[]=[];
  for(const x of [-.52,.52])for(const z of [-.63,.63]){const wheel=cylinder(g,.23,.13,'#303638',x,.25,z);wheel.rotation.z=Math.PI/2;wheels.push(wheel);const hub=cylinder(g,.12,.14,'#B2B7B4',x,.25,z);hub.rotation.z=Math.PI/2;}
  return {root:g,wheels};
}
export function person(shirt:string=P.olive,apron=false) {
  const root=new T.Group();const body=new T.Group();root.add(body);
  box(body,.38,.44,.26,shirt,0,.88,0,.10);
  sphere(body,.26,'#C88F69',0,1.30,0);
  const hair=sphere(body,.269,P.rust,0,1.39,-.025);hair.scale.set(1,.69,.98);
  for(const x of [-.085,.085])sphere(body,.022,'#302921',x,1.30,.244);
  sphere(body,.04,'#C88F69',0,1.24,.26);
  if(apron){box(body,.31,.41,.04,P.clay,0,.82,.15,.035);box(body,.16,.12,.02,P.rust,0,.79,.18);box(body,.075,.3,.03,P.clay,-.11,1,.145);box(body,.075,.3,.03,P.clay,.11,1,.145);}
  const arms=[-1,1].map(side=>{const g=new T.Group();g.position.set(side*.25,1.02,0);body.add(g);cylinder(g,.068,.30,shirt,0,-.13,0);sphere(g,.072,'#C88F69',0,-.31,0);return g;});
  const legs=[-1,1].map(side=>{const upper=cylinder(root,.076,.31,P.rust);const lower=cylinder(root,.067,.30,P.rust);const foot=box(root,.15,.09,.25,P.rust,side*.105,.045,.04,.04);return {upper,lower,foot,side};});
  const up=new T.Vector3(0,1,0);
  function bone(m:T.Mesh,a:T.Vector3,b:T.Vector3,length:number){m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());m.scale.y=a.distanceTo(b)/length;}
  // Articulated procedural walk: feet stay on the pavement for the stance half of each cycle.
  // This is a replaceable preview actor, not a final skinned Haniff character.
  function pose(distance:number,blend:number) {
    const phase=distance/.62;
    legs.forEach(({upper,lower,foot,side},i)=>{
      const t=((phase+i*.5)%1+1)%1;
      const stance=t<.5;
      const z=(stance?.155-t*.62:-.155+(t-.5)*.62)*blend;
      const lift=stance?0:Math.sin((t-.5)*Math.PI*2)*.10*blend;
      const ankle=new T.Vector3(side*.105,.09+lift,z);
      const hip=new T.Vector3(side*.105,.64,0);
      const middle=hip.clone().add(ankle).multiplyScalar(.5);
      const length=hip.distanceTo(ankle);middle.z+=Math.sqrt(Math.max(0,.305**2-(length/2)**2));
      bone(upper,hip,middle,.31);bone(lower,middle,ankle,.30);foot.position.set(side*.105,.045+lift,z+.04);
    });
    arms[0].rotation.x=Math.sin(phase*Math.PI*2)*.4*blend;arms[1].rotation.x=-arms[0].rotation.x;
  }
  pose(0,0);return {root,pose};
}
