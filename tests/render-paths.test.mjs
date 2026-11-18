import test from 'node:test';
import assert from 'node:assert/strict';
import {wallPath,tilePaths,createTraceRenderer} from '../dist/render-paths.js';
import {TraceHistory} from '../dist/trace-history.js';
import {createGridMaze,fishCenter} from '../dist/fish-maze.js';
import {createMaze} from '../dist/maze.js';
const grids=[['fish',1],['owl',24],['rocket',20],['family',1],['garden',1],['sea',3],['picnic',8],['space',13]];
test('batching preserves every wall coordinate and tile of all ten mazes',()=>{
 const mazes=[createMaze(6,0),createMaze(2,.2),...grids.map(([id,seed])=>createGridMaze(id,seed))];
 for(const maze of mazes){
  const expected=maze.walls.flatMap(w=>w.flatMap(p=>[+p.x.toFixed(2),+p.y.toFixed(2)]));
  assert.deepEqual(wallPath(maze.walls,true).match(/-?\d+(?:\.\d+)?/g).map(Number),expected);
  assert.equal((wallPath(maze.walls).match(/M /g)||[]).length,maze.walls.length);
 }
 for(const [id,seed] of grids){const maze=createGridMaze(id,seed);const groups=tilePaths(maze.cells,fishCenter,c=>c.region||'base');
  for(const [region,d] of groups){const expected=maze.cells.filter(c=>(c.region||'base')===region).map(c=>{const p=fishCenter(c);return `M ${p.x-9} ${p.y-9} h18 v18 h-18 Z `}).join('');assert.equal(d,expected)}
 }
});
function surface(){const children=[];return {children,setAttribute(){},make(tag,attrs){const node={attrs:{...attrs},writes:0,setAttribute(k,v){this.attrs[k]=v;this.writes++},remove(){children.splice(children.indexOf(this),1)}};children.push(node);return node}}}
const encode=(p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
test('long traces update only the live section and retain every point',()=>{
 const layer=surface(),history=new TraceHistory([]),renderer=createTraceRenderer(layer,layer.make,{color:'red',width:7});
 for(let i=0;i<10000;i++)history.push({x:i*.7,y:Math.sin(i)});
 renderer.update(history.points,history.consumeDirty());
 const previous=layer.children.map(p=>p.writes);
 history.push({x:7000,y:0});renderer.update(history.points,history.consumeDirty());
 assert.equal(layer.children.slice(0,-1).reduce((n,p,i)=>n+p.writes-previous[i],0),0);
 for(let i=0;i<layer.children.length;i++)assert.equal(layer.children[i].attrs.d,history.points.slice(i*128,i*128+129).map(encode).join(' '));
 history.truncate(129);renderer.update(history.points,history.consumeDirty());assert.equal(layer.children.length,1);
 history.push({x:1,y:2});renderer.update(history.points,history.consumeDirty());assert.equal(layer.children.length,2);
 assert.equal(layer.children[1].attrs.d,history.points.slice(128).map(encode).join(' '));
 renderer.update([{x:0,y:0}],Infinity);assert.equal(layer.children.length,1);assert.equal(layer.children[0].attrs.d,'M0.0,0.0');
});
test('chunk boundaries and arbitrary rewinds agree with the full trace',()=>{
 const layer=surface(),history=new TraceHistory([]),renderer=createTraceRenderer(layer,layer.make,{color:'red',width:7});
 for(let i=0;i<1700;i++){
  if(i%199===0)history.truncate(Math.floor(history.points.length/2));
  history.push({x:i,y:i%13});renderer.update(history.points,history.consumeDirty());
  const actual=layer.children.flatMap((p,i)=>p.attrs.d.match(/[ML][^ML]+/g).slice(i?1:0).map(v=>v.slice(1).trim()));
  assert.deepEqual(actual,history.points.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`));
 }
});
