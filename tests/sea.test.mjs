import test from 'node:test';
import assert from 'node:assert/strict';
import {createGridMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints} from '../dist/fish-maze.js';

test('sea has one connected solution with protected animal illustrations',()=>{
 const m=createGridMaze('sea',3),q=[m.start.id],seen=new Set(q);
 for(let i=0;i<q.length;i++)for(const id of m.cells[q[i]].links)if(!seen.has(id)){seen.add(id);q.push(id)}
 assert.equal(m.cells.length,894);assert.equal(seen.size,m.cells.length);
 assert.equal(m.cells.reduce((sum,c)=>sum+c.links.length,0)/2,m.cells.length-1);
 assert.equal(m.solution.length-1,225);assert.equal(m.solution.slice(1,-1).filter(id=>m.cells[id].links.length>=3).length,33);
 assert.equal(m.cells.filter(c=>c.links.length===1).length,126);
 for(const p of [{x:245,y:322},{x:794,y:256},{x:991,y:512},{x:350,y:345},{x:848,y:267},{x:870,y:535}])assert.equal(fishCellAt(p,m),null,'animal faces and bodies should remain outside paths');
 assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
});
test('sea walls and all open passages agree with movement geometry',()=>{
 const m=createGridMaze('sea',3);
 for(const c of m.cells){assert.equal(fishCellAt(fishCenter(c),m).id,c.id);for(const id of c.links){const [a,b]=fishEdgePoints(c,m.cells[id]);for(let i=0;i<=18;i++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*i/18,y:a.y+(b.y-a.y)*i/18},m),`blocked ${c.id} → ${id}`)}}
 for(const [a,b] of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
});
