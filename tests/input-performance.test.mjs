import test from 'node:test';
import assert from 'node:assert/strict';
import {clearOfWalls} from '../dist/collision-index.js';
import {TraceHistory,createFrameTask} from '../dist/trace-history.js';
import {createGridMaze,fishCenter} from '../dist/fish-maze.js';
import {createMaze,distanceToSegment} from '../dist/maze.js';
const brute=(p,walls,padding)=>walls.every(w=>w.slice(1).every((b,i)=>distanceToSegment(p,w[i],b)>=padding));
test('indexed collision matches full wall scans including bucket edges and padding changes',()=>{
 let state=91;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 for(const m of [createMaze(6),createGridMaze('space',13),createGridMaze('sea',3)]){
  for(const padding of [3.6,5,9]){
   for(let i=0;i<1400;i++){const p={x:i%2?random()*1200:Math.floor(random()*38)*32,y:random()*800};assert.equal(clearOfWalls(p,m.walls,padding),brute(p,m.walls,padding))}
   for(const wall of m.walls.slice(0,70)){const a=wall[0];for(const dx of [-padding,-padding+.001,padding-.001,padding]){const p={x:a.x+dx,y:a.y};assert.equal(clearOfWalls(p,m.walls,padding),brute(p,m.walls,padding))}}
  }
 }
});
test('indexed history matches the original rewind rule over long traces and reversals',()=>{
 const path=new TraceHistory([]),expected=[];
 let state=101,x=0,y=0;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<12000;i++){
  if(i%130===0&&expected.length>30){const p=expected[Math.floor(random()*(expected.length-20))];x=p.x;y=p.y}
  x+=(random()-.5)*9;y+=(random()-.5)*9;const p={x,y};
  const old=expected.findLastIndex((v,index)=>index<expected.length-8&&Math.hypot(v.x-p.x,v.y-p.y)<5);
  assert.equal(path.previous(p),old);
  if(old>=0){expected.length=old+1;path.truncate(old+1)}
  expected.push(p);path.push(p);assert.equal(path.points.length,expected.length);
 }
 assert.deepEqual(path.points,expected);
 const restored=new TraceHistory(expected.slice());assert.equal(restored.previous(expected[0]),path.previous(expected[0]));
});
test('render bursts draw once per frame, and reset flushes the latest state',()=>{
 const queue=new Map();let next=0,calls=0;
 const painter=createFrameTask(()=>calls++,{request:cb=>{queue.set(++next,cb);return next},cancel:id=>queue.delete(id)});
 for(let i=0;i<100;i++)painter.schedule();assert.equal(queue.size,1);assert.equal(calls,0);
 const cb=queue.values().next().value;queue.clear();cb();assert.equal(calls,1);
 painter.schedule();painter.flush();assert.equal(calls,2);assert.equal(queue.size,0);
 painter.schedule();painter.clear();assert.equal(queue.size,0);
});

