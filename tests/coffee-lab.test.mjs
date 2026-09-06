import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// Compile only the pure scene modules for Node; no browser or GPU is simulated here.
const dir=new URL('../.coffee-test-build/',import.meta.url);
await fs.mkdir(dir,{recursive:true});
for(const name of ['palette','paths','models','assets','scene']) {
  const source=await fs.readFile(new URL(`../src/scripts/coffee-lab/${name}.ts`,import.meta.url),'utf8');
  const {outputText}=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}});
  await fs.writeFile(new URL(`${name}.mjs`,dir),outputText.replace(/from '(\.\/[^']+)'/g,"from '$1.mjs'"));
}
const {roundedLoop,sampleLoop,stationPositions,staffAisleZ}=await import(new URL('paths.mjs',dir));
const {AssetLibrary,assetIds}=await import(new URL('assets.mjs',dir));
const parsed=new Map();
for(const id of assetIds){const bytes=await fs.readFile(new URL(`../public/coffee-lab/models/${id}.glb`,import.meta.url));parsed.set(id,await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),''));}
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
  assert.equal(assetIds.length,26);const a=library.actor('barista-A'),b=library.actor('barista-A');const headA=a.root.getObjectByName('Head'),headB=b.root.getObjectByName('Head');assert.notEqual(headA,headB);headA.rotation.y=.7;assert.equal(headB.rotation.y,0);a.play('Walk');a.update(.3);assert.equal(b.mixer.time,0);a.stop();b.stop();
});
