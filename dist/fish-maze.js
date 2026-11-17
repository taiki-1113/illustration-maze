import {distanceToSegment} from './maze.js';

export const CELL=18, ORIGIN={x:100,y:100};
const WIDTH=33,HEIGHT=25;
const tail=[[530,304],[685,215],[685,425],[530,336]];
function inPolygon(x,y,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [xi,yi]=polygon[i],[xj,yj]=polygon[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside}return inside}
export function fishCenter(c){return {x:ORIGIN.x+(c.col+.5)*CELL,y:ORIGIN.y+(c.row+.5)*CELL}}
const SHAPES={
 fish:{contains:(x,y)=>((x-335)/224)**2+((y-320)/160)**2<=1||inPolygon(x,y,tail),startY:320,goalY:400},
 owl:{contains:(x,y)=>((x-380)/205)**2+((y-370)/178)**2<=1||inPolygon(x,y,[[210,295],[145,435],[240,483]])||inPolygon(x,y,[[550,295],[615,435],[520,483]]),startY:385,goalY:430},
 rocket:{contains:(x,y)=>(x>=220&&x<=540&&y>=205&&y<=490)||inPolygon(x,y,[[220,205],[380,158],[540,205]])||inPolygon(x,y,[[235,330],[130,510],[240,470]])||inPolygon(x,y,[[525,330],[630,510],[520,470]]),startY:450,goalY:450},
 family:{width:57,height:35,startY:435,goalY:590,
  contains:(x,y)=>((x-420)/250)**2+((y-440)/180)**2<=1||(x>=250&&x<=370&&y>=238&&y<=425)||inPolygon(x,y,[[580,410],[678,235],[734,270],[702,469],[610,535]])||((x-815)/106)**2+((y-490)/95)**2<=1||((x-1005)/89)**2+((y-592)/79)**2<=1||inPolygon(x,y,[[495,552],[742,510],[884,548],[1028,585],[1082,657],[884,682],[647,646],[432,626]]),
  region:(x,y)=>((x-1005)/89)**2+((y-592)/79)**2<=1?'chick':((x-815)/106)**2+((y-490)/95)**2<=1?'chick':x>650&&y>540?'grass':'hen'}
};
export function createGridMaze(shape='fish',seed=1){
 const profile=SHAPES[shape];if(!profile)throw Error(`Unknown maze shape: ${shape}`);
 let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 const cells=[],lookup=new Map();
 for(let row=0;row<(profile.height||HEIGHT);row++)for(let col=0;col<(profile.width||WIDTH);col++){
  const p=fishCenter({row,col});
  if(profile.contains(p.x,p.y)){
   const c={id:cells.length,row,col,links:[],neighbors:[]};if(profile.region)c.region=profile.region(p.x,p.y);cells.push(c);lookup.set(`${col},${row}`,c);
  }
 }
 for(const c of cells)for(const [dc,dr] of [[1,0],[0,1],[-1,0],[0,-1]]){const n=lookup.get(`${c.col+dc},${c.row+dr}`);if(n)c.neighbors.push(n.id)}
 const start=cells.reduce((a,c)=>{const pa=fishCenter(a),p=fishCenter(c);return p.x+Math.abs(p.y-profile.startY)*.3<pa.x+Math.abs(pa.y-profile.startY)*.3?c:a});
 const goal=cells.filter(c=>c.col===Math.max(...cells.map(c=>c.col))).reduce((a,c)=>Math.abs(fishCenter(c).y-profile.goalY)<Math.abs(fishCenter(a).y-profile.goalY)?c:a);
 // Growing-tree generation mixes longer detours with branches along the route.
 const visited=new Set([start.id]),active=[start];
 while(active.length){const index=random()<.12?Math.floor(random()*active.length):active.length-1,c=active[index],options=c.neighbors.filter(id=>!visited.has(id));if(!options.length){active.splice(index,1);continue}const next=cells[options[Math.floor(random()*options.length)]];c.links.push(next.id);next.links.push(c.id);visited.add(next.id);active.push(next)}
 const parents=new Map([[start.id,null]]),queue=[start.id];for(let i=0;i<queue.length;i++)for(const id of cells[queue[i]].links)if(!parents.has(id)){parents.set(id,queue[i]);queue.push(id)}
 const solution=[];for(let id=goal.id;id!==null;id=parents.get(id)){if(id===undefined)throw Error(`${shape} maze is disconnected`);solution.unshift(id)}
 const walls=[],outline=[];
 for(const c of cells){const x=ORIGIN.x+c.col*CELL,y=ORIGIN.y+c.row*CELL;
  for(const [dc,dr,a,b] of [[0,-1,{x,y},{x:x+CELL,y}],[1,0,{x:x+CELL,y},{x:x+CELL,y:y+CELL}],[0,1,{x:x+CELL,y:y+CELL},{x,y:y+CELL}],[-1,0,{x,y:y+CELL},{x,y}]]){
   const n=lookup.get(`${c.col+dc},${c.row+dr}`);
   const opening=(!n&&((c.id===start.id&&dc===-1)||(c.id===goal.id&&dc===1)));
   if(!n){if(!opening){walls.push([a,b]);outline.push([a,b])}}
   else if(c.id<n.id&&!c.links.includes(n.id))walls.push([a,b]);
  }
 }
 return {cells,lookup,start,goal,solution,walls,outline};
}
export const createFishMaze=(seed=1)=>createGridMaze('fish',seed);
export function fishCellAt(p,maze){return maze.lookup.get(`${Math.floor((p.x-ORIGIN.x)/CELL)},${Math.floor((p.y-ORIGIN.y)/CELL)}`)||null}
export function fishWalkable(p,maze,padding=3.6){if(!fishCellAt(p,maze))return false;return maze.walls.every(([a,b])=>distanceToSegment(p,a,b)>=padding)}
export const fishEdgePoints=(a,b)=>[fishCenter(a),fishCenter(b)];
