export const clampZoom=(value,max)=>Math.max(1,Math.min(max,value));
export function viewportShift(rect,anchor,point){return {x:rect.left+anchor.x*rect.width-point.x,y:rect.top+anchor.y*rect.height-point.y}}

// Fingers draw only. A second contact cancels drawing until every finger lifts.
export function attachBoardNavigation(board,{startTrace,moveTrace,endTrace,changeZoom=()=>{}}){
 const pointers=new Set();let traceId=null,blocked=false;
 function stop(){if(traceId!==null){traceId=null;endTrace()}}
 function clear(){const ids=[...pointers];pointers.clear();blocked=false;stop();for(const id of ids)if(board.hasPointerCapture(id))board.releasePointerCapture(id)}
 board.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;e.preventDefault();pointers.add(e.pointerId);board.setPointerCapture(e.pointerId);
  if(pointers.size>1){blocked=true;stop();return}
  if(!blocked&&startTrace(e)!==false)traceId=e.pointerId;
 });
 board.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;e.preventDefault();if(!blocked&&traceId===e.pointerId)moveTrace(e)});
 function finish(e){if(!pointers.delete(e.pointerId))return;if(traceId===e.pointerId)stop();if(!pointers.size)blocked=false;if(board.hasPointerCapture(e.pointerId))board.releasePointerCapture(e.pointerId)}
 for(const name of ['pointerup','pointercancel','lostpointercapture'])board.addEventListener(name,finish);
 board.addEventListener('wheel',e=>e.preventDefault(),{passive:false});
 board.addEventListener('keydown',e=>{if(!['+','=','-','_'].includes(e.key)||e.ctrlKey||e.metaKey||e.altKey)return;e.preventDefault();stop();changeZoom(e.key==='+'||e.key==='='?1:-1)});
 return {clear};
}
