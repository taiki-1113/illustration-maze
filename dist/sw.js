const CACHE='illustration-maze-v15';
const PREVIEWS=['snail','turtle','fish','owl','rocket','family','garden','sea','picnic','space'].map(id=>'./assets/previews/'+id+'.webp');
const FILES=['./','./index.html','./style.css','./app.js','./celebration.js','./play-orientation.js','./collision-index.js','./trace-history.js','./board-navigation.js','./maze.js','./fish-maze.js','./artworks.js','./assets/home-rocket.webp','./assets/paper-grain.svg','./icon.svg','./manifest.webmanifest',...PREVIEWS];
const ART=['./assets/picnic-gouache.png','./assets/space-adventure.png'];
let warming;
function warmArt(){
 if(!warming)warming=(async()=>{const cache=await caches.open(CACHE);for(const file of ART){try{if(!await cache.match(file))await cache.add(file)}catch{}}})().finally(()=>{warming=null});
 return warming;
}
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('illustration-maze-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data?.type==='warm-art')e.waitUntil(warmArt())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request).then(r=>r||Response.error())))});
