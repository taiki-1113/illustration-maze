import test from 'node:test';
import assert from 'node:assert/strict';
import {createCelebration} from '../dist/celebration.js';
import {planFireworks,fireworkTexture} from '../dist/fireworks.js';
class Element extends EventTarget{
 children=[];attributes={};style={};classes=new Set();
 classList={add:name=>this.classes.add(name),remove:name=>this.classes.delete(name),contains:name=>this.classes.has(name)};
 append(child){child.parent=this;this.children.push(child)}
 setAttribute(key,value){this.attributes[key]=value}
 remove(){if(this.parent){this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null}}
}
function setup(reduced=false){
 const dialog=new Element(),card=new Element(),doc=new EventTarget(),win=new EventTarget();dialog.append(card);const timers=new Map();let id=0;
 dialog.getBoundingClientRect=()=>({left:455,right:825,top:172.5,bottom:627.5,height:455});
 doc.documentElement={clientWidth:1280};doc.createElement=()=>new Element();win.innerHeight=800;
 const effect=createCelebration(dialog,{document:doc,window:win,random:()=>.5,reducedMotion:()=>reduced,setTimer:(callback,delay)=>{assert.equal(delay,4600);timers.set(++id,callback);return id},clearTimer:key=>timers.delete(key)});
 return {dialog,card,doc,win,timers,effect};
}
const all=e=>[e,...e.children.flatMap(all)];
test('five bounded fireworks reuse three textures and remove all nodes after one timer',()=>{
 const {dialog,card,timers,effect}=setup();assert.equal(timers.size,0);effect.play();
 assert.equal(dialog.children.length,2);const layer=dialog.children[1],nodes=all(layer),bursts=nodes.filter(n=>n.className==='firework-burst');
 assert.equal(layer.attributes['aria-hidden'],'true');assert.equal(bursts.length,5);assert.ok(nodes.length<=26);
 assert.equal(new Set(bursts.map(b=>b.children[0].src)).size,3);assert.ok(dialog.classList.contains('fireworks-active'));
 timers.values().next().value();assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0);assert.ok(!dialog.classList.contains('fireworks-active'));
});
test('replaying, closing and explicit clearing never leave layers or timers behind',()=>{
 const {dialog,card,timers,effect}=setup();effect.play();const first=dialog.children[1];effect.play();
 assert.equal(first.parent,null);assert.equal(dialog.children.length,2);assert.equal(timers.size,1);
 dialog.dispatchEvent(new Event('close'));assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0);effect.clear();assert.deepEqual(dialog.children,[card]);
});
test('rotating or hiding the tab cancels the effect without a frame loop',()=>{
 for(const type of ['resize','visibilitychange']){const {dialog,card,win,doc,timers,effect}=setup();effect.play();if(type==='resize')win.dispatchEvent(new Event(type));else{doc.hidden=true;doc.dispatchEvent(new Event(type))}assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0)}
});
test('reduced motion retains the card without generating fireworks or timers',()=>{
 const {dialog,card,timers,effect}=setup(true);effect.play();assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0);assert.ok(!dialog.classList.contains('fireworks-active'));
});
test('fireworks stay outside the whole card and within the viewport, including their falling motion',()=>{
 for(const [width,height,cw,ch]of [[1280,800,370,455],[800,1280,370,455],[390,844,358,455],[390,720,358,455],[1024,400,420,310],[600,600,370,455]]){
  const card={left:(width-cw)/2,right:(width+cw)/2,top:(height-ch)/2,bottom:(height+ch)/2,height:ch};const bursts=planFireworks({width,height},card);assert.ok(bursts.length>0&&bursts.length<=5);
  for(const b of bursts){const r=b.size*.5175,box={left:b.x-r,right:b.x+r,top:b.y-r,bottom:b.y+r+24};assert.ok(box.left>=0&&box.right<=width&&box.top>=0&&box.bottom<=height,JSON.stringify({width,height,box}));assert.ok(box.right<card.left||box.left>card.right||box.bottom<card.top||box.top>card.bottom,JSON.stringify({width,height,box,card}))}
 }
});
test('tiny viewports gracefully omit bursts with no space around the card',()=>{
 assert.deepEqual(planFireworks({width:360,height:360},{left:16,right:344,top:16,bottom:344,height:328}),[]);
});
test('static textures have no external images, SVG filters, or internal animations',()=>{
 for(const color of ['gold','red','teal']){const url=fireworkTexture(color);assert.equal(url,fireworkTexture(color));const xml=decodeURIComponent(url.slice('data:image/svg+xml,'.length));assert.ok(xml.length<18000);assert.ok(xml.includes('viewBox="-160 -160 320 320"'));assert.ok(!/<(?:filter|animate|image)\b/.test(xml))}
});
