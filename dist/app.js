import {createMaze,center,point,cellAt,isWalkable,edgePoints,TAU,CX,CY,OUTER,COUNTS} from './maze.js';
import {drawSnail,drawTurtle} from './artworks.js';
const $=s=>document.querySelector(s),svg=$('#maze'),NS='http://www.w3.org/2000/svg';
const works=[{id:'snail',name:'かたつむり',seed:6,branchiness:0,color:'#d4a25c',trail:'#e9ad64'},{id:'turtle',name:'かめ',seed:2,branchiness:.2,color:'#7ba882',trail:'#90b99a'}];
let work=works[0],maze,scene=svg,trail,tip,s,g;
let points=[],current,active=false,started=false,complete=false,currentCell;
const sessions=new Map();
const make=(tag,attrs={},parent=scene)=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el};
const draw=(d,fill,stroke='#4a3b2b',width=5,parent=scene)=>make('path',{d,fill,stroke,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
function loadCleared(id){try{return localStorage.getItem(`illustration-maze:${id}:v1`)==='cleared'}catch{return false}}
function badges(){
 $('#clear-badge').hidden=!loadCleared(work.id);
 for(const w of works)$(`#${w.id}-card .card-status`).textContent=loadCleared(w.id)?'✓ クリアずみ · あそぶ':'あそぶ →';
 $('#collection-progress').textContent=`${works.filter(w=>loadCleared(w.id)).length} / ${works.length} クリア`;
}
function marker(c,label,color){const a=(c.s+.5)*TAU/COUNTS[c.r],p=point(OUTER+35,a),inside=center(c);make('circle',{cx:inside.x,cy:inside.y,r:12,fill:color,opacity:.17});const text=make('text',{x:p.x,y:p.y+5,'text-anchor':'middle',fill:color,'font-size':16,'font-weight':900});text.textContent=label;return p}
function buildArtwork(w){
 scene=svg;
 if(w.id==='snail')drawSnail(svg,make,draw);
 else {drawTurtle(svg,make,draw);scene=make('g',{transform:`translate(380 335) scale(1 .85) translate(${-CX} ${-CY})`},svg);make('circle',{cx:CX,cy:CY,r:OUTER,fill:'#fffdf5'});draw(`M ${CX-15} ${CY-12} L ${CX+7} ${CY-22} L ${CX+25} ${CY-5} L ${CX+17} ${CY+19} L ${CX-9} ${CY+24} L ${CX-25} ${CY+6} Z`,'#e6eedb','#b6c8a1',3);}
 const wallLayer=make('g',{'aria-hidden':'true'});
 if(w.id==='turtle')for(const wall of maze.walls)if(wall.every(p=>Math.abs(Math.hypot(p.x-CX,p.y-CY)-OUTER)<.01))draw(wall.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' '),'none','#9ab18a',12,wallLayer);
 for(const wall of maze.walls)draw(wall.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' '),'none','#493b2e',4.5,wallLayer);
 const pathLayer=make('g');trail=draw('','none',w.trail,11,pathLayer);trail.setAttribute('opacity','.75');
 s=center(maze.start);g=center(maze.goal);
 marker(maze.start,'スタート',w.id==='turtle'?'#739475':'#b58149');marker(maze.goal,'ゴール','#d48785');
 draw(`M ${g.x+25} ${g.y-15} l 0 -26 l 20 7 l -20 7`,'#e9a598','#956750',2.5);
 tip=make('g',{'pointer-events':'none'});make('circle',{cx:s.x,cy:s.y,r:11,fill:w.color,stroke:'#fffdf7','stroke-width':3},tip);make('circle',{cx:s.x-2,cy:s.y-2,r:2,fill:'#fff'},tip);
}
function selectWork(id,{remember=true}={}){
 if(remember&&current)sessions.set(work.id,{points:points.slice(),current,currentCell,started,complete});
 work=works.find(w=>w.id===id)||works[0];maze=createMaze(work.seed,work.branchiness);buildArtwork(work);
 const thumb=$(`#${work.id}-card svg`);if(!thumb.childNodes.length){thumb.innerHTML=svg.innerHTML;thumb.querySelectorAll('[id]').forEach(el=>{const old=el.id;el.id=`thumb-${work.id}-${old}`;for(const ref of thumb.querySelectorAll(`[fill="url(#${old})"]`))ref.setAttribute('fill',`url(#${el.id})`)})}
 $('#maze-title').textContent=`${work.name}の めいろ`;$('.heading .eyebrow span').textContent=work.id==='snail'?'01':'02';
 document.title=`イラストめいろ｜${work.name}`;svg.setAttribute('aria-label',`${work.name}の迷路。左下のスタートから右のゴールまで、道をなぞって進みます。`);
 history.replaceState(null,'',`#${work.id}`);
 $('#success-message').innerHTML=`さいごまで たどりつけたね。<br>${work.name}も うれしそう！`;
 const saved=sessions.get(work.id);if(saved){({points,current,currentCell,started,complete}=saved);active=false;render();$('#instruction').textContent=complete?'やったね！ ゴールに ついたよ！':started?'いろの ついた さきから つづけよう！':'スタートから ゆびで なぞってみよう！'}else reset();
 badges();
}
svg.setAttribute('tabindex','0');svg.setAttribute('role','application');
function render(){trail.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));tip.setAttribute('transform',`translate(${current.x-s.x} ${current.y-s.y})`)}
function reset(){points=[s];current=s;currentCell=maze.start.id;active=false;started=false;complete=false;render();$('#instruction').textContent='スタートから ゆびで なぞってみよう！'}
function win(){if(complete)return;complete=true;active=false;try{localStorage.setItem(`illustration-maze:${work.id}:v1`,'cleared')}catch{}badges();$('#instruction').textContent='やったね！ ゴールに ついたよ！';$('#success-dialog').showModal();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)for(let i=0;i<35;i++){const c=document.createElement('i');c.className='confetti';c.style.cssText=`left:${Math.random()*100}%;background:${['#d8b66f','#b2c898','#e6b1a1','#c4d6d8'][i%4]};animation-delay:${Math.random()*.6}s`;document.body.append(c);setTimeout(()=>c.remove(),3300)}}
function move(target){const dx=target.x-current.x,dy=target.y-current.y,length=Math.hypot(dx,dy),steps=Math.ceil(length/2);if(length>120)return;for(let i=0;i<steps;i++){const p={x:current.x+dx/steps,y:current.y+dy/steps};if(!isWalkable(p,maze))break;const next=cellAt(p,maze);if(next.id!==currentCell&&!maze.cells[currentCell].links.includes(next.id))break;currentCell=next.id;current=p;const oldIndex=points.findLastIndex((v,index)=>index<points.length-8&&Math.hypot(v.x-p.x,v.y-p.y)<5);if(oldIndex>=0)points.length=oldIndex+1;points.push(p);if(next.id===maze.goal.id&&Math.hypot(p.x-g.x,p.y-g.y)<14){render();win();return}}render()}
function eventPoint(e){const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(scene.getScreenCTM().inverse());return {x:p.x,y:p.y}}
svg.addEventListener('pointerdown',e=>{if(complete||e.button!==0)return;const p=eventPoint(e);if(Math.hypot(p.x-current.x,p.y-current.y)>25){$('#instruction').textContent=started?'いろの ついた さきから つづけよう！':'ひかる スタートに さわってね！';return}active=true;started=true;svg.setPointerCapture(e.pointerId);$('#instruction').textContent='いいかんじ！ ゴールまで たどろう！';e.preventDefault()});
svg.addEventListener('pointermove',e=>{if(active)for(const sample of e.getCoalescedEvents?.().length?e.getCoalescedEvents():[e])move(eventPoint(sample))});
for(const event of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(event,()=>active=false);
svg.addEventListener('keydown',e=>{if(complete)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();started=true;$('#instruction').textContent='やじるしキーで みちを えらぼう！';return}const vectors={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]},v=vectors[e.key];if(!v||!started)return;e.preventDefault();const cell=maze.cells[currentCell],p=center(cell);let best=null,score=.45;for(const id of cell.links){const pts=edgePoints(cell,maze.cells[id]),q=pts[Math.min(3,pts.length-1)],dx=q.x-p.x,dy=q.y-p.y,dot=(dx*v[0]+dy*v[1])/Math.hypot(dx,dy);if(dot>score){score=dot;best=id}}if(best!==null){current=p;points.push(p);for(const q of edgePoints(cell,maze.cells[best])){if(complete)break;move(q)}}});
$('#reset').onclick=reset;$('#collection').onclick=()=>$('#collection-dialog').showModal();$('.brand').onclick=e=>{e.preventDefault();$('#collection-dialog').showModal()};$('.dialog-close').onclick=()=>$('#collection-dialog').close();for(const w of works)$(`#${w.id}-card`).onclick=()=>{selectWork(w.id);$('#collection-dialog').close();svg.focus()};$('#next-work').onclick=()=>{$('#success-dialog').close();selectWork(works[(works.indexOf(work)+1)%works.length].id);svg.focus()};$('#play-again').onclick=()=>{$('#success-dialog').close();reset();svg.focus()};$('#finish').onclick=()=>$('#success-dialog').close();for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const initialId=location.hash.slice(1);
selectWork('turtle',{remember:false});selectWork('snail',{remember:false});
if(initialId==='turtle')selectWork('turtle',{remember:false});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id!==work.id&&works.some(w=>w.id===id))selectWork(id)});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
