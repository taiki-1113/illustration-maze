import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ADVENTURES} from '../dist/adventure-mazes.js';
import {works,artURL} from '../dist/works.js';
import {createGridMaze,fishCenter,fishWalkable} from '../dist/fish-maze.js';
const manifest=JSON.parse(await readFile(new URL('../dist/assets/scenes/manifest.json',import.meta.url)));
const originalWalls={treehouse:'a94c18f5eb3e8773c61709634f5e8cbed44ca0c4d50df21fde241e305d605a32',dinosaurs:'27011574d9eb61fd0b07682f5a082ad6b9201cfcfdece5e424f9e04916e9d05e',castle:'029337d4fc1c0e92da516dbd7d9bc71c78b51f408c102c23e9a49c77f75f58c1',harbor:'e6ceabca0f7ae9976463b3554d287fb6cadf1816a941fa6a2623168841722151',snow:'8c4b7f1b08e6000ff2d6dc68de3428b04ce09b57f6a52f621b7ee4bfda824835'};
test('the painting revision preserves the exact five released wall graphs',()=>{
 for(const [id,p]of Object.entries(ADVENTURES))assert.equal(createHash('sha256').update(JSON.stringify(createGridMaze(id,p.seed).walls)).digest('hex'),originalWalls[id]);
});
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
  const bytes=await readFile(new URL(`../dist/assets/scenes/${id}.webp`,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.ok(bytes.length<450000);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest[id].scene);
  const art=await readFile(new URL(`../art-direction/painted-sources/${id}.png`,import.meta.url));assert.equal(createHash('sha256').update(art).digest('hex'),manifest[id].art);
  assert.equal(manifest[id].width,1800);assert.equal(manifest[id].height,1200);
  assert.ok(artURL(works.find(w=>w.id===id),'scenes').endsWith('?art=gouache-1'));
  assert.ok((await stat(new URL(`../dist/assets/previews/${id}.webp`,import.meta.url))).size<65000);
 });
}
