import type {Station} from './paths';
export const drinks=[
 {id:'espresso',name:'Espresso',ingredients:'Espresso only',lesson:'Learn dose, grind, tamping and extraction.',finish:'Serve the espresso on its own.'},
 {id:'americano',name:'Americano',ingredients:'Espresso + hot water',lesson:'Learn how water changes drink strength.',finish:'Add hot water to the espresso.'},
 {id:'latte',name:'Caffè Latte',ingredients:'Espresso + steamed milk',lesson:'Learn silky milk with a thin layer of microfoam.',finish:'Steam milk with a thin layer of microfoam, then pour.'},
 {id:'cappuccino',name:'Cappuccino',ingredients:'Espresso + steamed milk + more foam',lesson:'Learn milk aeration and a fuller foam texture.',finish:'Steam milk with more foam than a latte, then pour.'}
] as const;
export type DrinkId=typeof drinks[number]['id'];
export const getDrink=(id:string)=>drinks.find(drink=>drink.id===id);
// A selected recipe is required before any workstation can be entered.
export function createMenuSession(){
 let drink:DrinkId|null=null,station:Station|null=null;
 return {get drink(){return drink;},get station(){return station;},
  choose(id:string){if(!getDrink(id))return false;drink=id as DrinkId;station=null;return true;},
  visit(next:Station){if(!drink)return false;station=next;return true;},
  clear(){drink=null;station=null;}
 };
}
