import {planFireworks,fireworkTexture} from './fireworks.js';
export function createCelebration(dialog,{document:doc=globalThis.document,window:win=globalThis.window,random=Math.random,reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false,setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let layer=null,timer=null;
 function clear(){if(timer!==null){clearTimer(timer);timer=null}layer?.remove();layer=null;dialog.classList.remove('fireworks-active')}
 function play(){
  clear();if(reducedMotion())return;
  const width=doc.documentElement.clientWidth,height=win.innerHeight,card=dialog.getBoundingClientRect();
  const bursts=planFireworks({width,height},card);if(!bursts.length)return;
  layer=doc.createElement('div');layer.className='celebration-fireworks';layer.setAttribute('aria-hidden','true');
  for(const burst of bursts){
   const shell=doc.createElement('div');shell.className='firework-burst';shell.style.cssText=`left:${burst.x-burst.size/2}px;top:${burst.y-burst.size/2}px;width:${burst.size}px;height:${burst.size}px;--delay:${burst.delay}s`;
   const art=doc.createElement('img');art.src=fireworkTexture(burst.color);art.alt='';art.draggable=false;art.width=320;art.height=320;shell.append(art);layer.append(shell);
   if(burst.x<card.left-12||burst.x>card.right+12){const launch=doc.createElement('i');launch.className='firework-launch';launch.style.cssText=`left:${burst.x}px;top:${burst.y+25}px;--delay:${Math.max(0,burst.delay-.36)}s`;layer.append(launch)}
  }
  for(let i=0;i<8;i++){
   const space=i%2?width-card.right:card.left;if(space<40)continue;
   const x=(i%2?card.right:0)+12+random()*(space-24);
   const bit=doc.createElement('i');bit.className='paper-bit paper-bit-'+i%3;
   bit.style.cssText=`left:${x}px;--sway:0px;--turn:${(random()-.5)*700}deg;--fall:2600ms;--delay:${random()*600}ms;background:${i%3?'#c79b4b':'#e0c78e'}`;layer.append(bit);
  }
  dialog.append(layer);dialog.classList.add('fireworks-active');timer=setTimer(clear,4600);
 }
 dialog.addEventListener('close',clear);
 win?.addEventListener('resize',clear);
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)clear()});
 return {play,clear};
}
