import {ADVENTURES} from './adventure-mazes.js';

// Source illustrations are rasterized together with their exact maze walls at
// build time. No filters, textures, or large vector trees run during play.
export function drawAdventure(id,svg,make,draw,goal){
 const p=ADVENTURES[id];
 svg.innerHTML=`<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#edf3e8"/><stop offset="1" stop-color="#fcf5e4"/></linearGradient><linearGradient id="wood" x2="1" y2="1"><stop stop-color="#d2aa71"/><stop offset="1" stop-color="#b08052"/></linearGradient><linearGradient id="stone" x2="0" y2="1"><stop stop-color="#e2d5bd"/><stop offset="1" stop-color="#b7aa94"/></linearGradient></defs>`;
 const group=(x,y,scale=1)=>make('g',{transform:`translate(${x} ${y}) scale(${scale})`});
 function ink(parent){return {d:(d,fill,stroke='#71634c',w=2.5)=>draw(d,fill,stroke,w,parent),e:(x,y,rx,ry,fill)=>make('ellipse',{cx:x,cy:y,rx,ry,fill},parent),c:(x,y,r,fill)=>make('circle',{cx:x,cy:y,r,fill},parent),r:(x,y,w,h,fill,stroke='none')=>make('rect',{x,y,width:w,height:h,rx:3,fill,stroke,'stroke-width':2},parent)}}
 const K=ink(svg);
 K.r(0,0,1200,800,'#fbf5e7');
 K.e(605,714,460,20,'#e8e5d2');
 function sprig(x,y,scale=1,color='#9aa980'){
  const a=ink(group(x,y,scale));a.d('M0 0 Q-4 -25 0 -53 M0 -12 Q-29 -15 -23 -34 Q-3 -33 -1 -18 M0 -29 Q25 -33 21 -50 Q3 -48 0 -36','none',color,3);
 }
 function cloud(x,y,s=1){const a=ink(group(x,y,s));a.d('M-65 8 Q-85 -20 -50 -24 Q-43 -60 -9 -42 Q25 -63 43 -30 Q85 -33 75 8Z','#eeeade','none')}
 function house(x,y,s=1,snow=false){const a=ink(group(x,y,s));
  a.r(-66,-24,132,92,'url(#wood)','#876443');
  a.d('M-83 -23 L0 -88 L83 -23Z',snow?'#e9eee9':'#9a6253','#765345',3);
  if(snow)a.d('M-83 -23 L0 -88 L83 -23 L61 -21 L0 -68 L-58 -20Z','#f9faf5','none');
  a.r(37,-76,18,35,'#9b7960');
  a.r(-14,12,28,56,'#6c5745');a.c(5,43,2,'#e7c38a');
  for(const x of [-44,39]){a.r(x-11,1,23,25,'#e9d496','#82684a');a.d(`M${x} 2 v23 M${x-10} 13 h21`,'none','#82684a',2)}
  a.d('M-71 68 H73 M-62 78 H64 M-54 88 H55','none','#9e7952',4);
  for(const y of [-13,0,38,54])a.d(`M-62 ${y} H-21 M22 ${y} H61`,'none','#ae8256',1.5);
 }
 function tree(x,y,s=1,evergreen=false){const a=ink(group(x,y,s));
  a.d('M-8 18 L-10 -62 L9 -62 L12 18Z','#a88862','none');
  if(evergreen){a.d('M0 -140 L-41 -76 H-26 L-57 -30 H-31 L-67 2 H66 L30 -30 H52 L24 -76 H39Z','#77958a','#617e74',2);a.d('M0 -140 L-41 -76 H-26 L-57 -30 H-31 L-67 2 L-31 -7 L-18 -45 L-14 -43 L-8 -85 L-15 -84Z','#e2e9df','none')}
  else{a.e(0,-80,58,65,'#92a37d');a.e(-33,-58,40,43,'#a5b48b');a.e(33,-52,39,39,'#889d75');a.d('M0 -42 V-95 M0 -68 L-21 -88 M0 -59 L25 -79','none','#6e845e',2)}
 }
 function dinosaur(x,y,s=1,color='#99ad8c'){const a=ink(group(x,y,s));
  a.d('M-77 35 Q-107 39 -117 3 Q-88 20 -71 8 Q-57 -18 -19 -13 L-14 -61 Q-5 -83 20 -76 Q45 -69 34 -47 L19 -41 L19 13 Q43 22 46 44 L24 44 L13 28 L-18 28 L-25 48 L-44 48 L-41 27Z',color,'#607561',3);
  a.d('M-75 9 l7 -17 l11 9 l8 -17 l12 10 l11 -13 l9 10','#cbbd7d','#83936d',2);
  a.c(20,-64,3,'#485a49');a.d('M23 -49 Q13 -45 7 -48','none','#53684f',2);a.e(-29,5,32,20,'#c8d4ae');
  a.d('M-31 48 v-7 M-24 47 v-6 M30 43 v-6 M37 43 v-5','none','#607561',1.5);
 }
 if(id==='treehouse'){
  cloud(195,91,.7);cloud(1020,100,.9);
  K.d('M470 708 Q515 592 506 420 L645 400 Q610 585 710 708Z','url(#wood)','#92714e',4);
  K.d('M535 689 Q555 590 550 529 M592 678 Q576 615 589 547 M509 585 l-38 29 M642 622 l45 31','none','#a47b52',3);
  for(const [x,y,rx,ry] of [[355,286,205,186],[620,226,233,170],[855,305,201,180]])K.e(x,y,rx,ry,'#b3c29a');
  for(const [x,y,s] of [[160,690,.65],[1080,687,.6],[110,595,.4]])sprig(x,y,s);
 }else if(id==='dinosaurs'){
  cloud(210,121,.8);cloud(976,128,.8);
  K.d('M674 224 L813 74 L948 226Z','#b9ad8e','#a1967a',3);K.d('M769 121 L813 74 L854 120 L829 115 L809 130 L790 115Z','#e1c4a1','none');
  K.d('M170 692 Q400 653 610 679 T1060 686','none','#c8c79c',3);tree(173,263,.7);tree(1056,635,.65);
 }else if(id==='castle'){
  cloud(137,137,.7);cloud(1027,123,.8);
  K.d('M144 614 Q286 687 600 672 Q879 687 1058 615 L1063 688 Q600 759 138 690Z','#adc6c5','#93afb2',3);
  for(const x of [220,580,900])K.d(`M${x} 693 q30 -8 60 0 m-40 13 q20 -6 45 0`,'none','#d4e1d7',2);
  for(const x of [310,730]){K.r(x-12,137,185,142,'url(#stone)');K.d(`M${x-24} 137 l116 -88 l116 88Z`,'#ad7770','#8a655e',3);K.d(`M${x+92} 50 V19 l35 9 l-35 12`,'#a66753','#8b614a',2)}
  sprig(111,667,.8);sprig(1104,669,.7);
 }else if(id==='harbor'){
  cloud(300,103,.8);cloud(933,105,.8);
  K.e(600,415,507,255,'#d6e7df');
  for(const [x,y]of [[172,207],[1022,201],[270,680],[805,697]])K.d(`M${x} ${y} q20 -11 40 0 q20 -11 40 0`,'none','#a9c3c0',3);
  K.d('M80 348 L94 210 H130 L148 348Z','#e4d8b9','#8e826b',3);K.r(88,195,49,25,'#a76d5b');K.r(98,217,27,25,'#eddb9c');K.d('M85 195 L113 174 L142 195Z','#7d9390','#657f7b',2);K.d('M87 273 H138 M83 310 H143','none','#bd8d73',14);
 }else{
  K.r(0,0,1200,800,'#eff3ed');cloud(211,117,.8);cloud(1030,135,.7);
  K.d('M93 565 L333 182 L559 486 L746 88 L1108 553Z','#cfddd8','#adbfbc',3);
  K.d('M272 279 L333 182 L416 294 L359 278 L335 301 L308 271Z','#faf9f0','none');
  K.d('M666 253 L746 88 L876 260 L805 234 L771 259 L734 224 L698 269Z','#faf9f0','none');
  tree(155,324,.9,true);tree(1043,291,.95,true);tree(1100,683,.6,true);tree(145,696,.6,true);
 }
 // The land/boardwalk/stonework is itself the playable silhouette.
 for(const [cx,cy,rx,ry]of p.ellipses||[])make('ellipse',{cx,cy,rx,ry,fill:p.fill,stroke:p.border,'stroke-width':10});
 for(const poly of p.polygons||[])K.d(poly.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')+'Z',p.fill,p.border,10);
 if(id==='treehouse'){
  for(const [x,y,rx,ry]of p.holes)K.e(x,y,rx-5,ry-5,'#c8d3ad');
  house(390,293,.9);house(780,272,.9);
  K.d('M380 687 H623 M395 699 H608','none','#ac8657',4);
 }else if(id==='dinosaurs'){
  K.e(390,380,120,86,'#e7dfb9');K.e(805,440,110,77,'#e7dfb9');dinosaur(412,384,1.05);dinosaur(827,450,.83,'#baa581');
  for(const [x,y]of [[550,684],[591,690],[626,681]])K.e(x,y,15,10,'#d4c69e');sprig(123,625,.8,'#9da576');
 }else if(id==='castle'){
  K.e(400,420,99,94,'#d9dfc6');K.e(800,420,99,94,'#e7ddbe');
  const a=ink(group(400,422,.85));a.d('M-58 43 Q-108 25 -79 -7 L-33 3 L-29 -47 L-4 -24 L20 -62 L42 -31 L38 2 Q84 13 76 42 L38 46 L22 23 L-13 28 L-28 48Z','#97aa8d','#667c65',3);a.d('M-31 -8 L-83 -62 L-66 9Z','#c5cfa7','#718769',3);a.c(29,-27,3,'#4c604c');
  const b=ink(group(800,420));b.d('M-67 66 V-43 H-52 V-61 H-27 V-43 H27 V-61 H52 V-43 H67 V66Z','url(#stone)','#9c8f77',3);b.d('M-23 66 V20 Q0 -10 23 20 V66Z','#776d5f','#746856',2);b.r(-43,-22,15,24,'#7a8278');b.r(28,-22,15,24,'#7a8278');
 }else if(id==='harbor'){
  K.e(380,365,113,90,'#c6d4aa');K.e(800,445,113,83,'#e5cf9e');house(380,360,.7);tree(428,329,.42);
  const a=ink(group(800,443));a.d('M-42 34 v-36 h84 v36Z','#b58b56','#85663d',3);a.d('M-42 -2 Q0 -48 42 -2Z','#ca9f60','#85663d',3);a.r(-7,-15,14,36,'#e7c77b','#927040');a.c(0,6,3,'#80613d');sprig(852,479,.55);
  const b=ink(group(600,713,.8));b.d('M-66 -7 H66 L42 25 H-37Z','#a77357','#7e614b',3);b.d('M0 -12 V-102 L-52 -17Z','#f8edd0','#a89372',2);b.d('M8 -93 L8 -17 H56Z','#b8ceca','#7e9a97',2);
 }else{
  K.e(420,470,99,74,'#dbe4dc');K.e(800,490,99,74,'#dbe4dc');house(800,482,.82,true);
  const a=ink(group(423,472,.9));a.d('M-61 28 Q-86 1 -65 -31 Q-54 -53 -18 -43 Q14 -43 23 -13 L56 -10 Q77 3 62 24 L31 28 L14 45 H-4 L-8 24 H-37 L-42 44 H-60Z','#d9d2b9','#8c917e',3);a.c(61,-12,12,'#d9d2b9');a.c(49,3,3,'#626e65');a.e(-13,-1,40,27,'#e9e3d0');a.c(35,17,4,'#929984');
  for(const [x,y]of [[580,705],[607,691],[633,705]])K.e(x,y,5,8,'#b7c9c6');
 }
 if(goal){
  const x=goal.x+72,y=goal.y;
  K.d(`M${goal.x+9} ${y} H${x-26}`,'none',id==='harbor'?'#9ebbb7':'#b99c75',5);
  if(id==='treehouse'||id==='snow')house(x,y-28,.43,id==='snow');
  else if(id==='dinosaurs'){
   K.e(x,y+6,31,10,'#b59b6c');for(const [dx,dy]of [[-14,0],[0,-4],[14,0]])K.e(x+dx,y+dy,7,11,'#f8edce');
   K.d(`M${x-29} ${y+6} q29 14 58 0 m-52 7 q23 10 46 0`,'none','#977e54',3);
  }else if(id==='harbor'){
   K.e(x,y+10,35,12,'#dfc898');K.r(x-21,y-14,42,30,'#b38b54','#8f7045');K.d(`M${x-21} ${y-14} q21 -24 42 0Z`,'#cba164','#8f7045',2);K.r(x-3,y-16,6,22,'#e3c579');
  }else{
   K.r(x-27,y-37,54,53,'url(#stone)','#9c8f77');K.d(`M${x-29} ${y-37} l29 -25 l29 25Z`,'#ad7770','#8a655e',2);K.d(`M${x-11} ${y+16} v-24 q11 -18 22 0 v24Z`,'#766959','#8b7b64',2);
  }
 }
}
