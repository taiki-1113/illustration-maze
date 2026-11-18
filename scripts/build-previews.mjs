import {readFile,mkdir,writeFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {Resvg} from '@resvg/resvg-js';
import sharp from 'sharp';
const sources=new URL('../art-direction/thumbnail-sources/',import.meta.url),dist=new URL('../dist/',import.meta.url),output=new URL('assets/previews/',dist);
const ids=['snail','turtle','fish','owl','rocket','family','garden','sea','picnic','space'];
await mkdir(output,{recursive:true});
const manifest={width:640,previews:{}};
for(const id of ids){
 const original=await readFile(new URL(id+'.svg',sources),'utf8');
 let xml=original.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" font-family="Zen Maru Gothic" font-weight="700" ');
 for(const match of [...xml.matchAll(/<image href="([^"]+)"/g)]){
  const href=match[1];if(!href.startsWith('./assets/'))throw Error('Unexpected thumbnail image: '+href);
  const image=await readFile(new URL(href,dist));xml=xml.replace('href="'+href+'"','xlink:href="data:image/png;base64,'+image.toString('base64')+'"');
 }
 const renderer=new Resvg(xml,{fitTo:{mode:'width',value:640},font:{loadSystemFonts:false,fontFiles:[fileURLToPath(new URL('ZenMaruGothic-Black.ttf',sources))],defaultFontFamily:'Zen Maru Gothic'}});
 for(const href of renderer.imagesToResolve()){
  if(!href.startsWith('./assets/'))throw Error('Unexpected thumbnail image: '+href);
  renderer.resolveImage(href,await readFile(new URL(href,dist)));
 }
 const png=renderer.render().asPng(),destination=new URL(id+'.webp',output);
 const info=await sharp(png).webp({quality:90,effort:6,alphaQuality:100}).toFile(fileURLToPath(destination));
 manifest.previews[id]={file:id+'.webp',bytes:info.size,width:info.width,height:info.height,sourceHash:createHash('sha256').update(original).digest('hex')};
}
await sharp(fileURLToPath(new URL('assets/home-rocket.png',dist))).resize({width:600,withoutEnlargement:true}).webp({quality:88,effort:6,alphaQuality:100}).toFile(fileURLToPath(new URL('assets/home-rocket.webp',dist)));
await writeFile(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({previews:Object.values(manifest.previews).reduce((sum,p)=>sum+p.bytes,0),rocket:(await stat(new URL('assets/home-rocket.webp',dist))).size,files:manifest.previews},null,2));
