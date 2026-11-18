import {clearOfWalls} from './collision-index.js';
export const TAU=Math.PI*2, CX=435,CY=302,INNER=53,STEP=37,COUNTS=[8,16,16,32,32],OUTER=INNER+STEP*COUNTS.length;
export function point(r,a){return {x:CX+r*Math.cos(a),y:CY+r*Math.sin(a)}}
export function center(c){return point(INNER+(c.r+.5)*STEP,(c.s+.5)*TAU/COUNTS[c.r])}
export function createMaze(seed=6,branchiness=0){
 let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 const cells=[],rings=COUNTS.map((n,r)=>Array.from({length:n},(_,s)=>{const c={id:cells.length,r,s,neighbors:[],links:[]};cells.push(c);return c}));
 const connect=(a,b)=>{if(!a.neighbors.includes(b.id))a.neighbors.push(b.id);if(!b.neighbors.includes(a.id))b.neighbors.push(a.id)};
 for(const ring of rings)for(const c of ring){connect(c,ring[(c.s+1)%ring.length]);if(c.r>0)connect(c,rings[c.r-1][Math.floor(c.s*COUNTS[c.r-1]/ring.length)]);}
 const start=rings.at(-1)[12],goal=rings.at(-1)[0],visited=new Set([start.id]),stack=[start];
 while(stack.length){const index=branchiness>0&&random()<branchiness?Math.floor(random()*stack.length):stack.length-1;const c=stack[index],options=c.neighbors.filter(id=>!visited.has(id));if(!options.length){stack.splice(index,1);continue}const n=cells[options[Math.floor(random()*options.length)]];c.links.push(n.id);n.links.push(c.id);visited.add(n.id);stack.push(n)}
 const parents=new Map([[start.id,null]]),queue=[start.id];for(let k=0;k<queue.length;k++)for(const n of cells[queue[k]].links)if(!parents.has(n)){parents.set(n,queue[k]);queue.push(n)}
 const solution=[];for(let id=goal.id;id!==null;id=parents.get(id))solution.unshift(id);
 const walls=[];const arc=(r,a,b)=>{const pts=[];for(let i=0;i<=Math.ceil((b-a)*r/4);i++)pts.push(point(r,a+(b-a)*i/Math.ceil((b-a)*r/4)));walls.push(pts)};
 for(const c of cells){const n=COUNTS[c.r],a=c.s*TAU/n,b=(c.s+1)*TAU/n,lo=INNER+c.r*STEP,hi=lo+STEP;
  const prev=rings[c.r][(c.s+n-1)%n];if(!c.links.includes(prev.id))walls.push([point(lo,a),point(hi,a)]);
  if(c.r===0)arc(lo,a,b);else{const parent=rings[c.r-1][Math.floor(c.s*COUNTS[c.r-1]/n)];if(!c.links.includes(parent.id))arc(lo,a,b)}
  if(c.r===COUNTS.length-1&&c.id!==start.id&&c.id!==goal.id)arc(hi,a,b);
 }
 return {cells,rings,start,goal,solution,walls};
}
export function cellAt(p,maze){const dx=p.x-CX,dy=p.y-CY,r=Math.hypot(dx,dy);if(r<INNER||r>=OUTER)return null;const ring=Math.floor((r-INNER)/STEP),a=(Math.atan2(dy,dx)+TAU)%TAU;return maze.rings[ring][Math.floor(a/TAU*COUNTS[ring])]}
export function distanceToSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)}
export function isWalkable(p,maze,padding=5){return !!cellAt(p,maze)&&clearOfWalls(p,maze.walls,padding)}
export function edgePoints(a,b){const pa=center(a),pb=center(b);if(a.r!==b.r)return [pa,pb];let da=Math.atan2(pb.y-CY,pb.x-CX)-Math.atan2(pa.y-CY,pa.x-CX);if(da>Math.PI)da-=TAU;if(da<-Math.PI)da+=TAU;const angle=Math.atan2(pa.y-CY,pa.x-CX),r=INNER+(a.r+.5)*STEP;return Array.from({length:13},(_,i)=>point(r,angle+da*i/12))}


