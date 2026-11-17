import test from 'node:test';
import assert from 'node:assert/strict';
import {createGridMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints} from '../dist/fish-maze.js';

test('space links departure, three planetary orbits and the destination in one tree',()=>{
 const m=createGridMaze('space',13),q=[m.start.id],seen=new Set(q);
 for(let i=0;i<q.length;i++)for(const id of m.cells[q[i]].links)if(!seen.has(id)){seen.add(id);q.push(id)}
 assert.equal(m.cells.length,698);assert.equal(seen.size,m.cells.length);
 assert.equal(m.cells.reduce((sum,c)=>sum+c.links.length,0)/2,m.cells.length-1);
 assert.equal(m.solution.length-1,211);
 assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,35);
 assert.equal(m.cells.filter(c=>c.links.length===1).length,103);
 assert.deepEqual([...new Set(m.solution.map(id=>m.cells[id].region))],['earth-orbit','saturn-orbit','moon-orbit']);
 // Earth, Saturn's sphere and rings, and the Moon are physical route obstacles.
 for(const p of [{x:283,y:409},{x:390,y:409},{x:700,y:239},{x:550,y:239},{x:850,y:239},{x:965,y:490},{x:1027,y:487}])assert.equal(fishCellAt(p,m),null);
 assert.deepEqual(fishCenter(m.start),{x:109,y:415});
 assert.deepEqual(fishCenter(m.goal),{x:1099,y:487});
 assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
});

test('space flight passages remain walkable and every wall blocks movement',()=>{
 const m=createGridMaze('space',13);
 for(const c of m.cells){assert.equal(fishCellAt(fishCenter(c),m).id,c.id);for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let i=0;i<=18;i++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*i/18,y:a.y+(b.y-a.y)*i/18},m),`blocked ${c.id} → ${id}`)}}
 for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
});
