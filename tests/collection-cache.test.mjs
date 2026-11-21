import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import vm from 'node:vm';
const dist=new URL('../dist/',import.meta.url),source=await readFile(new URL('sw.js',dist),'utf8');
function worker({failArt=false}={}){
 const events={},stored=new Set(),downloads=[],deleted=[];
 const keys=['illustration-maze-v13','another-app-cache'];
 const cache={
  addAll:async files=>{files.forEach(file=>stored.add(file))},
  match:async file=>stored.has(file)?{}:undefined,
  add:async file=>{downloads.push(file);if(failArt&&file.includes('picnic'))throw Error('Offline');stored.add(file)}
 };
 vm.runInNewContext(source,{self:{addEventListener:(name,handler)=>events[name]=handler,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>keys,delete:async key=>deleted.push(key)}});
 async function fire(name,data){let pending;events[name]({data,waitUntil:promise=>pending=promise});await pending}
 return {fire,stored,downloads,deleted};
}
test('offline shell contains real small previews and all local module dependencies',async()=>{
 const {fire,stored}=worker();await fire('install');
 assert.equal([...stored].filter(url=>url.includes('/previews/')).length,15);
 assert.ok(![...stored].some(url=>url.endsWith('space-adventure.png')||url.endsWith('picnic-gouache.png')));
 let total=0;
 for(const url of stored){
  const file=new URL(url==='./'?'index.html':url,dist);total+=(await stat(file)).size;
  if(url.endsWith('.js'))for(const match of (await readFile(file,'utf8')).matchAll(/from\s+['"](\.\/[^'"]+)['"]/g))assert.ok(stored.has(match[1]),'Missing offline module '+match[1]);
  if(url.endsWith('.webp')){const bytes=await readFile(file);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP')}
 }
 assert.ok(total<1024*1024,'Do not put full play images back into the initial shell');
});
test('full artwork is cached on the idle message and is not downloaded twice',async()=>{
 const {fire,stored,downloads}=worker();await fire('install');assert.equal(downloads.length,0);
 await fire('message',{type:'warm-art'});assert.equal(downloads.length,7);
 assert.ok(stored.has('./assets/space-adventure.png'));assert.ok(stored.has('./assets/picnic-gouache.png'));
 await fire('message',{type:'warm-art'});assert.equal(downloads.length,7);
});
test('offline artwork failure does not break the shell or other artwork',async()=>{
 const {fire,stored,downloads}=worker({failArt:true});
 await fire('install');await fire('activate');await fire('message',{type:'warm-art'});
 assert.ok(stored.has('./assets/previews/picnic.webp'));assert.ok(stored.has('./assets/space-adventure.png'));assert.equal(downloads.length,7);
});
test('updating the maze cache leaves other applications alone',async()=>{
 const {fire,deleted}=worker();await fire('activate');
 assert.deepEqual(deleted,['illustration-maze-v13']);
});
