import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlayOrientation,isAndroid} from '../dist/play-orientation.js';

function setup({enabled=true}={}){
 const calls=[],states=[],doc=new EventTarget(),orientation=new EventTarget();
 const root={clientWidth:1280,clientHeight:800};
 doc.documentElement=root;doc.fullscreenElement=null;orientation.type='landscape-primary';
 root.requestFullscreen=async()=>{calls.push('fullscreen');doc.fullscreenElement=root;doc.dispatchEvent(new Event('fullscreenchange'))};
 doc.exitFullscreen=async()=>{calls.push('exit');doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'))};
 orientation.lock=async value=>{calls.push('lock:'+value);orientation.type=value+'-primary';orientation.dispatchEvent(new Event('change'))};
 orientation.unlock=()=>calls.push('unlock');
 const nav=createPlayOrientation({document:doc,screen:{orientation},enabled:()=>enabled,onChange:s=>states.push(s)});
 return {doc,root,orientation,calls,states,nav};
}
test('Android identification includes tablets with reduced user agent data',()=>{
 assert.ok(isAndroid({userAgent:'Mozilla Android 14 Tablet'}));
 assert.ok(isAndroid({userAgentData:{platform:'Android'}}));
 assert.equal(isAndroid({userAgent:'Windows Chrome'}),false);
});
test('a work click enters fullscreen before locking; home releases both',async()=>{
 const {nav,calls,doc}=setup();
 await nav.enter('portrait');assert.deepEqual(calls,['fullscreen','lock:portrait']);
 await nav.leave();assert.deepEqual(calls,['fullscreen','lock:portrait','unlock','exit']);
 assert.equal(doc.fullscreenElement,null);
});
test('desktop does not request fullscreen or lock orientation',async()=>{
 const {nav,calls,states}=setup({enabled:false});
 await nav.enter('portrait');await nav.leave();assert.deepEqual(calls,[]);
 assert.ok(states.every(s=>!s.showHint));
});
test('direct links do not request fullscreen without a user gesture',()=>{
 const {nav,calls,states,orientation}=setup();
 nav.update('portrait');assert.deepEqual(calls,[]);assert.ok(states.at(-1).showHint);
 orientation.type='portrait-primary';orientation.dispatchEvent(new Event('change'));
 assert.equal(states.at(-1).showHint,false);
});
test('switching owl to space reuses fullscreen and changes the orientation lock',async()=>{
 const {nav,calls}=setup();
 await nav.enter('portrait');await nav.update('landscape');
 assert.deepEqual(calls,['fullscreen','lock:portrait','unlock','lock:landscape']);
 await nav.update(undefined);assert.deepEqual(calls.slice(-2),['unlock','exit']);
});
test('denied APIs leave the game usable with an orientation hint',async()=>{
 const {nav,calls,root,orientation,states}=setup();
 root.requestFullscreen=async()=>{calls.push('denied fullscreen');throw Error('Denied')};
 orientation.lock=async()=>{calls.push('denied lock');throw Error('Unsupported')};
 await assert.doesNotReject(nav.enter('portrait'));
 assert.deepEqual(calls,['denied fullscreen','denied lock']);assert.ok(states.at(-1).showHint);
});
test('missing APIs do not block game selection',async()=>{
 const {nav,root,orientation,states}=setup();
 delete root.requestFullscreen;delete orientation.lock;
 await assert.doesNotReject(nav.enter('portrait'));await assert.doesNotReject(nav.leave());
 assert.equal(states.at(-1).showHint,false);
});
test('home while fullscreen is pending cleans up without acquiring a stale lock',async()=>{
 const {nav,doc,root,calls}=setup();let resolve;
 const pending=new Promise(r=>resolve=r);
 root.requestFullscreen=async()=>{calls.push('fullscreen');await pending;doc.fullscreenElement=root;doc.dispatchEvent(new Event('fullscreenchange'))};
 const entering=nav.enter('portrait');await nav.leave();resolve();await entering;
 assert.deepEqual(calls,['fullscreen','exit']);assert.equal(doc.fullscreenElement,null);
});
test('rapid work changes share one fullscreen request and lock the latest work',async()=>{
 const {nav,doc,root,calls}=setup();let resolve;
 const pending=new Promise(r=>resolve=r);
 root.requestFullscreen=async()=>{calls.push('fullscreen');await pending;doc.fullscreenElement=root;doc.dispatchEvent(new Event('fullscreenchange'))};
 const first=nav.enter('portrait'),second=nav.enter('landscape');resolve();await Promise.all([first,second]);
 assert.deepEqual(calls,['fullscreen','lock:landscape']);
});
test('manual fullscreen exit releases the lock and route changes do not reopen it',async()=>{
 const {nav,doc,calls}=setup();
 await nav.enter('portrait');doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'));
 await nav.update('landscape');
 assert.deepEqual(calls,['fullscreen','lock:portrait','unlock']);
});
test('leaving does not exit fullscreen that the application did not open',async()=>{
 const {nav,doc,root,calls}=setup();doc.fullscreenElement=root;
 await nav.enter('portrait');await nav.leave();
 assert.deepEqual(calls,['lock:portrait','unlock']);assert.equal(doc.fullscreenElement,root);
});


test('an orientation lock completing after exit is immediately released',async()=>{
 const {nav,doc,orientation,calls}=setup();let resolve;
 const pending=new Promise(r=>resolve=r);
 orientation.lock=async value=>{calls.push('lock:'+value);await pending};
 const entering=nav.enter('portrait');await Promise.resolve();await Promise.resolve();
 await nav.leave();resolve();await entering;
 assert.equal(doc.fullscreenElement,null);assert.ok(calls.includes('unlock'));
});
test('a rejected work switch does not leave the previous orientation locked',async()=>{
 const {nav,orientation,calls,states}=setup();await nav.enter('portrait');
 orientation.lock=async()=>{throw Error('Denied')};await nav.update('landscape');
 assert.equal(calls.at(-1),'unlock');assert.equal(states.at(-1).locked,false);assert.equal(states.at(-1).showHint,true);
});
