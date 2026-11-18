// Keep each original segment/subpath, but share SVG nodes with identical paint.
export const wallPath=(walls,rounded=false)=>walls.map(wall=>wall.map((p,i)=>`${i?'L':'M'} ${rounded?p.x.toFixed(2):p.x} ${rounded?p.y.toFixed(2):p.y}`).join(' ')).join(' ');
export function tilePaths(cells,center,color){
 const groups=new Map();
 for(const cell of cells){const p=center(cell),fill=color(cell);groups.set(fill,(groups.get(fill)||'')+`M ${p.x-9} ${p.y-9} h18 v18 h-18 Z `)}
 return groups;
}

// Completed sections stay untouched while tracing. Only the last section is
// reparsed by SVG; rewinding invalidates just the sections it actually changes.
export function createTraceRenderer(layer,make,{color,width},size=128){
 const paths=[];let previous=null;
 layer.setAttribute('opacity','.75');
 return {update(points,dirtyFrom=0){
  if(previous!==points){dirtyFrom=0;previous=points}
  const count=Math.max(1,Math.ceil((points.length-1)/size));
  while(paths.length>count)paths.pop().remove();
  const first=Math.max(0,Math.floor((dirtyFrom-1)/size));
  for(let chunk=first;chunk<count;chunk++){
   if(!paths[chunk])paths[chunk]=make('path',{fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},layer);
   const start=chunk*size,end=Math.min(points.length,start+size+1),parts=[];
   for(let i=start;i<end;i++){const p=points[i];parts.push(`${i===start?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)}
   paths[chunk].setAttribute('d',parts.join(' '));
  }
 }};
}
