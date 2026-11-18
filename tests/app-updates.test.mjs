import test from 'node:test';
import assert from 'node:assert/strict';
import {createUpdateGate} from '../dist/app-updates.js';
function setup(controlled=true){let changed,safe=false,saving=true,saves=0,reloads=0;const gate=createUpdateGate({serviceWorker:{controller:controlled?{}:null,addEventListener:(name,cb)=>changed=cb},isSafe:()=>safe,save:()=>{saves++;return saving},reload:()=>reloads++});return {gate,change:()=>changed(),safe:v=>safe=v,saving:v=>saving=v,counts:()=>({saves,reloads})}}
test('updates wait until home, save progress before reloading, and reload once',()=>{const s=setup();s.change();assert.equal(s.counts().reloads,0);s.safe(true);s.gate.check();assert.deepEqual(s.counts(),{saves:1,reloads:1});s.change();s.gate.check();assert.equal(s.counts().reloads,1)});
test('first installation does not reload and a later upgrade does',()=>{const s=setup(false);s.safe(true);s.change();assert.equal(s.counts().reloads,0);s.change();assert.equal(s.counts().reloads,1)});
test('storage failure keeps in-memory progress instead of reloading',()=>{const s=setup();s.safe(true);s.saving(false);s.change();assert.equal(s.counts().reloads,0);s.saving(true);s.gate.check();assert.equal(s.counts().reloads,1)});
