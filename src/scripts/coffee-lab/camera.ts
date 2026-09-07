import * as T from 'three';
import {stationPositions,type Station} from './paths';
export function cameraPose(inside:boolean,station:Station|null,mobile=false){
 const target=new T.Vector3(0,inside?1.3:0,0);
 let position=new T.Vector3(25,23,30);
 if(inside){position.set(10,11,14);if(station){const x=stationPositions[station];target.set(x,1.55,-.65);position.set(x-6.2,7.4,-9.5);}}
 // Scale around the target, so mobile retains the same viewing direction.
 if(mobile)position.sub(target).multiplyScalar(inside?1.38:1.55).add(target);
 return {position,target};
}
