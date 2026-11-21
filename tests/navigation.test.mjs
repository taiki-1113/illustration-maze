import test from 'node:test';
import assert from 'node:assert/strict';
import {attachBoardNavigation,clampZoom,viewportShift} from '../dist/board-navigation.js';
class Board extends EventTarget{
 captures=new Set();classes=new Set();clientHeight=300;
 classList={add:name=>this.classes.add(name),remove:name=>this.classes.delete(name)};
 getBoundingClientRect(){return {left:10,top:20,width:400,height:300}}
 setPointerCapture(id){this.captures.add(id)}
 hasPointerCapture(id){return this.captures.has(id)}
 releasePointerCapture(id){this.captures.delete(id);this.emit('lostpointercapture',{pointerId:id})}
 emit(type,props={}){const e=new Event(type,{cancelable:true});Object.assign(e,{button:0,pointerId:1,pointerType:'touch',clientX:100,clientY:100,deltaMode:0,deltaX:0,deltaY:0,...props});this.dispatchEvent(e);return e}
}

function setup(){const board=new Board(),trace=[],zooms=[];const nav=attachBoardNavigation(board,{startTrace:e=>trace.push(['start',e.pointerId]),moveTrace:e=>trace.push(['move',e.pointerId]),endTrace:()=>trace.push(['end']),changeZoom:n=>zooms.push(n)});return {board,trace,zooms,nav}}
test('one contact draws, releases and resumes without moving the camera',()=>{const {board,trace}=setup();board.emit('pointerdown');board.emit('pointermove');board.emit('pointerup');board.emit('pointermove');assert.deepEqual(trace,[['start',1],['move',1],['end']])});
test('two or three fingers never navigate or draw; all must lift before resuming',()=>{const {board,trace,zooms}=setup();board.emit('pointerdown');board.emit('pointerdown',{pointerId:2});for(let i=0;i<100;i++)board.emit('pointermove',{pointerId:i%2+1,clientX:i*10});board.emit('pointerdown',{pointerId:3});board.emit('pointerup',{pointerId:2});board.emit('pointerup',{pointerId:3});board.emit('pointermove');assert.deepEqual(trace,[['start',1],['end']]);assert.equal(zooms.length,0);board.emit('pointerup');board.emit('pointerdown');board.emit('pointermove');assert.deepEqual(trace.slice(-2),[['start',1],['move',1]])});
test('cancellation, lost capture and route changes stop old contacts',()=>{for(const type of ['pointercancel','lostpointercapture']){const {board,trace,nav}=setup();board.emit('pointerdown');board.emit(type);board.emit('pointermove');nav.clear();assert.equal(board.captures.size,0);assert.equal(trace.filter(x=>x[0]==='move').length,0)}});
test('wheel and trackpad pinch do not change the camera; keyboard zoom remains available',()=>{const {board,zooms}=setup();assert.ok(board.emit('wheel',{deltaY:90}).defaultPrevented);assert.ok(board.emit('wheel',{ctrlKey:true,deltaY:-90}).defaultPrevented);assert.equal(zooms.length,0);board.emit('keydown',{key:'+'});board.emit('keydown',{key:'-'});board.emit('keydown',{key:'+',ctrlKey:true});assert.deepEqual(zooms,[1,-1]);assert.equal(clampZoom(10,3),3);assert.deepEqual(viewportShift({left:10,top:20,width:200,height:100},{x:.5,y:.5},{x:80,y:50}),{x:30,y:20})});
