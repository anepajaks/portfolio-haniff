import * as T from 'three';
import {GLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

function batchWheelSurfaces(root:T.Object3D){
  root.updateMatrixWorld(true);const wheels:T.Object3D[]=[];root.traverse(o=>{if(o.name.startsWith('wheel-'))wheels.push(o);});
  for(const wheel of wheels){const inverse=wheel.matrixWorld.clone().invert();const groups=new Map<T.Material,T.BufferGeometry[]>();const remove:T.Object3D[]=[];
    wheel.traverse(o=>{if(!(o instanceof T.Mesh)||Array.isArray(o.material))return;let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(inverse.clone().multiply(o.matrixWorld));if(!groups.has(o.material))groups.set(o.material,[]);groups.get(o.material)!.push(g);remove.push(o);});
    remove.forEach(o=>o.removeFromParent());for(const [material,geometries] of groups){const geometry=mergeGeometries(geometries,false);if(geometry)wheel.add(new T.Mesh(geometry,material));geometries.forEach(g=>g.dispose());}
  }
}
export const beanBagIds=['bean-bag-medium-roast','bean-bag-dark-roast','bean-bag-decaf','bean-bag-house-blend'] as const;
export const assetIds = ['barista-A','npc-curly-B','npc-cyclist-B','npc-elder-B','npc-creative-B','retro-hatchback-A','retro-sedan-A','retro-van-A','espresso-machine','grinder','milk-pitcher','portafilter','tamper','cup','saucer','wire-chair','pedestal-table','banquette','fluted-counter','wave-wall','interior-planter','garden-storefront','garden-bench','streetlight','open-sign','planter-tree',...beanBagIds] as const;
export const assetUrl=(id:AssetId)=>`/coffee-lab/${id.startsWith('bean-bag-')?'beans':'models'}/${id}.glb`;
export type AssetId=typeof assetIds[number];
export class AssetLibrary {
  private models=new Map<AssetId,GLTF>();
  static async load(progress:(done:number,total:number)=>void=()=>{}) {
    const library=new AssetLibrary(),loader=new GLTFLoader();let next=0,done=0;
    const workers=Array.from({length:4},async()=>{while(next<assetIds.length){const id=assetIds[next++];const model=await loader.loadAsync(assetUrl(id));batchWheelSurfaces(model.scene);library.models.set(id,model);progress(++done,assetIds.length);}});
    const results=await Promise.allSettled(workers);const failure=results.find((r):r is PromiseRejectedResult=>r.status==='rejected');if(failure){library.dispose();throw failure.reason;}return library;
  }
  static fromParsed(models:Map<AssetId,GLTF>){const library=new AssetLibrary();for(const model of models.values())batchWheelSurfaces(model.scene);library.models=models;return library;}
  instantiate(id:AssetId){const template=this.models.get(id);if(!template)throw new Error(`Missing Coffee Lab asset: ${id}`);const root=clone(template.scene);root.name=id;root.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=o.receiveShadow=true;if(o instanceof T.SkinnedMesh)o.frustumCulled=false;}});return root;}
  actor(id:AssetId){const root=this.instantiate(id),mixer=new T.AnimationMixer(root),actions=new Map<string,T.AnimationAction>();for(const clip of this.models.get(id)!.animations)actions.set(clip.name,mixer.clipAction(clip));let active:string|undefined;
    function play(name:string,speed=1,fade=.18){const action=actions.get(name);if(!action)return;action.timeScale=speed;if(active===name)return;const previous=active?actions.get(active):undefined;action.reset().setEffectiveWeight(1).play();if(previous)previous.crossFadeTo(action,fade,false);active=name;}
    return {root,mixer,play,update:(dt:number)=>mixer.update(dt),stop:()=>{mixer.stopAllAction();mixer.uncacheRoot(root);}};
  }
  dispose(){const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>(),textures=new Set<T.Texture>();for(const model of this.models.values())model.scene.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ms.add(m);if('map' in m&&m.map)textures.add(m.map as T.Texture);});}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());this.models.clear();}
}
