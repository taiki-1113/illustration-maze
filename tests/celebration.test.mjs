import test from 'node:test';
import assert from 'node:assert/strict';
import {createCelebration} from '../dist/celebration.js';

class Element extends EventTarget{
 children=[];attributes={};style={};
 append(child){child.parent=this;this.children.push(child)}
 setAttribute(key,value){this.attributes[key]=value}
 remove(){if(this.parent){this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null}}
}
function setup(reduced=false){
 const dialog=new Element(),card=new Element();dialog.append(card);const timers=new Map();let id=0;
 const effect=createCelebration(dialog,{document:{createElement:()=>new Element()},random:()=>.5,reducedMotion:()=>reduced,setTimer:callback=>{timers.set(++id,callback);return id},clearTimer:key=>timers.delete(key)});
 return {dialog,card,timers,effect};
}
test('celebration is bounded, hidden from assistive reading and removes itself',()=>{
 const {dialog,card,timers,effect}=setup();effect.play();
 assert.equal(dialog.children.length,2);const paper=dialog.children[1];
 assert.equal(paper.attributes['aria-hidden'],'true');assert.ok(paper.children.length>0&&paper.children.length<=40);
 timers.values().next().value();assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0);
});
test('replaying and closing never leave confetti nodes or timers behind',()=>{
 const {dialog,card,timers,effect}=setup();effect.play();const first=dialog.children[1];effect.play();
 assert.equal(first.parent,null);assert.equal(dialog.children.length,2);assert.equal(timers.size,1);
 dialog.dispatchEvent(new Event('close'));assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0);
 effect.clear();assert.deepEqual(dialog.children,[card]);
});
test('reduced motion retains the completion card without particle animation',()=>{
 const {dialog,card,timers,effect}=setup(true);effect.play();
 assert.deepEqual(dialog.children,[card]);assert.equal(timers.size,0);
});
