const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
// Reserve room for falling sparks on portrait and short viewports as well.
export function planFireworks({width,height},card){
 const result=[],left=card.left,right=width-card.right;
 function add(x,y,size,color,delay){if(size>=32)result.push({x,y,size,color,delay})}
 if(Math.min(left,right)>=88){
  for(const [space,x,color]of [[left,left/2,'gold'],[right,card.right+right/2,'red']]){
   const size=Math.min(344,space*.82,height*.44);
   add(x,clamp(card.top+card.height*.12,size/2+12,height-size/2-38),size,color,color==='gold'?.38:.64);
   const small=size*.69;
   add(x,clamp(card.bottom-48,small/2+12,height-small/2-38),small,color==='gold'?'red':'teal',color==='gold'?1.06:1.28);
  }
  const size=Math.min(110,(card.top-52)*.8);
  add(width/2,card.top-40-size/2,size,'gold',.82);
 }else{
  const topSize=Math.min(100,(card.top-48)*.8,width*.24);
  for(const [i,x]of [.2,.5,.8].entries())add(width*x,card.top-36-topSize/2,topSize,i===1?'red':'gold',.38+i*.2);
  const bottomSize=Math.min(110,(height-card.bottom-48)*.8,width*.28);
  for(const [i,x]of [.27,.73].entries())add(width*x,card.bottom+24+bottomSize/2,bottomSize,i?'teal':'gold',1+i*.22);
 }
 return result;
}

// Three vector textures, rasterized once and reused; paths never animate.
const textures=new Map(),colors={gold:'#ffc978',red:'#f5a17c',teal:'#a2c9b5'};
export function fireworkTexture(color){
 if(textures.has(color))return textures.get(color);
 let state=color==='red'?711:color==='teal'?923:517;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 const paths=[],tips=[],xy=(x,y)=>`${x.toFixed(2)} ${y.toFixed(2)}`;
 for(let i=0;i<44;i++){
  const a=i*Math.PI*2/44+(random()-.5)*.035,r=94+random()*37,curve=(random()-.5)*.13;
  const x=Math.cos(a),y=Math.sin(a),inner=1+random()*12,endX=Math.cos(a+curve)*r,endY=Math.sin(a+curve)*r+18;
  paths.push(`M${xy(x*inner,y*inner)} Q${xy(x*r*.65,y*r*.65-8)} ${xy(endX,endY)}`);tips.push(`M${xy(endX,endY)} l.1 .1`);
 }
 const d=paths.join(' '),t=tips.join(' '),ink=colors[color]||colors.gold;
 const xml=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="-160 -160 320 320"><g fill="none" stroke-linecap="round"><path d="${d}" stroke="${ink}" stroke-width="6" opacity=".18"/><path d="${d}" stroke="${ink}" stroke-width="1.8" stroke-dasharray="2.1 3.6"/><path d="${t}" stroke="#fff2cf" stroke-width="3"/></g><circle r="1.8" fill="#fff1c9"/></svg>`;
 const url='data:image/svg+xml,'+encodeURIComponent(xml);textures.set(color,url);return url;
}
