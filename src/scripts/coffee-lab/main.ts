/// <reference types="vite/client" />
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createWorld } from './scene';
import { AssetLibrary } from './assets';
import { exteriorPalette as E } from './palette';
import { type Station } from './paths';
import {cameraPose} from './camera';
import {createMenuSession,getDrink} from './menu';

export async function startCoffeeLab() {
  const canvas=document.querySelector<HTMLCanvasElement>('#world');if(!canvas||canvas.dataset.ready)return;
  canvas.dataset.ready='true';
  const el=<K extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as K;
  const listeners: (()=>void)[]=[];
  function on(target:EventTarget,event:string,handler:EventListener,options?:AddEventListenerOptions){target.addEventListener(event,handler,options);listeners.push(()=>target.removeEventListener(event,handler,options));}
  let renderer:T.WebGLRenderer|undefined;let library:AssetLibrary|undefined;let frame=0;let disposed=false;let leftDuringLoad=false;
  const cancelLoading=()=>{leftDuringLoad=true;};
  on(document,'astro:before-swap',cancelLoading,{once:true});
  on(window,'pagehide',cancelLoading,{once:true});
  try {
    renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.setClearColor(E.sky);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.outputColorSpace=T.SRGBColorSpace;
    const scene=new T.Scene();scene.background=new T.Color(E.sky);scene.fog=new T.Fog(E.sky,65,110);
    scene.add(new T.HemisphereLight('#FFF7E8','#8E9D84',2.2));
    const sun=new T.DirectionalLight('#FFF0D6',3.4);sun.position.set(-12,22,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-23;sun.shadow.camera.right=23;sun.shadow.camera.top=23;sun.shadow.camera.bottom=-23;sun.shadow.camera.far=70;sun.shadow.normalBias=.025;sun.shadow.bias=-.0001;scene.add(sun);
    const camera=new T.PerspectiveCamera(38,1,.1,140);
    const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minPolarAngle=.30;controls.maxPolarAngle=1.24;controls.autoRotateSpeed=.35;
    renderer.clear();
    library=await AssetLibrary.load((done,total)=>{if(!leftDuringLoad)el('enter').textContent=`Loading café · ${Math.round(done/total*100)}%`;});
    if(leftDuringLoad){library.dispose();controls.dispose();renderer.dispose();listeners.forEach(fn=>fn());delete canvas.dataset.ready;return;}
    const world=createWorld(scene,library);
    const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches,paused=false,inside=false,auto=!reduced;
    let tween:{elapsed:number,from:T.Vector3,to:T.Vector3,fromTarget:T.Vector3,toTarget:T.Vector3}|null=null;
    const mobile=()=>window.innerWidth<=650;
    const session=createMenuSession();
    const pose=()=>cameraPose(inside,session.station,mobile());
    function syncControls(){
      controls.autoRotate=auto&&!inside&&!reduced&&!tween;el('orbit').setAttribute('aria-pressed',String(auto&&!inside&&!reduced));el<HTMLButtonElement>('orbit').disabled=reduced||inside;
      el('motion').hidden=inside;
      el('motion').setAttribute('aria-pressed',String(paused||reduced));el('motion').textContent=paused||reduced?'Resume city':'Pause city';
      el<HTMLInputElement>('reduced-motion').checked=reduced;
    }
    function resize(){
      const w=canvas!.clientWidth,h=canvas!.clientHeight;renderer!.setSize(w,h,false);camera.aspect=w/h;
      camera.setViewOffset(w,h,mobile()?0:-w*.13,mobile()?h*.15:0,w,h);camera.updateProjectionMatrix();
      // Portrait requires a greater distance to fit the island horizontally.
      if(!tween){const offset=camera.position.clone().sub(controls.target);const min=inside?(mobile()?15:8):(mobile()?48:26);if(offset.length()<min)camera.position.copy(controls.target).add(offset.setLength(min));}
    }
    function stopOrbit(){auto=false;syncControls();}
    function reset(animate=true){
      stopOrbit();const {position:to,target:toTarget}=pose();
      controls.minDistance=inside?(mobile()?15:8):(mobile()?38:24);controls.maxDistance=inside?35:80;
      if(reduced||!animate){tween=null;camera.position.copy(to);controls.target.copy(toTarget);controls.enabled=true;}
      else {tween={elapsed:0,from:camera.position.clone(),to,fromTarget:controls.target.clone(),toTarget};controls.enabled=false;}
      syncControls();
    }
    function enter(value:boolean){
      session.clear();world.cancelStation();el('menu-picker').hidden=false;el('recipe-panel').hidden=true;
      document.querySelectorAll('[data-drink],[data-station]').forEach(b=>b.setAttribute('aria-pressed','false'));
      inside=value;world.setInterior(value);el('welcome').hidden=value;el('interior').hidden=!value;
      scene.background=new T.Color(value?'#E5DED2':E.sky);scene.fog=value?null:new T.Fog(E.sky,65,110);
      el('view-label').textContent=value?'INTERIOR VIEW':'EXTERIOR VIEW';reset();
      (value?document.querySelector<HTMLButtonElement>('[data-drink]'):el<HTMLButtonElement>('enter'))?.focus({preventScroll:true});
    }
    function station(name:Station){if(!inside||!session.visit(name))return;reset();el('view-label').textContent='BEHIND THE BARISTA';el('station-note').textContent='Your barista is walking to the '+(name==='finish'?'finishing station':name)+'…';document.querySelectorAll<HTMLButtonElement>('[data-station]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.station===name)));world.selectStation(name,n=>{const drink=getDrink(session.drink??'');if(!drink)return;const notes:Record<Station,string>={grinder:`${drink.name} starts with freshly ground coffee. Bean selection and grinding will be part of the brewing lesson.`,espresso:'Prepare and extract your espresso. Dose, grind and yield work together; a recipe is a starting point, not one rule for every bean.',finish:drink.finish};el('station-note').textContent=notes[n];});}
    document.querySelectorAll<HTMLButtonElement>('[data-drink]').forEach(b=>on(b,'click',()=>{if(!inside||!session.choose(b.dataset.drink??''))return;const drink=getDrink(session.drink!)!;el('drink-title').textContent=drink.name;el('drink-ingredients').textContent=drink.ingredients;el('menu-picker').hidden=true;el('recipe-panel').hidden=false;el('station-note').textContent='Your drink is selected. Start at the grinder, or explore another station.';document.querySelectorAll('[data-drink]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));document.querySelector<HTMLButtonElement>('[data-station="grinder"]')?.focus({preventScroll:true});}));
    on(el('change-drink'),'click',()=>{world.cancelStation();session.clear();el('menu-picker').hidden=false;el('recipe-panel').hidden=true;document.querySelectorAll('[data-drink],[data-station]').forEach(b=>b.setAttribute('aria-pressed','false'));el('view-label').textContent='INTERIOR VIEW';reset();document.querySelector<HTMLButtonElement>('[data-drink]')?.focus({preventScroll:true});});
    on(el('enter'),'click',()=>enter(true));on(el('outside'),'click',()=>enter(false));
    document.querySelectorAll<HTMLButtonElement>('[data-station]').forEach(b=>on(b,'click',()=>station(b.dataset.station as Station)));
    on(el('reset'),'click',()=>reset());on(el('orbit'),'click',()=>{if(reduced||inside)return;auto=!auto;if(tween){tween=null;controls.enabled=true;}syncControls();});
    on(el('motion'),'click',()=>{if(reduced){reduced=false;paused=false;}else paused=!paused;syncControls();});
    on(el('settings'),'click',()=>{const panel=el('preferences');panel.hidden=!panel.hidden;el('settings').setAttribute('aria-expanded',String(!panel.hidden));});
    function applyReduced(value:boolean){reduced=value;if(value){auto=false;if(tween){camera.position.copy(tween.to);controls.target.copy(tween.toTarget);tween=null;controls.enabled=true;}}syncControls();}
    on(el('reduced-motion'),'change',()=>applyReduced(el<HTMLInputElement>('reduced-motion').checked));
    on(media,'change',()=>applyReduced(media.matches));
    on(el('quality'),'change',()=>{const q=el<HTMLSelectElement>('quality').value;renderer!.setPixelRatio(Math.min(devicePixelRatio,q==='low'?1:q==='high'?2:1.5));renderer!.shadowMap.enabled=q!=='low';scene.traverse(object=>{if(object instanceof T.Mesh){const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(m=>m.needsUpdate=true);}});resize();});
    function adjust(rotation=0,zoom=1){stopOrbit();tween=null;controls.enabled=true;const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new T.Vector3(0,1,0),rotation);offset.setLength(T.MathUtils.clamp(offset.length()*zoom,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);}
    on(el('left'),'click',()=>adjust(.22));on(el('right'),'click',()=>adjust(-.22));on(el('zoom-in'),'click',()=>adjust(0,.86));on(el('zoom-out'),'click',()=>adjust(0,1.16));
    on(canvas,'keydown',(e)=>{const event=e as KeyboardEvent;const actions:Record<string,()=>void>={ArrowLeft:()=>adjust(.15),ArrowRight:()=>adjust(-.15),'+':()=>adjust(0,.9),'-':()=>adjust(0,1.1),'=':()=>adjust(0,.9),Home:()=>reset()};if(actions[event.key]){event.preventDefault();actions[event.key]();}});
    controls.addEventListener('start',stopOrbit);
    let down:{x:number,y:number,id:number}|null=null;
    on(canvas,'pointerdown',e=>{const p=e as PointerEvent;down={x:p.clientX,y:p.clientY,id:p.pointerId};});
    on(canvas,'pointercancel',()=>{down=null;});
    on(canvas,'pointerup',e=>{
      const p=e as PointerEvent;if(!down||p.pointerId!==down.id)return;const start=down;down=null;
      if(!inside||tween||Math.hypot(p.clientX-start.x,p.clientY-start.y)>6)return;
      const rect=canvas!.getBoundingClientRect();const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((p.clientX-rect.left)/rect.width*2-1,-(p.clientY-rect.top)/rect.height*2+1),camera);
      const hit=ray.intersectObjects([...world.stations.keys()])[0];if(hit)station(world.stations.get(hit.object)!);
    });
    on(window,'resize',resize);
    on(canvas,'webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);el('error-detail').textContent='The graphics connection was interrupted. Reload the café to continue.';el('error').hidden=false;});
    camera.position.copy(pose().position);controls.target.copy(pose().target);controls.minDistance=24;controls.maxDistance=80;resize();syncControls();
    let last=performance.now(),elapsed=0;
    function render(now:number){if(disposed)return;frame=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;
      if(tween){tween.elapsed+=dt;const t=Math.min(tween.elapsed/1.6,1),smooth=t*t*(3-2*t);camera.position.lerpVectors(tween.from,tween.to,smooth);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,smooth);if(t===1){tween=null;controls.enabled=true;syncControls();}}
      controls.enableDamping=!reduced;controls.update(dt);if(!paused&&!reduced)elapsed+=dt;world.update(dt,elapsed,!paused&&!reduced);world.updateCutaway(camera);renderer!.render(scene,camera);
    }
    frame=requestAnimationFrame(render);el<HTMLButtonElement>('enter').disabled=false;el('enter').innerHTML='Play · step inside <span>↗</span>';
    function cleanup(){if(disposed)return;disposed=true;delete canvas!.dataset.ready;cancelAnimationFrame(frame);listeners.forEach(fn=>fn());world.dispose();controls.dispose();const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();scene.traverse(obj=>{if(obj instanceof T.Mesh){geometries.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>{materials.add(m);if('map' in m&&m.map)textures.add(m.map as T.Texture);});}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());library?.dispose();renderer!.dispose();}
    on(window,'pagehide',e=>{if(!(e as PageTransitionEvent).persisted)cleanup();});on(document,'astro:before-swap',cleanup,{once:true});
    if(import.meta.hot)import.meta.hot.dispose(cleanup);
  } catch(error){console.error('Coffee Lab could not initialize',error);cancelAnimationFrame(frame);library?.dispose();renderer?.dispose();listeners.forEach(fn=>fn());delete canvas.dataset.ready;if(!leftDuringLoad){el('error-detail').textContent='The café could not load. Check your connection and WebGL support, then try again.';el('error').hidden=false;}}
}
