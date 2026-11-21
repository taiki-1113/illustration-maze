import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {Resvg} from '@resvg/resvg-js';
import sharp from 'sharp';
import {ADVENTURES} from '../dist/adventure-mazes.js';
import {drawAdventure} from '../dist/adventure-artworks.js';
import {createGridMaze,fishCenter} from '../dist/fish-maze.js';
import {wallPath,tilePaths} from '../dist/render-paths.js';
const dist=new URL('../dist/',import.meta.url),sources=new URL('../art-direction/thumbnail-sources/',import.meta.url);
await mkdir(new URL('assets/scenes/',dist),{recursive:true});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function node(tag,attrs={}){return {tag,attrs,children:[],innerHTML:'',textContent:'',append(el){this.children.push(el)}}}
function xml(el){return `<${el.tag} ${Object.entries(el.attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')}>${el.innerHTML}${escape(el.textContent)}${el.children.map(xml).join('')}</${el.tag}>`}
const manifest={};
for(const [id,p]of Object.entries(ADVENTURES)){
 const svg=node('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 1200 800','font-family':'Zen Maru Gothic','font-weight':900});
 const make=(tag,attrs={},parent=svg)=>{const el=node(tag,attrs);parent.append(el);return el};
 const draw=(d,fill,stroke='#71634c',width=3,parent=svg)=>make('path',{d,fill,stroke,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
 const m=createGridMaze(id,p.seed);
 drawAdventure(id,svg,make,draw,fishCenter(m.goal));
 for(const [fill,d]of tilePaths(m.cells,fishCenter,()=>p.fill))draw(d,fill,'none',0);
 draw(wallPath(m.outline),'none',p.border,6.5);draw(wallPath(m.walls,true),'none',p.wall,2.3);
 for(const [cell,label,color,dx,anchor]of [[m.start,'スタート','#987143',-13,'end'],[m.goal,'ゴール','#a3695b',13,'start']]){const c=fishCenter(cell);make('text',{x:c.x+dx,y:c.y+29,'text-anchor':anchor,fill:color,'font-size':16}).textContent=label}
 const g=fishCenter(m.goal);draw(`M${g.x+25} ${g.y-15} v-26 l20 7 l-20 7`,'#c68f77','#8f6c51',2.5);
 const original=xml(svg),renderer=new Resvg(original,{fitTo:{mode:'width',value:1800},font:{loadSystemFonts:false,fontFiles:[fileURLToPath(new URL('ZenMaruGothic-Black.ttf',sources))],defaultFontFamily:'Zen Maru Gothic'}}),png=renderer.render().asPng();
 await writeFile(new URL(id+'.svg',sources),original+'\n');
 const scene=await sharp(png).webp({quality:91,effort:6}).toFile(fileURLToPath(new URL('assets/scenes/'+id+'.webp',dist)));
 await sharp(png).resize({width:640}).webp({quality:88,effort:6}).toFile(fileURLToPath(new URL('assets/previews/'+id+'.webp',dist)));
 manifest[id]={seed:p.seed,cells:m.cells.length,moves:m.solution.length-1,forks:m.solution.filter(i=>m.cells[i].links.length>=3).length,bytes:scene.size,geometry:createHash('sha256').update(JSON.stringify(m.walls)).digest('hex')};
}
await writeFile(new URL('assets/scenes/manifest.json',dist),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest,null,2));
