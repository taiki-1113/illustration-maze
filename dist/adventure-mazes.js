const ellipse=(x,y,[cx,cy,rx,ry])=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
const polygon=(x,y,points)=>{let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [a,b]=points[i],[c,d]=points[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)inside=!inside}return inside};
// Artwork and collision masks use the same landforms and protected spaces.
export const ADVENTURES={
 treehouse:{ellipses:[[595,325,420,200]],polygons:[[[180,465],[340,465],[480,565],[1015,515],[1050,600],[420,630],[180,565]]],holes:[[390,300,105,85],[780,280,105,85]],startY:380,goalY:390,fill:'#f0f3df',border:'#9da67b',wall:'#5b6651',trail:'#b99856',seed:36},
 dinosaurs:{ellipses:[[600,425,470,225]],holes:[[390,380,128,95],[805,440,118,85]],startY:415,goalY:430,fill:'#faf0d8',border:'#c6aa79',wall:'#77664d',trail:'#d09b67',seed:143},
 castle:{polygons:[[[170,250],[310,250],[310,180],[470,180],[470,250],[730,250],[730,180],[890,180],[890,250],[1030,250],[1030,590],[170,590]]],holes:[[400,420,105,100],[800,420,105,100]],startY:580,goalY:340,fill:'#f5efdf',border:'#b6aaa0',wall:'#756c65',trail:'#b89773',seed:136},
 harbor:{ellipses:[[600,410,475,220]],holes:[[380,365,120,98],[800,445,120,90]],startY:400,goalY:400,fill:'#e9f4f2',border:'#98b6b5',wall:'#526e75',trail:'#be985a',seed:34},
 snow:{polygons:[[[135,510],[280,355],[345,355],[465,180],[600,340],[730,160],[870,345],[955,345],[1070,505],[1070,640],[135,640]]],holes:[[420,470,105,80],[800,490,105,80]],startY:550,goalY:550,fill:'#f5f7f1',border:'#a6bac1',wall:'#637982',trail:'#c19373',seed:98}
};
export const ADVENTURE_SHAPES=Object.fromEntries(Object.entries(ADVENTURES).map(([id,p])=>[id,{width:57,height:35,startY:p.startY,goalY:p.goalY,contains:(x,y)=>((p.ellipses||[]).some(e=>ellipse(x,y,e))||(p.polygons||[]).some(e=>polygon(x,y,e)))&&!p.holes.some(e=>ellipse(x,y,e)),region:()=>id}]));
