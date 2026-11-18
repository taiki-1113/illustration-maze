const cache=new WeakMap(),BUCKET=32;
const key=(x,y)=>x+','+y;
// Index expanded wall bounds once. A point only needs the segments in its bucket.
export function nearbyWalls(walls,padding){
 let versions=cache.get(walls);if(!versions){versions=new Map();cache.set(walls,versions)}
 if(versions.has(padding))return versions.get(padding);
 const buckets=new Map();
 for(const wall of walls)for(let i=1;i<wall.length;i++){
  const a=wall[i-1],b=wall[i],segment=[a,b];
  for(let y=Math.floor((Math.min(a.y,b.y)-padding)/BUCKET);y<=Math.floor((Math.max(a.y,b.y)+padding)/BUCKET);y++)
   for(let x=Math.floor((Math.min(a.x,b.x)-padding)/BUCKET);x<=Math.floor((Math.max(a.x,b.x)+padding)/BUCKET);x++){
    const id=key(x,y);if(!buckets.has(id))buckets.set(id,[]);buckets.get(id).push(segment);
   }
 }
 const index={at:p=>buckets.get(key(Math.floor(p.x/BUCKET),Math.floor(p.y/BUCKET)))||[]};
 versions.set(padding,index);return index;
}
export function clearOfWalls(p,walls,padding){
 const limit=padding*padding;
 for(const [a,b] of nearbyWalls(walls,padding).at(p)){
  const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
  const t=length?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)):0;
  const x=p.x-a.x-t*dx,y=p.y-a.y-t*dy;
  if(x*x+y*y<limit)return false;
 }
 return true;
}

