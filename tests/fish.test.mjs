import test from 'node:test';
import assert from 'node:assert/strict';
import {createFishMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints} from '../dist/fish-maze.js';

test('fish has the selected reference-level complexity and a single connected solution',()=>{
 const m=createFishMaze(1),seen=new Set([m.start.id]),queue=[m.start.id];
 for(let i=0;i<queue.length;i++)for(const id of m.cells[queue[i]].links)if(!seen.has(id)){seen.add(id);queue.push(id)}
 assert.equal(seen.size,m.cells.length);assert.equal(m.cells.reduce((n,c)=>n+c.links.length,0)/2,m.cells.length-1);
 assert.equal(m.cells.length,394);assert.equal(m.solution.length-1,114);
 assert.equal(m.cells.filter(c=>c.links.length===1).length,59);
 assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,18);
 assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
});
test('every fish passage is traversable at 1px increments and every wall blocks',()=>{
 const m=createFishMaze(1);
 for(const c of m.cells){assert.equal(fishCellAt(fishCenter(c),m).id,c.id);for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let k=0;k<=18;k++){const p={x:a.x+(b.x-a.x)*k/18,y:a.y+(b.y-a.y)*k/18};assert.ok(fishWalkable(p,m),`blocked passage ${c.id} → ${id}`)}}}
 for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
});
