import {performance} from 'node:perf_hooks';
import {createGridMaze,fishCenter,fishWalkable} from '../dist/fish-maze.js';
import {distanceToSegment} from '../dist/maze.js';
import {TraceHistory} from '../dist/trace-history.js';
const m=createGridMaze('space',13);
const samples=m.solution.flatMap((id,i)=>{if(!i)return [];const a=fishCenter(m.cells[m.solution[i-1]]),b=fishCenter(m.cells[id]);return Array.from({length:9},(_,k)=>({x:a.x+(b.x-a.x)*(k+1)/9,y:a.y+(b.y-a.y)*(k+1)/9}))});
const old=p=>m.walls.every(([a,b])=>distanceToSegment(p,a,b)>=3.6);
for(const p of samples)fishWalkable(p,m);
function measure(fn){const times=[];let sum=0;for(let run=0;run<5;run++){const t=performance.now();for(let r=0;r<10;r++)for(const p of samples)sum+=Number(fn(p));times.push(performance.now()-t)}return {medianMs:+times.sort((a,b)=>a-b)[2].toFixed(2),accepted:sum}}
const before=measure(old),after=measure(p=>fishWalkable(p,m));
const points=Array.from({length:10000},(_,i)=>({x:i*2,y:0})),history=new TraceHistory(points),probes=Array.from({length:1000},(_,i)=>({x:20000+i,y:20}));
function searchTime(fn){const t=performance.now();for(const p of probes)fn(p);return +(performance.now()-t).toFixed(2)}
console.log(JSON.stringify({maze:'space',walls:m.walls.length,checksPerRun:samples.length*10,collision:{before,after,speedup:+(before.medianMs/after.medianMs).toFixed(1)},history1000Searches:{beforeMs:searchTime(p=>points.findLastIndex((v,index)=>index<points.length-8&&Math.hypot(v.x-p.x,v.y-p.y)<5)),afterMs:searchTime(p=>history.previous(p))}},null,2));
const pts=m.cells.map(fishCenter);console.log('Maze bounds:',JSON.stringify({minX:Math.min(...pts.map(p=>p.x))-9,maxX:Math.max(...pts.map(p=>p.x))+9,minY:Math.min(...pts.map(p=>p.y))-9,maxY:Math.max(...pts.map(p=>p.y))+9}));

