import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {Resvg} from '@resvg/resvg-js';
import sharp from 'sharp';
import {ADVENTURES} from '../dist/adventure-mazes.js';
import {createGridMaze,fishCenter} from '../dist/fish-maze.js';
import {wallPath,tilePaths} from '../dist/render-paths.js';
const dist=new URL('../dist/',import.meta.url),sources=new URL('../art-direction/thumbnail-sources/',import.meta.url),painted=new URL('../art-direction/painted-sources/',import.meta.url);
await mkdir(new URL('assets/scenes/',dist),{recursive:true});
const hash=data=>createHash('sha256').update(data).digest('hex');
const manifest={};
for(const [id,p]of Object.entries(ADVENTURES)){
 const originalArt=await readFile(new URL(id+'.png',painted)),meta=await sharp(originalArt).metadata();
 if(meta.width*2!==meta.height*3)throw Error('Expected 3:2 painted art: '+id);
 const m=createGridMaze(id,p.seed),overlay=[];
 const path=(d,fill,stroke='none',width=0)=>overlay.push(`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`);
 // Opaque, exact cell footprints cover all paint in the playable corridors.
 for(const [fill,d]of tilePaths(m.cells,fishCenter,()=>p.fill))path(d,fill);
 path(wallPath(m.outline),'none',p.border,6.5);path(wallPath(m.walls,true),'none',p.wall,2.3);
 for(const [cell,label,color,dx,anchor]of [[m.start,'スタート','#987143',-13,'end'],[m.goal,'ゴール','#a3695b',13,'start']]){const c=fishCenter(cell);overlay.push(`<rect x="${anchor==='end'?c.x+dx-68:c.x+dx-4}" y="${c.y+11}" width="${anchor==='end'?72:56}" height="24" rx="4" fill="#fcf5e4" fill-opacity=".94"/>`);overlay.push(`<text x="${c.x+dx}" y="${c.y+29}" text-anchor="${anchor}" fill="${color}" font-size="16">${label}</text>`)}
 const g=fishCenter(m.goal);path(`M${g.x+25} ${g.y-15} v-26 l20 7 l-20 7`,'#c68f77','#8f6c51',2.5);
 const xml=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" font-family="Zen Maru Gothic" font-weight="900"><image href="data:image/png;base64,${originalArt.toString('base64')}" width="1200" height="800"/>${overlay.join('')}</svg>`;
 const renderer=new Resvg(xml,{fitTo:{mode:'width',value:1800},font:{loadSystemFonts:false,fontFiles:[fileURLToPath(new URL('ZenMaruGothic-Black.ttf',sources))],defaultFontFamily:'Zen Maru Gothic'}}),png=renderer.render().asPng();
 const scenePath=new URL('assets/scenes/'+id+'.webp',dist),previewPath=new URL('assets/previews/'+id+'.webp',dist);
 const scene=await sharp(png).webp({quality:84,effort:6,smartSubsample:true}).toFile(fileURLToPath(scenePath));
 const preview=await sharp(png).resize({width:640}).webp({quality:80,effort:6}).toFile(fileURLToPath(previewPath));
 if(scene.size>450000||preview.size>65000)throw Error('Artwork exceeds mobile budget: '+id);
 // Browser-viewable production snapshot without embedding the original PNG again.
 const snapshot=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" data-painted-scene="${id}"><image href="./assets/scenes/${id}.webp" width="1200" height="800"/></svg>`;
 await writeFile(new URL(id+'.svg',sources),snapshot+'\n');
 manifest[id]={seed:p.seed,cells:m.cells.length,moves:m.solution.length-1,forks:m.solution.filter(i=>m.cells[i].links.length>=3).length,bytes:scene.size,width:scene.width,height:scene.height,geometry:hash(JSON.stringify(m.walls)),art:hash(originalArt),scene:hash(await readFile(scenePath)),overlay:hash(overlay.join('')),paintedSource:id+'.png'};
}
await writeFile(new URL('assets/scenes/manifest.json',dist),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest,null,2));
