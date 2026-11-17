import test from 'node:test';
import assert from 'node:assert/strict';
import {createGridMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints} from '../dist/fish-maze.js';

test('family is one connected maze spanning parent, chicks, and grass',()=>{
 const m=createGridMaze('family',1),seen=new Set([m.start.id]),queue=[m.start.id];
 for(let i=0;i<queue.length;i++)for(const id of m.cells[queue[i]].links)if(!seen.has(id)){seen.add(id);queue.push(id)}
 assert.equal(m.cells.length,795);assert.equal(seen.size,m.cells.length);
 assert.equal(m.cells.reduce((sum,c)=>sum+c.links.length,0)/2,m.cells.length-1);
 assert.equal(m.solution.length-1,207);assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,33);
 assert.equal(m.cells.filter(c=>c.links.length===1).length,106);
 const xs=m.solution.map(id=>fishCenter(m.cells[id]).x);assert.ok(Math.min(...xs)<220);assert.ok(Math.max(...xs)>1000);
 for(const region of ['hen','chick','grass'])assert.ok(m.solution.some(id=>m.cells[id].region===region));
 for(const [x,y,rx,ry] of [[815,490,106,95],[1005,592,89,79]])assert.ok(m.solution.some(id=>{const p=fishCenter(m.cells[id]);return ((p.x-x)/rx)**2+((p.y-y)/ry)**2<=1}),'route should visit both chicks');
 assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
});
test('all family passages remain traversable at the original corridor width',()=>{
 const m=createGridMaze('family',1);
 for(const c of m.cells){assert.equal(fishCellAt(fishCenter(c),m).id,c.id);for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let i=0;i<=18;i++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*i/18,y:a.y+(b.y-a.y)*i/18},m),`blocked ${c.id} → ${id}`)}}
 for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
});
