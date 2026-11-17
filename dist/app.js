import {createMaze,center,point,cellAt,isWalkable,edgePoints,TAU,CX,CY,OUTER,COUNTS} from './maze.js';
const $=s=>document.querySelector(s),maze=createMaze(),svg=$('#maze'),NS='http://www.w3.org/2000/svg';
const make=(tag,attrs={},parent=svg)=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el};
const draw=(d,fill,stroke='#4a3b2b',width=5,parent=svg)=>make('path',{d,fill,stroke,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
svg.innerHTML=`<defs><linearGradient id="body" x2="0.5" y2="1"><stop stop-color="#fff0b3"/><stop offset="1" stop-color="#f4dc87"/></linearGradient><linearGradient id="leaf" x2="1" y2="1"><stop stop-color="#bbce9b"/><stop offset="1" stop-color="#92b681"/></linearGradient></defs>`;
// A quiet botanical setting keeps the playable shell easy to read.
make('ellipse',{cx:389,cy:566,rx:269,ry:18,fill:'#edf0dd'});
draw('M 99 552 Q 75 529 80 513 Q 102 519 105 544 Q 100 519 118 505 Q 129 531 110 550', '#b6ca98','none');
draw('M 655 552 Q 639 533 644 519 Q 662 525 662 543 Q 670 517 684 516 Q 688 537 667 553', '#b6ca98','none');
draw('M 126 551 C 190 568 399 582 562 557 C 637 546 678 501 691 465 C 697 445 685 432 670 440 L 600 475 L 248 425 C 215 425 205 404 208 370 C 228 335 228 292 209 270 L 220 211 C 232 208 235 195 232 184 C 226 166 201 168 197 184 C 193 193 198 205 206 209 L 192 257 Q 171 248 146 252 L 140 209 C 151 202 154 186 145 178 C 134 167 115 172 112 185 C 109 197 116 207 126 211 L 126 261 C 94 281 85 309 93 337 C 99 362 122 376 136 390 C 145 413 139 438 131 471 C 119 505 111 534 126 551 Z','url(#body)');
make('circle',{cx:135,cy:187,r:7,fill:'#51432f'});make('circle',{cx:215,cy:189,r:7,fill:'#51432f'});
make('ellipse',{cx:120,cy:328,rx:15,ry:9,fill:'#e9a693',opacity:.65});make('ellipse',{cx:199,cy:328,rx:15,ry:9,fill:'#e9a693',opacity:.65});
make('ellipse',{cx:140,cy:310,rx:5.5,ry:7,fill:'#493c2b'});make('ellipse',{cx:181,cy:310,rx:5.5,ry:7,fill:'#493c2b'});draw('M 150 330 Q 160 343 172 329','none','#493c2b',4);
make('circle',{cx:CX,cy:CY,r:OUTER,fill:'#fffdf5',stroke:'none'});
draw(`M ${CX-12} ${CY+19} C ${CX-51} ${CY-1} ${CX-20} ${CY-43} ${CX+12} ${CY-24} C ${CX+40} ${CY-6} ${CX+16} ${CY+31} ${CX-3} ${CY+16} Q ${CX-13} ${CY+6} ${CX} ${CY}`, 'none','#d4b77c',4);
const wallLayer=make('g',{'aria-hidden':'true'});
for(const w of maze.walls)draw(w.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' '),'none','#493b2e',4.5,wallLayer);
const pathLayer=make('g'),trail=draw('','none','#e9ad64',11,pathLayer);trail.setAttribute('opacity','.75');
const s=center(maze.start),g=center(maze.goal);
function marker(c,label,color){const a=(c.s+.5)*TAU/COUNTS[c.r],p=point(OUTER+35,a),inside=center(c);make('circle',{cx:inside.x,cy:inside.y,r:12,fill:color,opacity:.17});const text=make('text',{x:p.x,y:p.y+5,'text-anchor':'middle',fill:color,'font-size':16,'font-weight':900});text.textContent=label;return p}
marker(maze.start,'スタート','#b58149');marker(maze.goal,'ゴール','#d48785');
draw(`M ${g.x+25} ${g.y-15} l 0 -26 l 20 7 l -20 7`,'#e9a598','#956750',2.5);
const tip=make('g',{'pointer-events':'none'});make('circle',{cx:s.x,cy:s.y,r:11,fill:'#d4a25c',stroke:'#fffdf7','stroke-width':3},tip);make('circle',{cx:s.x-2,cy:s.y-2,r:2,fill:'#fff'},tip);
svg.setAttribute('tabindex','0');svg.setAttribute('role','application');
$('#thumbnail').innerHTML=svg.innerHTML;
let points=[s],current=s,active=false,started=false,complete=false,currentCell=maze.start.id,storageAvailable=true;
let cleared=false;try{cleared=localStorage.getItem('illustration-maze:snail:v1')==='cleared'}catch{storageAvailable=false}
function badges(){$('#clear-badge').hidden=!cleared;$('#card-status').textContent=cleared?'✓ クリアずみ · もういちど':'あそぶ →'}badges();
function render(){trail.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));tip.setAttribute('transform',`translate(${current.x-s.x} ${current.y-s.y})`)}
function reset(){points=[s];current=s;currentCell=maze.start.id;active=false;started=false;complete=false;render();$('#instruction').textContent='スタートから ゆびで なぞってみよう！'}
function win(){if(complete)return;complete=true;active=false;cleared=true;try{localStorage.setItem('illustration-maze:snail:v1','cleared')}catch{storageAvailable=false}badges();$('#instruction').textContent='やったね！ ゴールに ついたよ！';$('#success-dialog').showModal();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)for(let i=0;i<35;i++){const c=document.createElement('i');c.className='confetti';c.style.cssText=`left:${Math.random()*100}%;background:${['#d8b66f','#b2c898','#e6b1a1','#c4d6d8'][i%4]};animation-delay:${Math.random()*.6}s`;document.body.append(c);setTimeout(()=>c.remove(),3300)}}
function move(target){const dx=target.x-current.x,dy=target.y-current.y,length=Math.hypot(dx,dy),steps=Math.ceil(length/2);if(length>120)return;for(let i=0;i<steps;i++){const p={x:current.x+dx/steps,y:current.y+dy/steps};if(!isWalkable(p,maze))break;const next=cellAt(p,maze);if(next.id!==currentCell&&!maze.cells[currentCell].links.includes(next.id))break;currentCell=next.id;current=p;const oldIndex=points.findLastIndex((v,index)=>index<points.length-8&&Math.hypot(v.x-p.x,v.y-p.y)<5);if(oldIndex>=0)points.length=oldIndex+1;points.push(p);if(next.id===maze.goal.id&&Math.hypot(p.x-g.x,p.y-g.y)<14){render();win();return}}render()}
function eventPoint(e){const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());return {x:p.x,y:p.y}}
svg.addEventListener('pointerdown',e=>{if(complete||e.button!==0)return;const p=eventPoint(e);if(Math.hypot(p.x-current.x,p.y-current.y)>25){$('#instruction').textContent=started?'いろの ついた さきから つづけよう！':'ひかる スタートに さわってね！';return}active=true;started=true;svg.setPointerCapture(e.pointerId);$('#instruction').textContent='いいかんじ！ ゴールまで たどろう！';e.preventDefault()});
svg.addEventListener('pointermove',e=>{if(active)for(const sample of e.getCoalescedEvents?.().length?e.getCoalescedEvents():[e])move(eventPoint(sample))});
for(const event of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(event,()=>active=false);
svg.addEventListener('keydown',e=>{if(complete)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();started=true;$('#instruction').textContent='やじるしキーで みちを えらぼう！';return}const vectors={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]},v=vectors[e.key];if(!v||!started)return;e.preventDefault();const cell=maze.cells[currentCell],p=center(cell);let best=null,score=.45;for(const id of cell.links){const pts=edgePoints(cell,maze.cells[id]),q=pts[Math.min(3,pts.length-1)],dx=q.x-p.x,dy=q.y-p.y,dot=(dx*v[0]+dy*v[1])/Math.hypot(dx,dy);if(dot>score){score=dot;best=id}}if(best!==null){current=p;points.push(p);for(const q of edgePoints(cell,maze.cells[best])){if(complete)break;move(q)}}});
$('#reset').onclick=reset;$('#collection').onclick=()=>$('#collection-dialog').showModal();$('.brand').onclick=e=>{e.preventDefault();$('#collection-dialog').showModal()};$('.dialog-close').onclick=()=>$('#collection-dialog').close();$('#snail-card').onclick=()=>$('#collection-dialog').close();$('#play-again').onclick=()=>{$('#success-dialog').close();reset();svg.focus()};$('#finish').onclick=()=>$('#success-dialog').close();for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
