import test from 'node:test';
import assert from 'node:assert/strict';
import {attachBoardNavigation,clampZoom,viewportShift} from '../dist/board-navigation.js';
import {createFrameTask} from '../dist/trace-history.js';

class Board extends EventTarget{
 captures=new Set();classes=new Set();clientHeight=300;
 classList={add:name=>this.classes.add(name),remove:name=>this.classes.delete(name)};
 getBoundingClientRect(){return {left:10,top:20,width:400,height:300}}
 setPointerCapture(id){this.captures.add(id)}
 hasPointerCapture(id){return this.captures.has(id)}
 releasePointerCapture(id){this.captures.delete(id);this.emit('lostpointercapture',{pointerId:id})}
 emit(type,props={}){const e=new Event(type,{cancelable:true});Object.assign(e,{button:0,pointerId:1,pointerType:'touch',clientX:100,clientY:100,deltaMode:0,deltaX:0,deltaY:0,...props});this.dispatchEvent(e);return e}
}
function setup({allowTrace=true}={}){
 const board=new Board(),trace=[],frames=[],pans=[];
 const nav=attachBoardNavigation(board,{
  readFrame:()=>({zoom:2,anchor:{x:.4,y:.3}}),
  changeFrame:frame=>frames.push(frame),panBy:(x,y)=>pans.push([x,y]),
  startTrace:e=>{trace.push(['start',e.pointerId]);return allowTrace},
  moveTrace:e=>trace.push(['move',e.pointerId]),endTrace:()=>trace.push(['end'])
 });
 return {board,trace,frames,pans,nav};
}
test('pinch bursts apply once per frame, flush on lift, and cancel on view changes',()=>{
 const board=new Board(),queue=new Map(),applied=[];let next=0,pending=null;
 const painter=createFrameTask(()=>{if(pending){applied.push(pending);pending=null}},{request:cb=>{queue.set(++next,cb);return next},cancel:id=>queue.delete(id)});
 const nav=attachBoardNavigation(board,{readFrame:()=>({zoom:1,anchor:{x:.5,y:.5}}),changeFrame:frame=>{pending=frame;painter.schedule()},panBy(){},startTrace(){},moveTrace(){},endTrace(){},flushFrame:()=>painter.flush(),clearFrame:()=>{painter.clear();pending=null}});
 board.emit('pointerdown',{clientX:100});board.emit('pointerdown',{pointerId:2,clientX:200});
 for(let i=0;i<100;i++)board.emit('pointermove',{pointerId:2,clientX:200+i});
 assert.equal(queue.size,1);assert.equal(applied.length,0);
 board.emit('pointerup',{pointerId:2});assert.equal(applied.length,1);assert.equal(applied[0].zoom,1.99);assert.equal(queue.size,0);
 board.emit('pointerdown',{pointerId:2,clientX:200});board.emit('pointermove',{pointerId:2,clientX:250});nav.clear();assert.equal(queue.size,0);assert.equal(applied.length,1);
});
test('one pointer traces and stops on release; a rejected start cannot draw',()=>{
 const {board,trace}=setup();
 board.emit('pointerdown');board.emit('pointermove');board.emit('pointerup');board.emit('pointermove');
 assert.deepEqual(trace,[['start',1],['move',1],['end']]);
 const denied=setup({allowTrace:false});denied.board.emit('pointerdown');denied.board.emit('pointermove');
 assert.deepEqual(denied.trace,[['start',1]]);
});
test('two fingers combine pinch and translation without sending trace moves',()=>{
 const {board,trace,frames}=setup();
 board.emit('pointerdown',{clientX:100});board.emit('pointerdown',{pointerId:2,clientX:200});
 board.emit('pointermove',{clientX:70,clientY:130});board.emit('pointermove',{pointerId:2,clientX:270,clientY:130});
 assert.equal(frames.at(-1).zoom,4);
 assert.deepEqual(frames.at(-1).point,{x:170,y:130});
 assert.deepEqual(frames.at(-1).anchor,{x:.4,y:.3});
 assert.deepEqual(trace,[['start',1],['end']]);
 assert.ok(board.classes.has('gesturing'));
});
test('lifting one finger never turns a camera gesture into a stroke',()=>{
 const {board,trace}=setup();
 board.emit('pointerdown');board.emit('pointerdown',{pointerId:2,clientX:200});
 board.emit('pointerup',{pointerId:2});board.emit('pointermove');
 board.emit('pointerdown',{pointerId:3});board.emit('pointerup',{pointerId:3});board.emit('pointermove');
 assert.equal(trace.filter(x=>x[0]==='move').length,0);
 assert.equal(trace.filter(x=>x[0]==='start').length,1);
 board.emit('pointerup');board.emit('pointerdown',{pointerId:4});board.emit('pointermove',{pointerId:4});
 assert.deepEqual(trace.slice(-2),[['start',4],['move',4]]);
});
test('third finger handoff rebases the pinch instead of jumping',()=>{
 const {board,frames}=setup();
 board.emit('pointerdown',{clientX:100});
 board.emit('pointerdown',{pointerId:2,clientX:200});
 board.emit('pointerdown',{pointerId:3,clientX:300});
 board.emit('pointerup');
 board.emit('pointermove',{pointerId:2,clientX:200});
 assert.equal(frames.at(-1).zoom,2);
 assert.deepEqual(frames.at(-1).point,{x:250,y:100});
});
test('cancellation, lost capture and view changes discard stale contacts',()=>{
 for(const event of ['pointercancel','lostpointercapture']){
  const {board,nav,trace,frames}=setup();
  board.emit('pointerdown');board.emit('pointerdown',{pointerId:2,clientX:200});
  board.emit(event,{pointerId:2});board.emit('pointermove');
  assert.equal(frames.length,0);assert.equal(trace.filter(x=>x[0]==='move').length,0);
  nav.clear();assert.equal(board.captures.size,0);assert.ok(!board.classes.has('gesturing'));
  board.emit('pointerdown',{pointerId:3});board.emit('pointermove',{pointerId:3});
  assert.deepEqual(trace.slice(-2),[['start',3],['move',3]]);
 }
});
test('wheel navigation stops drawing; trackpad pinch anchors at the pointer',()=>{
 const {board,frames,pans,trace}=setup();
 board.emit('pointerdown');const e=board.emit('wheel',{deltaX:20,deltaY:30});
 board.emit('pointermove');assert.ok(e.defaultPrevented);assert.deepEqual(pans,[[20,30]]);
 assert.equal(trace.filter(x=>x[0]==='move').length,0);
 board.emit('wheel',{ctrlKey:true,deltaY:-Math.log(1.5)*100,clientX:240,clientY:130});
 assert.ok(Math.abs(frames.at(-1).zoom-3)<1e-10);
 assert.deepEqual(frames.at(-1).point,{x:240,y:130});
 board.emit('wheel',{deltaMode:1,deltaY:2});assert.deepEqual(pans.at(-1),[0,32]);
});
test('keyboard zoom works without buttons and leaves browser shortcuts alone',()=>{
 const {board,frames}=setup();
 assert.ok(board.emit('keydown',{key:'+'}).defaultPrevented);assert.equal(frames.at(-1).zoom,2.5);
 board.emit('keydown',{key:'-'});assert.equal(frames.at(-1).zoom,1.6);
 const count=frames.length;assert.ok(!board.emit('keydown',{key:'+',ctrlKey:true}).defaultPrevented);
 board.emit('keydown',{key:'ArrowRight'});assert.equal(frames.length,count);
});
test('camera offset keeps the same content under moving fingertips at any scale',()=>{
 const anchor={x:.25,y:.6},focus={x:170,y:230},rect={left:20,top:-40,width:800,height:600};
 const shift=viewportShift(rect,anchor,focus);
 assert.equal(rect.left-shift.x+anchor.x*rect.width,focus.x);
 assert.equal(rect.top-shift.y+anchor.y*rect.height,focus.y);
 assert.equal(clampZoom(.2,5),1);assert.equal(clampZoom(20,3),3);assert.equal(clampZoom(2.37,5),2.37);
});

