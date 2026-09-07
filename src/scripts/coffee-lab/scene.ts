import * as T from 'three';
import {box,cylinder,sphere} from './models';
import {AssetLibrary,beanBagIds,type AssetId} from './assets';
import {interiorPalette as P,exteriorPalette as E} from './palette';
import {roundedLoop,sampleLoop,floorY,staffAisleZ,stationPositions,type Station} from './paths';

export function createWorld(scene:T.Scene,assets:AssetLibrary) {
  const world=new T.Group();world.name='Coffee-Lab';scene.add(world);
  const actors:ReturnType<AssetLibrary['actor']>[]=[];
  const place=(id:AssetId,parent:T.Object3D,x:number,y:number,z:number,angle=0,scale=1)=>{const root=assets.instantiate(id);root.position.set(x,y,z);root.rotation.y=angle;root.scale.setScalar(scale);parent.add(root);return root;};
  box(world,30,.55,26,'#92A188',0,-.38,0,.3);box(world,29.9,.1,25.9,E.road,0,-.06,0,.3);box(world,20,.30,16,E.pavement,0,.12,0,.35);
  for(let x=-9;x<=9;x++)box(world,.015,.006,15.5,'#BEC4BD',x,.274,0,0);
  for(let z=-7;z<=7;z++)box(world,19.5,.006,.015,'#BEC4BD',0,.275,z,0);
  for(let x=-10;x<=10;x+=2){box(world,.8,.014,.07,'#E8E7DC',x,.004,10.9,0);box(world,.8,.014,.07,'#E8E7DC',x,.004,-10.9,0);}
  for(let z=-8;z<=8;z+=2){box(world,.07,.014,.8,'#E8E7DC',12.55,.004,z,0);box(world,.07,.014,.8,'#E8E7DC',-12.55,.004,z,0);}
  for(const x of [-4.5,0,4.5])box(world,.05,.014,1.55,'#E8E7DC',x,.005,8.70,0);
  place('retro-hatchback-A',world,-2.3,0,8.65,Math.PI/2,.68);place('retro-sedan-A',world,2.3,0,8.65,Math.PI/2,.68);
  const cafe=new T.Group();cafe.name='Cafe-interior';world.add(cafe);box(cafe,11,.15,8.6,P.limestone,0,.35,0,.06);
  const backWall=box(cafe,10.8,3.5,.20,P.limestone,0,2.18,-4.15),sideWall=box(cafe,.20,3.5,8.3,P.limestone,-5.3,2.18,0);
  const wave=place('wave-wall',cafe,-5.16,floorY,1.25,Math.PI/2,1.22);
  for(const x of [-3.5,-1.75,0,1.75])place('fluted-counter',cafe,x,floorY,-.90);
  box(cafe,8.45,.80,.62,P.rust,-.5,floorY+.4,-3.62,.045);box(cafe,8.6,.06,.74,P.limestone,-.5,floorY+.83,-3.62,.035);box(cafe,5.6,.07,.32,P.rust,-.9,2.45,-3.87);
  const beanShelf=new T.Group();beanShelf.name='Bean-display';cafe.add(beanShelf);
  beanBagIds.forEach((id,i)=>{for(let copy=0;copy<2;copy++)place(id,beanShelf,-3.15+i*1.10+copy*.34,2.485,-3.84,0,2.2);});
  for(const x of [1.35,1.70])place('cup',cafe,x,2.485,-3.84,0,1.35);
  const worktop=floorY+.96;
  place('grinder',cafe,stationPositions.grinder,worktop,-.90,Math.PI,1.22);place('espresso-machine',cafe,stationPositions.espresso,worktop,-.90,Math.PI,1.5);
  place('milk-pitcher',cafe,1.38,worktop,-1.02,0,1.5);place('tamper',cafe,-2.59,worktop,-1.04,0,1.5);place('portafilter',cafe,-2.20,worktop,-1.02,Math.PI/2,1.4);
  for(let i=0;i<3;i++){place('saucer',cafe,1.75+i*.24,worktop,-.91,0,1.35);place('cup',cafe,1.75+i*.24,worktop+.017,-.91,0,1.35);}
  for(const z of [-.25,2.15]){place('banquette',cafe,4.63,floorY,z,-Math.PI/2);place('pedestal-table',cafe,3.45,floorY,z);place('wire-chair',cafe,2.58,floorY,z,-Math.PI/2);place('cup',cafe,3.6,floorY+.72,z,0,1.25);}
  for(const x of [-3.5,-.5]){place('pedestal-table',cafe,x,floorY,2.35);place('wire-chair',cafe,x-.78,floorY,2.35,Math.PI/2);place('wire-chair',cafe,x+.78,floorY,2.35,-Math.PI/2);place('saucer',cafe,x,floorY+.72,2.35,0,1.25);place('cup',cafe,x,floorY+.736,2.35,0,1.25);}
  place('interior-planter',cafe,-4.60,floorY,3.45);place('interior-planter',cafe,4.68,floorY,3.62,0,.65);
  const fixtures=new T.Group();fixtures.name='ceiling-fixtures';cafe.add(fixtures);for(const z of [-2,1,3]){cylinder(fixtures,.025,.6,P.rust,0,3.59,z);cylinder(fixtures,.28,.04,P.rust,0,3.27,z);sphere(fixtures,.11,P.limestone,0,3.15,z);}
  const shell=new T.Group();shell.name='Exterior-shell';cafe.add(shell);box(shell,11,.22,8.8,P.rust,0,4.06,0,.06);box(shell,10.5,.06,8.2,P.clay,0,4.20,0);place('garden-storefront',shell,2.60,floorY,4.07);
  const glass=new T.MeshPhysicalMaterial({color:'#E1E9DD',transparent:true,opacity:.18,roughness:.18,depthWrite:false,side:T.DoubleSide});
  for(const x of [-5.3,-3.2,-1.1,1.15,5.3])box(shell,.12,3.45,.13,P.rust,x,2.15,4.07);
  for(const [x,w] of [[-4.25,1.98],[-2.15,1.98],[.0,2.1],[4.73,1.0]]){const pane=new T.Mesh(new T.PlaneGeometry(w,2.8),glass);pane.position.set(x,2.07,4.08);shell.add(pane);}
  box(shell,6.45,.30,.20,P.limestone,-2.075,.58,4.07);box(shell,6.45,.34,.20,P.limestone,-2.075,3.78,4.07);
  for(const z of [-3.9,-1.3,1.3,3.9])box(shell,.14,3.45,.13,P.rust,5.3,2.15,z);
  for(const z of [-2.6,0,2.6]){const pane=new T.Mesh(new T.PlaneGeometry(2.5,3.2),glass);pane.rotation.y=Math.PI/2;pane.position.set(5.3,2.12,z);shell.add(pane);}box(shell,.20,.35,8.2,P.limestone,5.3,3.78,0);
  for(const [x,z] of [[-8,-5],[8,-5],[-8,4],[8,4],[-3,-6.2],[3,-6.2]])place('planter-tree',world,x,.28,z,0,1.05);
  for(const x of [-7,7])place('streetlight',world,x,.28,5.9,Math.PI/2);place('garden-bench',world,-6.6,.28,-.35,Math.PI/2);place('garden-bench',world,6.6,.28,-.35,-Math.PI/2);place('open-sign',world,1.15,.28,5.3,-.15);place('interior-planter',world,-4.8,.28,5.2,0,.8);
  const clouds:T.Group[]=[];for(let i=0;i<4;i++){const g=new T.Group();g.position.set(-12+i*8,9+i%2*2,-13);world.add(g);for(let k=0;k<4;k++){const puff=sphere(g,.85,'#EFF4F2',k*.9,Math.sin(k*2)*.3,0);puff.scale.set(1.6,.6,.85);puff.castShadow=false;}clouds.push(g);}
  const lanes=[roundedLoop(11.6,10.15,2.4),roundedLoop(13.45,11.85,2.8)];
  const traffic=Array.from({length:6},(_,i)=>{const a=assets.actor((['retro-hatchback-A','retro-sedan-A','retro-van-A'] as const)[i%3]);a.root.scale.setScalar(.68);world.add(a.root);actors.push(a);return {...a,path:lanes[i%2],distance:Math.floor(i/2)*25,speed:i%2?-2.0:2.0};});
  const sidewalk=roundedLoop(9.35,7.35,.6);
  const walkers=Array.from({length:6},(_,i)=>{const a=assets.actor((['npc-curly-B','npc-cyclist-B','npc-elder-B','npc-creative-B'] as const)[i%4]);world.add(a.root);a.play('Walk',.55/.9,0);actors.push(a);return {...a,distance:i*10,speed:.55};});
  const barista=assets.actor('barista-A');barista.root.position.set(1.5,floorY,staffAisleZ);cafe.add(barista.root);barista.play('Idle',1,0);actors.push(barista);
  const stations=new Map<T.Object3D,Station>();for(const [name,x] of Object.entries(stationPositions)){const target=box(cafe,.85,.022,.22,P.olive,x,worktop+.022,-.60,.055);target.name=`station-${name}`;stations.set(target,name as Station);target.visible=false;}
  let settle=0;let indoor=false,destination=1.5,walking=false,selected:Station='finish',arrived:((name:Station)=>void)|undefined;
  const turn=(root:T.Object3D,angle:number,dt:number)=>{const difference=Math.atan2(Math.sin(angle-root.rotation.y),Math.cos(angle-root.rotation.y));root.rotation.y+=Math.sign(difference)*Math.min(Math.abs(difference),dt*5.5);return Math.abs(difference)<.09;};
  function selectStation(name:Station,onArrival:(name:Station)=>void){selected=name;destination=stationPositions[name];arrived=onArrival;walking=true;}
  const city=new T.Group();city.name='City-exterior';for(const child of [...world.children])if(child!==cafe)city.add(child);world.add(city);
  function cancelStation(){walking=false;arrived=undefined;barista.play('Idle');settle=.25;}
  function setInterior(value:boolean){indoor=value;city.visible=shell.visible=fixtures.visible=!value;stations.forEach((_,o)=>o.visible=value);if(!value)cancelStation();}
  function update(dt:number,time:number,ambient=true){
    if(ambient){traffic.forEach(a=>{a.distance+=dt*a.speed;const p=sampleLoop(a.path,a.distance);a.root.position.copy(p.position);a.root.rotation.y=p.heading+(a.speed<0?Math.PI:0);a.play('WheelRoll',-Math.abs(a.speed)/(2*Math.PI*.29*.68),0);a.update(dt);});walkers.forEach(a=>{a.distance+=dt*a.speed;const p=sampleLoop(sidewalk,a.distance);a.root.position.copy(p.position);a.root.position.y=.28;a.root.rotation.y=p.heading;a.update(dt);});clouds.forEach((c,i)=>c.position.x=-12+i*8+Math.sin(time*.035+i)*1.4);}
    if(indoor&&walking){const delta=destination-barista.root.position.x;if(Math.abs(delta)>.003){const facing=turn(barista.root,Math.sign(delta)*Math.PI/2,dt);barista.play(facing?'Walk':'Idle',facing ? .85/.9 : 1);if(facing)barista.root.position.x+=Math.sign(delta)*Math.min(Math.abs(delta),dt*.85);}else{barista.root.position.x=destination;barista.play('Idle');settle=.25;if(turn(barista.root,0,dt)){barista.root.rotation.y=0;walking=false;arrived?.(selected);}}}
    if(indoor&&(ambient||walking||settle>0))barista.update(dt);settle=Math.max(0,settle-dt);
  }
  update(0,0);
  function updateCutaway(camera:T.Camera){backWall.visible=!indoor||camera.position.z>-3.8;sideWall.visible=wave.visible=!indoor||camera.position.x>-4.8;}
  function dispose(){actors.forEach(a=>a.stop());}
  return {world,stations,selectStation,cancelStation,setInterior,update,updateCutaway,dispose,barista,traffic,walkers};
}

