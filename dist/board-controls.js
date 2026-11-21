export const ZOOM_LEVELS=[1,1.5,2,2.5,3];
export function stepZoom(zoom,direction){return direction>0?(ZOOM_LEVELS.find(x=>x>zoom+.01)||3):([...ZOOM_LEVELS].reverse().find(x=>x<zoom-.01)||1)}
export function attachBoardControls(root,{getZoom,zoomTo,panBy,stopTrace,request=requestAnimationFrame,cancel=cancelAnimationFrame}){
 const directions={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
 const panButtons=[...root.querySelectorAll('[data-pan]')],zoomButtons=[...root.querySelectorAll('[data-zoom]')];
 const disable=(button,value)=>{if(button.disabled!==value)button.disabled=value};
 let pending=null,held=null,start=0,last=0;
 function clear(){if(pending!==null)cancel(pending);pending=null;held=null}
 function frame(now){pending=null;if(!held)return;if(!start){start=now;last=now}const dt=Math.min(32,now-last);last=now;if(now-start>300)panBy(held[0]*dt*.55,held[1]*dt*.55);if(held)pending=request(frame)}
 for(const button of panButtons){
  const delta=directions[button.dataset.pan];
  button.addEventListener('pointerdown',e=>{if(e.button!==0||button.disabled)return;e.preventDefault();clear();stopTrace();held=delta;start=0;last=0;button.setPointerCapture(e.pointerId);panBy(delta[0]*100,delta[1]*100);if(held)pending=request(frame)});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,clear);
  button.addEventListener('click',e=>{if(e.detail===0&&!button.disabled){stopTrace();panBy(delta[0]*100,delta[1]*100)}});
 }
 for(const button of zoomButtons)button.addEventListener('click',()=>{clear();stopTrace();zoomTo(button.dataset.zoom==='fit'?1:stepZoom(getZoom(),Number(button.dataset.zoom)))});
 return {clear,update({left,top,maxLeft,maxTop}){
  const zoom=getZoom();
  for(const button of zoomButtons)disable(button,button.dataset.zoom==='1'?zoom>=3:zoom<=1);
  for(const button of panButtons){const dir=button.dataset.pan;disable(button,zoom<=1||(dir==='left'?left<=1:dir==='right'?left>=maxLeft-1:dir==='up'?top<=1:top>=maxTop-1));if(button.disabled&&held===directions[dir])clear()}
 }};
}
