const SIZE=5,key=(x,y)=>x+','+y;
export class TraceHistory{
 constructor(points){this.points=points;this.buckets=new Map();for(let i=0;i<points.length;i++)this.index(i)}
 index(i){const p=this.points[i],id=key(Math.floor(p.x/SIZE),Math.floor(p.y/SIZE));if(!this.buckets.has(id))this.buckets.set(id,[]);this.buckets.get(id).push(i)}
 push(p){this.points.push(p);this.index(this.points.length-1)}
 truncate(length){
  while(this.points.length>length){const p=this.points.at(-1),id=key(Math.floor(p.x/SIZE),Math.floor(p.y/SIZE)),bucket=this.buckets.get(id);bucket.pop();if(!bucket.length)this.buckets.delete(id);this.points.pop()}
 }
 previous(p){
  const x=Math.floor(p.x/SIZE),y=Math.floor(p.y/SIZE),limit=this.points.length-8;
  let found=-1;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const bucket=this.buckets.get(key(x+dx,y+dy));if(!bucket)continue;
   for(let i=bucket.length-1;i>=0;i--){const index=bucket[i];if(index<=found)break;if(index>=limit)continue;const q=this.points[index];if((q.x-p.x)**2+(q.y-p.y)**2<25){found=index;break}}
  }
  return found;
 }
}
export function createFrameTask(draw,{request=requestAnimationFrame,cancel=cancelAnimationFrame}={}){
 let pending=null;
 function flush(){if(pending!==null){cancel(pending);pending=null}draw()}
 function schedule(){if(pending===null)pending=request(()=>{pending=null;draw()})}
 function clear(){if(pending!==null){cancel(pending);pending=null}}
 return {schedule,flush,clear};
}

