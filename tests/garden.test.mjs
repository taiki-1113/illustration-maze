import test from 'node:test';
import assert from 'node:assert/strict';
import {createGridMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints,GARDEN_FLOWERS} from '../dist/fish-maze.js';

test('garden is a single connected maze across both flowers, butterfly, and leaves',()=>{
 const m=createGridMaze('garden',1),seen=new Set([m.start.id]),queue=[m.start.id];
 for(let i=0;i<queue.length;i++)for(const id of m.cells[queue[i]].links)if(!seen.has(id)){seen.add(id);queue.push(id)}
 assert.equal(m.cells.length,821);assert.equal(seen.size,m.cells.length);
 assert.equal(m.cells.reduce((n,c)=>n+c.links.length,0)/2,m.cells.length-1);
 assert.equal(m.solution.length-1,197);
 assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,31);
 assert.equal(m.cells.filter(c=>c.links.length===1).length,113);
 for(const region of ['pink','yellow','butterfly','leaf'])assert.ok(m.solution.some(id=>m.cells[id].region===region));
 for(const flower of GARDEN_FLOWERS)assert.equal(fishCellAt({x:flower.cx,y:flower.cy},m),null,'flower faces should stay outside the playable maze');
 for(const f of GARDEN_FLOWERS){assert.equal(fishCellAt({x:f.cx,y:f.cy},m),null);assert.equal(fishWalkable({x:f.cx,y:f.cy},m),false)}
 assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
});
test('all garden passages are traversable at 1px increments, with matching wall collisions',()=>{
 const m=createGridMaze('garden',1);
 for(const c of m.cells){assert.equal(fishCellAt(fishCenter(c),m).id,c.id);for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let i=0;i<=18;i++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*i/18,y:a.y+(b.y-a.y)*i/18},m),`blocked ${c.id} → ${id}`)}}
 for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
});
