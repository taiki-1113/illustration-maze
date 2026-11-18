export function createCelebration(dialog,{document:doc=globalThis.document,random=Math.random,reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false,setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let paper=null,timer=null;
 function clear(){if(timer!==null){clearTimer(timer);timer=null}paper?.remove();paper=null}
 function play(){
  clear();if(reducedMotion())return;
  paper=doc.createElement('div');paper.className='celebration-paper';paper.setAttribute('aria-hidden','true');
  const colors=['#b88a35','#245e55','#b66142','#dfcba1'];
  for(let i=0;i<32;i++){
   const bit=doc.createElement('i');bit.className='paper-bit paper-bit-'+i%3;
   bit.style.cssText=`--x:${(i+.15+random()*.7)/32*100}vw;--sway:${(random()-.5)*180}px;--turn:${(random()-.5)*900}deg;--fall:${1900+random()*700}ms;--delay:${random()*400}ms;background:${colors[i%colors.length]}`;
   paper.append(bit);
  }
  dialog.append(paper);timer=setTimer(clear,3300);
 }
 dialog.addEventListener('close',clear);
 return {play,clear};
}
