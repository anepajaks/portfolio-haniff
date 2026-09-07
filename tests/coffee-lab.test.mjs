import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// Compile only the pure scene modules for Node; no browser or GPU is simulated here.
const dir=new URL('../.coffee-test-build/',import.meta.url);
await fs.mkdir(dir,{recursive:true});
for(const name of ['palette','paths','models','assets','scene','menu','camera']) {
  const source=await fs.readFile(new URL(`../src/scripts/coffee-lab/${name}.ts`,import.meta.url),'utf8');
  const {outputText}=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}});
  await fs.writeFile(new URL(`${name}.mjs`,dir),outputText.replace(/from '(\.\/[^']+)'/g,"from '$1.mjs'"));
}
const {roundedLoop,sampleLoop,stationPositions,staffAisleZ}=await import(new URL('paths.mjs',dir));
const {AssetLibrary,assetIds,assetUrl}=await import(new URL('assets.mjs',dir));
globalThis.ProgressEvent=class{constructor(type,options){this.type=type;Object.assign(this,options);}};
const parsed=new Map();
for(const id of assetIds){const bytes=await fs.readFile(new URL(`../public${assetUrl(id)}`,import.meta.url));let data=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
 if(id.startsWith('bean-bag-')){const n=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+n));assert.equal(doc.images.length,1);doc.materials.forEach(m=>delete m.pbrMetallicRoughness.baseColorTexture);delete doc.images;delete doc.textures;delete doc.samplers;doc.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+n).toString('base64');data=JSON.stringify(doc);}
 parsed.set(id,await new GLTFLoader().parseAsync(data,''));}
const library=AssetLibrary.fromParsed(parsed);
test('traffic paths close continuously and have finite headings in both directions',()=>{
  for(const path of [roundedLoop(11.6,10.15,2.4),roundedLoop(13.45,11.85,2.8)]){
    const length=path.getLength();assert.ok(path.getPoint(0).distanceTo(path.getPoint(1))<1e-8);
    for(let d=-length;d<2*length;d+=.1){const a=sampleLoop(path,d),b=sampleLoop(path,d+.1);assert.ok(Number.isFinite(a.heading));assert.ok(a.position.distanceTo(b.position)<=.101);assert.ok(Math.abs(a.position.x)>=9||Math.abs(a.position.z)>=8.5,'cars remain on roadway');}
  }
});
test('pedestrian loop remains on sidewalk and clear of building and tree beds',()=>{
  const path=roundedLoop(9.35,7.35,.6);
  for(let d=0;d<path.getLength();d+=.1){const {position:p}=sampleLoop(path,d);assert.ok(Math.abs(p.x)<9.7&&Math.abs(p.z)<7.7);assert.ok(Math.abs(p.x)>8.95||Math.abs(p.z)>6.95);}
});
test('barista reaches all stations, stays in the staff aisle and settles after arrival',async()=>{
  const {createWorld}=await import(new URL('scene.mjs',dir));const scene=new THREE.Scene();const world=createWorld(scene,library);world.setInterior(true);
  assert.equal(scene.getObjectByName('ceiling-fixtures').visible,false);
  for(const name of ['grinder','finish','espresso']){
    let arrived=false;world.selectStation(name,()=>arrived=true);
    for(let step=0;step<900;step++){world.update(1/60,step/60,false);const p=world.barista.root.position;assert.equal(p.z,staffAisleZ);assert.ok(p.x>=-3.31&&p.x<=1.51);assert.equal(p.y,.43);}
    assert.ok(arrived);assert.ok(Math.abs(world.barista.root.position.x-stationPositions[name])<.005);assert.equal(world.barista.root.rotation.y,0);
  }
  world.setInterior(false);assert.equal(scene.getObjectByName('ceiling-fixtures').visible,true);world.update(1/60,16,true);
  let meshes=0;scene.traverse(o=>{if(o.isMesh){meshes++;assert.ok(o.position.toArray().every(Number.isFinite));}});assert.ok(meshes>200);
  const before=world.walkers.map(a=>a.root.position.clone());world.update(1,17,false);world.walkers.forEach((a,i)=>assert.ok(a.root.position.equals(before[i])));
  assert.equal(world.traffic.length,6);assert.equal(world.walkers.length,6);world.dispose();
});
test('actor clones own skeletons and every selected individual asset is included',()=>{
  assert.equal(assetIds.length,30);const a=library.actor('barista-A'),b=library.actor('barista-A');const headA=a.root.getObjectByName('Head'),headB=b.root.getObjectByName('Head');assert.notEqual(headA,headB);headA.rotation.y=.7;assert.equal(headB.rotation.y,0);a.play('Walk');a.update(.3);assert.equal(b.mixer.time,0);a.stop();b.stop();
});
test('menu gates workstations, switching recipes resets the station and exit clears the recipe',async()=>{
 const {createMenuSession,drinks}=await import(new URL('menu.mjs',dir));const s=createMenuSession();assert.equal(s.visit('grinder'),false);assert.equal(s.choose('mocha'),false);
 for(const d of drinks){assert.equal(s.choose(d.id),true);assert.equal(s.station,null);assert.equal(s.visit('grinder'),true);assert.equal(s.drink,d.id);assert.equal(s.station,'grinder');}
 s.clear();assert.equal(s.drink,null);assert.equal(s.station,null);assert.equal(s.visit('espresso'),false);
});
test('interior hides the entire city, restores it on exit, and displays eight sealed bags',async()=>{
 const {createWorld}=await import(new URL('scene.mjs',dir));const scene=new THREE.Scene(),w=createWorld(scene,library);
 const shelf=scene.getObjectByName('Bean-display');assert.equal(shelf.children.length,8);assert.equal(new Set(shelf.children.map(c=>c.name)).size,4);
 w.setInterior(true);for(const name of ['City-exterior','Exterior-shell','ceiling-fixtures'])assert.equal(scene.getObjectByName(name).visible,false);
 let arrived=false;w.selectStation('grinder',()=>arrived=true);w.setInterior(false);w.setInterior(true);for(let i=0;i<600;i++)w.update(1/60,0,false);assert.equal(arrived,false);
 w.setInterior(false);for(const name of ['City-exterior','Exterior-shell','ceiling-fixtures'])assert.equal(scene.getObjectByName(name).visible,true);w.dispose();
});
test('camera presets show the café front on entry and face the counter from behind each station',async()=>{
 const {cameraPose}=await import(new URL('camera.mjs',dir));
 for(const mobile of [false,true]){const overview=cameraPose(true,null,mobile);assert.ok(overview.position.z>0);for(const name of ['grinder','espresso','finish']){const p=cameraPose(true,name,mobile);assert.ok(p.position.z<staffAisleZ);assert.equal(p.target.x,stationPositions[name]);assert.ok(p.position.y>p.target.y);assert.ok(p.position.toArray().every(Number.isFinite));}}
});
