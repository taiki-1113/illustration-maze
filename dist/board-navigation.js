export const clampZoom=(value,max)=>Math.max(1,Math.min(max,value));
export function viewportShift(rect,anchor,point){
 return {x:rect.left+anchor.x*rect.width-point.x,y:rect.top+anchor.y*rect.height-point.y};
}
const position=e=>({x:e.clientX,y:e.clientY});
function pair(a,b){return {point:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))}}

// Keep camera gestures separate from tracing. Once a second finger arrives,
// every remaining contact belongs to navigation until all fingers are lifted.
export function attachBoardNavigation(board,{readFrame,changeFrame,panBy,startTrace,moveTrace,endTrace}){
 const pointers=new Map();
 let traceId=null,blocked=false,gesture=null;
 function stopTrace(){traceId=null;endTrace()}
 function beginGesture(){
  const ids=[...pointers.keys()].slice(0,2);
  const sample=pair(pointers.get(ids[0]),pointers.get(ids[1]));
  gesture={ids,...sample,frame:readFrame(sample.point)};
  board.classList.add('gesturing');
 }
 function clear(){
  const ids=[...pointers.keys()];pointers.clear();gesture=null;blocked=false;stopTrace();board.classList.remove('gesturing');
  for(const id of ids)if(board.hasPointerCapture(id))board.releasePointerCapture(id);
 }
 board.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  e.preventDefault();pointers.set(e.pointerId,position(e));board.setPointerCapture(e.pointerId);
  if(pointers.size>=2){blocked=true;stopTrace();beginGesture();return}
  if(!blocked&&startTrace(e)!==false)traceId=e.pointerId;
 });
 board.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  e.preventDefault();pointers.set(e.pointerId,position(e));
  if(gesture){
   const [a,b]=gesture.ids.map(id=>pointers.get(id));
   if(a&&b){const sample=pair(a,b);changeFrame({zoom:gesture.frame.zoom*sample.distance/gesture.distance,anchor:gesture.frame.anchor,point:sample.point})}
   return;
  }
  if(!blocked&&traceId===e.pointerId)moveTrace(e);
 });
 function finish(e){
  if(!pointers.has(e.pointerId))return;
  pointers.delete(e.pointerId);
  if(traceId===e.pointerId)stopTrace();
  gesture=null;board.classList.remove('gesturing');
  if(pointers.size>=2)beginGesture();
  else if(!pointers.size)blocked=false;
  if(board.hasPointerCapture(e.pointerId))board.releasePointerCapture(e.pointerId);
 }
 for(const name of ['pointerup','pointercancel','lostpointercapture'])board.addEventListener(name,finish);
 board.addEventListener('wheel',e=>{
  e.preventDefault();stopTrace();
  const unit=e.deltaMode===1?16:e.deltaMode===2?board.clientHeight:1;
  if(e.ctrlKey||e.metaKey){
   const point=position(e),frame=readFrame(point);
   changeFrame({zoom:frame.zoom*Math.exp(-Math.max(-100,Math.min(100,e.deltaY*unit))*.01),anchor:frame.anchor,point});
  }else panBy(e.deltaX*unit,e.deltaY*unit);
 },{passive:false});
 board.addEventListener('keydown',e=>{
  if(!['+','=','-','_'].includes(e.key)||e.ctrlKey||e.metaKey||e.altKey)return;
  e.preventDefault();stopTrace();
  const rect=board.getBoundingClientRect(),point={x:rect.left+rect.width/2,y:rect.top+rect.height/2},frame=readFrame(point);
  changeFrame({zoom:frame.zoom*(e.key==='+'||e.key==='='?1.25:.8),anchor:frame.anchor,point});
 });
 return {clear};
}

