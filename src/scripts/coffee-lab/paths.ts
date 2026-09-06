import * as THREE from 'three';
export const stationPositions = { grinder: -3.3, espresso: -1, finish: 1.5 } as const;
export type Station = keyof typeof stationPositions;
// All station destinations share the unobstructed staff aisle, behind the counter.
export const staffAisleZ = -2.05;
export const floorY = 0.43;
export function roundedLoop(halfX: number, halfZ: number, radius: number): THREE.CurvePath<THREE.Vector3> {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const v = (x:number,z:number) => new THREE.Vector3(x,0,z);
  const line = (a:THREE.Vector3,b:THREE.Vector3) => path.add(new THREE.LineCurve3(a,b));
  const arc = (x:number,z:number,start:number) => {
    for(let i=0;i<16;i++) {
      const a=start+i*Math.PI/32,b=start+(i+1)*Math.PI/32;
      line(v(x+Math.cos(a)*radius,z+Math.sin(a)*radius),v(x+Math.cos(b)*radius,z+Math.sin(b)*radius));
    }
  };
  line(v(-halfX+radius,-halfZ),v(halfX-radius,-halfZ));arc(halfX-radius,-halfZ+radius,-Math.PI/2);
  line(v(halfX,-halfZ+radius),v(halfX,halfZ-radius));arc(halfX-radius,halfZ-radius,0);
  line(v(halfX-radius,halfZ),v(-halfX+radius,halfZ));arc(-halfX+radius,halfZ-radius,Math.PI/2);
  line(v(-halfX,halfZ-radius),v(-halfX,-halfZ+radius));arc(-halfX+radius,-halfZ+radius,Math.PI);
  return path;
}
export function sampleLoop(path:THREE.CurvePath<THREE.Vector3>,distance:number) {
  const t=((distance/path.getLength())%1+1)%1;
  const position=path.getPoint(t);
  const next=path.getPoint((t+0.0001)%1);
  return {position,heading:Math.atan2(next.x-position.x,next.z-position.z)};
}
