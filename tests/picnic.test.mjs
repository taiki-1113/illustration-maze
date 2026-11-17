import test from 'node:test';
import assert from 'node:assert/strict';
import {createGridMaze,fishCenter,fishWalkable,fishEdgePoints} from '../dist/fish-maze.js';

test('picnic is connected and stays within the empty linen illustration area',()=>{
 const m=createGridMaze('picnic',8),q=[m.start.id],seen=new Set(q);
 for(let i=0;i<q.length;i++)for(const id of m.cells[q[i]].links)if(!seen.has(id)){seen.add(id);q.push(id)}
 assert.equal(seen.size,m.cells.length);assert.equal(m.cells.length,893);
 assert.equal(m.cells.reduce((sum,c)=>sum+c.links.length,0)/2,m.cells.length-1);
 assert.equal(m.solution.length-1,227);assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,34);
 assert.equal(m.cells.filter(c=>c.links.length===1).length,121);
 for(const c of m.cells){const p=fishCenter(c);assert.ok(p.x-9>=185&&p.x+9<=1025&&p.y-9>=235&&p.y+9<=615)}
});
test('all picnic passages and walls match the drawn maze',()=>{
 const m=createGridMaze('picnic',8);
 for(const c of m.cells)for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let i=0;i<=18;i++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*i/18,y:a.y+(b.y-a.y)*i/18},m),`blocked ${c.id} → ${id}`)}
 for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
});
