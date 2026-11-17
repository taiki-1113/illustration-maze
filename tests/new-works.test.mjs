import test from 'node:test';
import assert from 'node:assert/strict';
import {createGridMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints} from '../dist/fish-maze.js';

for(const [shape,seed,cells,moves,forks,dead] of [['owl',24,370,109,22,60],['rocket',20,337,110,19,50]]){
 test(`${shape}: all cells connected, with calibrated route and branch counts`,()=>{
  const m=createGridMaze(shape,seed),seen=new Set([m.start.id]),queue=[m.start.id];
  for(let i=0;i<queue.length;i++)for(const id of m.cells[queue[i]].links)if(!seen.has(id)){seen.add(id);queue.push(id)}
  assert.equal(seen.size,cells);assert.equal(m.cells.length,cells);
  assert.equal(m.cells.reduce((sum,c)=>sum+c.links.length,0)/2,cells-1);
  assert.equal(m.solution.length-1,moves);assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,forks);
  assert.equal(m.cells.filter(c=>c.links.length===1).length,dead);
  assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
 });
 test(`${shape}: every passage and wall agrees with collision geometry`,()=>{
  const m=createGridMaze(shape,seed);
  for(const c of m.cells){assert.equal(fishCellAt(fishCenter(c),m).id,c.id);for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let k=0;k<=18;k++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*k/18,y:a.y+(b.y-a.y)*k/18},m),`blocked ${c.id} → ${id}`)}}
  for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
 });
}
