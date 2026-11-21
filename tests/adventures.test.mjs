import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ADVENTURES} from '../dist/adventure-mazes.js';
import {works} from '../dist/works.js';
import {createGridMaze,fishCenter,fishWalkable} from '../dist/fish-maze.js';
const manifest=JSON.parse(await readFile(new URL('../dist/assets/scenes/manifest.json',import.meta.url)));
test('collection has fifteen unique works; previous seeds and order are intact',()=>{
 assert.equal(works.length,15);assert.equal(new Set(works.map(w=>w.id)).size,15);
 assert.deepEqual(works.slice(0,10).map(w=>[w.id,w.seed]),[['snail',6],['turtle',2],['fish',1],['owl',24],['rocket',20],['family',1],['garden',1],['sea',3],['picnic',8],['space',13]]);
});
for(const [id,p]of Object.entries(ADVENTURES)){
 test(`${id}: connected perfect maze, calibrated to the hen's difficulty`,()=>{
  const m=createGridMaze(id,p.seed),seen=new Set([m.start.id]),q=[m.start.id];for(let i=0;i<q.length;i++)for(const n of m.cells[q[i]].links)if(!seen.has(n)){seen.add(n);q.push(n)}
  assert.equal(seen.size,m.cells.length);assert.equal(m.cells.reduce((s,c)=>s+c.links.length,0)/2,m.cells.length-1);
  assert.ok(m.cells.length>=740&&m.cells.length<=900);assert.ok(m.solution.length-1>=200&&m.solution.length-1<=215);
  const forks=m.solution.slice(1,-1).filter(i=>m.cells[i].links.length>=3).length;assert.ok(forks>=31&&forks<=35);
  assert.equal(m.solution[0],m.start.id);assert.equal(m.solution.at(-1),m.goal.id);
 });
 test(`${id}: every open passage and wall agrees with the baked artwork`,async()=>{
  const m=createGridMaze(id,p.seed);for(const c of m.cells)for(const n of c.links){const a=fishCenter(c),b=fishCenter(m.cells[n]);for(let i=0;i<=18;i++)assert.ok(fishWalkable({x:a.x+(b.x-a.x)*i/18,y:a.y+(b.y-a.y)*i/18},m))}
  for(const [a,b]of m.walls)assert.equal(fishWalkable({x:(a.x+b.x)/2,y:(a.y+b.y)/2},m),false);
  assert.equal(createHash('sha256').update(JSON.stringify(m.walls)).digest('hex'),manifest[id].geometry,'rebuild artwork when geometry changes');
  const bytes=await readFile(new URL(`../dist/assets/scenes/${id}.webp`,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.ok(bytes.length<150000);
  assert.ok((await stat(new URL(`../dist/assets/previews/${id}.webp`,import.meta.url))).size<60000);
 });
}
