import {performance} from 'node:perf_hooks';
import {createTraceRenderer} from '../dist/render-paths.js';
const points=Array.from({length:10000},(_,i)=>({x:i*2,y:Math.sin(i)}));
let writes=0,characters=0;
const layer={setAttribute(){}},make=()=>({setAttribute(key,value){if(key==='d'){writes++;characters+=value.length}},remove(){}});
const renderer=createTraceRenderer(layer,make,{color:'red',width:7});renderer.update(points,0);
function measure(fn){const samples=[];let chars=0;for(let run=0;run<5;run++){const start=performance.now();chars=fn();samples.push(performance.now()-start)}return {medianMs:+samples.sort((a,b)=>a-b)[2].toFixed(2),charactersPer300Frames:chars}}
const before=measure(()=>{let chars=0;for(let frame=0;frame<300;frame++)chars+=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ').length;return chars});
const after=measure(()=>{characters=0;for(let frame=0;frame<300;frame++)renderer.update(points,points.length-1);return characters});
console.log(JSON.stringify({points:points.length,frames:300,before,after,note:'Node serialization only; not Android FPS or browser paint time'},null,2));
