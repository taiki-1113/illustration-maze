import {createMaze,center as polarCenter,point,cellAt as polarCellAt,isWalkable as polarWalkable,edgePoints as polarEdgePoints,TAU,CX,CY,OUTER,COUNTS} from './maze.js';
import {createGridMaze,fishCenter,fishCellAt,fishWalkable,fishEdgePoints} from './fish-maze.js';
import {drawSnail,drawTurtle,drawFish,drawOwl,drawRocket,drawFamily,drawGarden,drawSea,drawPicnic,drawSpace} from './artworks.js';
const $=s=>document.querySelector(s),svg=$('#maze'),NS='http://www.w3.org/2000/svg';
const works=[{id:'snail',name:'かたつむり',seed:6,branchiness:0,color:'#d4a25c',trail:'#e9ad64'},{id:'turtle',name:'かめ',seed:2,branchiness:.2,color:'#7ba882',trail:'#90b99a'},{id:'fish',name:'さかな',seed:1,grid:true,color:'#669ca8',trail:'#91c6d0',border:'#89b8bf'},{id:'owl',name:'ふくろう',seed:24,grid:true,color:'#b08f64',trail:'#d7ba88',border:'#bca587'},{id:'rocket',name:'ロケット',seed:20,grid:true,color:'#bb817d',trail:'#e8b09c',border:'#ba9793'},{id:'family',name:'にわとりとひよこ',title:'にわとりと ひよこ',seed:1,grid:true,wide:true,color:'#a88e56',trail:'#d9b978',border:'#baa879'},{id:'garden',name:'はなばたけ',title:'ちょうちょと おはな',seed:1,grid:true,wide:true,color:'#a48caa',trail:'#cfafce',border:'#a9b590'},{id:'sea',name:'うみのなかま',title:'うみの なかまたち',seed:3,grid:true,wide:true,color:'#7babb5',trail:'#91c6ce',border:'#9bbec6',wallColor:'#586c73'},{id:'picnic',name:'おやつのピクニック',title:'おやつの ピクニック',seed:8,grid:true,wide:true,surfaceImage:true,color:'#b47b5d',trail:'#deb088',border:'#bdad96',wallColor:'#786b5a'},{id:'space',name:'うちゅうたんけん',title:'つきへの ぼうけん',seed:13,grid:true,wide:true,surfaceImage:true,navFill:'#142d43',cursorRocket:true,intro:'ロケットを つきの きちへ とどけよう！',live:'わくせいを まわって、つきの きちへ！',color:'#efd095',trail:'#e8bd6e',border:'#7ca5b5',wallColor:'#c7dbe0'}];
let work=works[0],maze,scene=svg,trail,tip,s,g;
let points=[],current,active=false,started=false,complete=false,currentCell;
const sessions=new Map();
const center=c=>work.grid?fishCenter(c):polarCenter(c);
const cellAt=(p,m)=>work.grid?fishCellAt(p,m):polarCellAt(p,m);
const isWalkable=(p,m)=>work.grid?fishWalkable(p,m):polarWalkable(p,m);
const edgePoints=(a,b)=>work.grid?fishEdgePoints(a,b):polarEdgePoints(a,b);
let zoom=1,panMode=false,panPointer=null;
function setZoom(value){
 zoom=Math.max(1,Math.min(work.wide?5:3,value));svg.style.width=`${zoom*100}%`;$('#zoom-level').textContent=`${Math.round(zoom*100)}%`;
 $('#zoom-out').disabled=zoom===1;$('#zoom-in').disabled=zoom===(work.wide?5:3);
 const board=$('.board');board.classList.toggle('magnified',zoom>1);if(zoom===1){board.scrollLeft=0;board.scrollTop=0;return}if(current){const p=new DOMPoint(current.x,current.y).matrixTransform(scene.getScreenCTM());const r=board.getBoundingClientRect();board.scrollLeft+=p.x-r.x-r.width/2;board.scrollTop+=p.y-r.y-r.height/2}
}
function setPan(value){panMode=value;panPointer=null;svg.classList.toggle('pan-mode',value);$('#pan-mode').setAttribute('aria-pressed',String(value));$('#pan-mode').textContent=value?'✎ なぞる にもどる':'✥ えを うごかす';active=false;}

const make=(tag,attrs={},parent=scene)=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el};
const draw=(d,fill,stroke='#4a3b2b',width=5,parent=scene)=>make('path',{d,fill,stroke,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
function loadCleared(id){try{return localStorage.getItem(`illustration-maze:${id}:v1`)==='cleared'}catch{return false}}
function badges(){
 $('#clear-badge').hidden=!loadCleared(work.id);
 for(const w of works)$(`#${w.id}-card .card-status`).textContent=loadCleared(w.id)?'✓ クリアずみ · あそぶ':'あそぶ →';
 $('#collection-progress').textContent=`${works.filter(w=>loadCleared(w.id)).length} / ${works.length} クリア`;
}
function marker(c,label,color){if(work.id==='space'){const p=center(c);const t=make('text',{x:c.id===maze.start.id?65:1145,y:p.y+58,'text-anchor':'middle',fill:'#f1d8a8','font-size':16,'font-weight':900});t.textContent=label;return p}if(work.grid){const p=center(c),left=c.id===maze.start.id;const t=make('text',{x:p.x+(left?-13:13),y:p.y+(left?29:27),'text-anchor':left?'end':'start',fill:color,'font-size':16,'font-weight':900});t.textContent=label;return p}const a=(c.s+.5)*TAU/COUNTS[c.r],p=point(OUTER+35,a),inside=center(c);make('circle',{cx:inside.x,cy:inside.y,r:12,fill:color,opacity:.17});const text=make('text',{x:p.x,y:p.y+5,'text-anchor':'middle',fill:color,'font-size':16,'font-weight':900});text.textContent=label;return p}
function buildArtwork(w){
 scene=svg;svg.setAttribute('viewBox',w.wide?'0 0 1200 800':'0 0 760 650');
 if(w.id==='snail')drawSnail(svg,make,draw);
 else if(w.grid){({fish:drawFish,owl:drawOwl,rocket:drawRocket,family:drawFamily,garden:drawGarden,sea:drawSea,picnic:drawPicnic,space:drawSpace}[w.id])(svg,make,draw);if(!w.surfaceImage)for(const c of maze.cells){const p=fishCenter(c);make('rect',{x:p.x-9,y:p.y-9,width:18,height:18,fill:({chick:'#fff9dd',grass:'#f4f7e9',pink:'#fff3f2',yellow:'#fff9dc',butterfly:'#f7f1fc',leaf:'#f2f7e9',sea:'#f9fcfd'})[c.region]||'#fffdf5'})}}
 else {drawTurtle(svg,make,draw);scene=make('g',{transform:`translate(380 335) scale(1 .85) translate(${-CX} ${-CY})`},svg);make('circle',{cx:CX,cy:CY,r:OUTER,fill:'#fffdf5'});draw(`M ${CX-15} ${CY-12} L ${CX+7} ${CY-22} L ${CX+25} ${CY-5} L ${CX+17} ${CY+19} L ${CX-9} ${CY+24} L ${CX-25} ${CY+6} Z`,'#e6eedb','#b6c8a1',3);}
 if(w.navFill){const tiles=maze.cells.map(c=>{const p=fishCenter(c);return `M ${p.x-9} ${p.y-9} h18 v18 h-18 Z`}).join(' ');const veil=draw(tiles,w.navFill,'none',0);veil.setAttribute('fill-opacity','.84')}
 const wallLayer=make('g',{'aria-hidden':'true'});
 if(w.id==='turtle')for(const wall of maze.walls)if(wall.every(p=>Math.abs(Math.hypot(p.x-CX,p.y-CY)-OUTER)<.01))draw(wall.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' '),'none','#9ab18a',12,wallLayer);
 if(w.grid)for(const wall of maze.outline)draw(wall.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' '),'none',w.border,6.5,wallLayer);
 for(const wall of maze.walls)draw(wall.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' '),'none',w.wallColor||'#493b2e',w.grid?2.3:4.5,wallLayer);
 const pathLayer=make('g');trail=draw('','none',w.trail,w.grid?7:11,pathLayer);trail.setAttribute('opacity','.75');
 s=center(maze.start);g=center(maze.goal);
 marker(maze.start,'スタート',w.id==='turtle'?'#739475':'#b58149');marker(maze.goal,'ゴール','#d48785');
 if(w.id==='space'){draw(`M ${s.x-9} ${s.y} h-14 M ${g.x+9} ${g.y} h20`,'none','#e7c788',3);make('circle',{cx:g.x,cy:g.y,r:10,fill:'none',stroke:'#e7c788','stroke-width':2});}else draw(`M ${g.x+25} ${g.y-15} l 0 -26 l 20 7 l -20 7`,'#e9a598','#956750',2.5);
 tip=make('g',{'pointer-events':'none'});if(w.cursorRocket){draw(`M ${s.x+10} ${s.y} Q ${s.x+3} ${s.y-7} ${s.x-6} ${s.y-5} L ${s.x-9} ${s.y-8} L ${s.x-8} ${s.y} L ${s.x-9} ${s.y+8} L ${s.x-6} ${s.y+5} Q ${s.x+3} ${s.y+7} ${s.x+10} ${s.y} Z`,'#fff2d5','#caa36b',1.8,tip);make('circle',{cx:s.x+1,cy:s.y,r:2.3,fill:'#79acbd'},tip);}else {make('circle',{cx:s.x,cy:s.y,r:w.grid?7:11,fill:w.color,stroke:'#fffdf7','stroke-width':3},tip);make('circle',{cx:s.x-2,cy:s.y-2,r:2,fill:'#fff'},tip);}
}
function selectWork(id,{remember=true}={}){
 if(remember&&current)sessions.set(work.id,{points:points.slice(),current,currentCell,started,complete});
 work=works.find(w=>w.id===id)||works[0];maze=work.grid?createGridMaze(work.id,work.seed):createMaze(work.seed,work.branchiness);buildArtwork(work);
 const thumb=$(`#${work.id}-card svg`);if(!thumb.childNodes.length){thumb.setAttribute('viewBox',svg.getAttribute('viewBox'));thumb.innerHTML=svg.innerHTML;thumb.querySelectorAll('[id]').forEach(el=>{const old=el.id;el.id=`thumb-${work.id}-${old}`;for(const ref of thumb.querySelectorAll(`[fill="url(#${old})"]`))ref.setAttribute('fill',`url(#${el.id})`)})}
 $('#maze-title').textContent=work.title||`${work.name}の めいろ`;$('.heading .eyebrow span').textContent=String(works.indexOf(work)+1).padStart(2,'0');
 $('.heading .eyebrow').firstChild.textContent=work.id==='rocket'?'のりものの めいろ ':work.id==='picnic'?'おいしい めいろ ':work.id==='space'?'うちゅうの めいろ ':'いきものの めいろ ';document.title=`イラストめいろ｜${work.name}`;svg.setAttribute('aria-label',`${work.name}の迷路。左のスタートから右のゴールまで、道をなぞって進みます。`);
 history.replaceState(null,'',`#${work.id}`);
 $('#success-message').innerHTML=`さいごまで たどりつけたね。<br>${work.id==='rocket'?'うちゅうへの ぼうけん、だいせいこう！':work.id==='family'?'おやこ みんなに あえたね！':work.id==='garden'?'おはなに たどりついたね！':work.id==='sea'?'うみの ぼうけん、だいせいこう！':work.id==='picnic'?'おやつの じかんに まにあったね！':work.id==='space'?'つきの きちに とうちゃく！':work.name+'も うれしそう！'}`;
 const saved=sessions.get(work.id);if(saved){({points,current,currentCell,started,complete}=saved);active=false;render();$('#instruction').textContent=complete?'やったね！ ゴールに ついたよ！':started?'いろの ついた さきから つづけよう！':work.intro||'スタートから ゆびで なぞってみよう！'}else reset();
 $('.zoom-hint').textContent=work.wide?'ひろい めいろは おおきくしてね':'こまかい みちは おおきくしてね';$('#zoom-controls').hidden=!work.grid;$('.board').classList.toggle('detailed',work.grid);setPan(false);setZoom(1);badges();
}
svg.setAttribute('tabindex','0');svg.setAttribute('role','application');
function render(){trail.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));const prev=points.length>1?points.at(-2):{x:current.x-1,y:current.y};const angle=work.cursorRocket?Math.atan2(current.y-prev.y,current.x-prev.x)*180/Math.PI:0;tip.setAttribute('transform',`translate(${current.x-s.x} ${current.y-s.y}) rotate(${angle} ${s.x} ${s.y})`)}
function reset(){points=[s];current=s;currentCell=maze.start.id;active=false;started=false;complete=false;render();if(work.grid){setPan(false);setZoom(zoom)}$('#instruction').textContent=work.intro||'スタートから ゆびで なぞってみよう！'}
function win(){if(complete)return;complete=true;active=false;try{localStorage.setItem(`illustration-maze:${work.id}:v1`,'cleared')}catch{}badges();$('#instruction').textContent='やったね！ ゴールに ついたよ！';$('#success-dialog').showModal();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)for(let i=0;i<35;i++){const c=document.createElement('i');c.className='confetti';c.style.cssText=`left:${Math.random()*100}%;background:${['#d8b66f','#b2c898','#e6b1a1','#c4d6d8'][i%4]};animation-delay:${Math.random()*.6}s`;document.body.append(c);setTimeout(()=>c.remove(),3300)}}
function move(target){const dx=target.x-current.x,dy=target.y-current.y,length=Math.hypot(dx,dy),steps=Math.ceil(length/2);if(length>120)return;for(let i=0;i<steps;i++){const p={x:current.x+dx/steps,y:current.y+dy/steps};if(!isWalkable(p,maze))break;const next=cellAt(p,maze);if(next.id!==currentCell&&!maze.cells[currentCell].links.includes(next.id))break;currentCell=next.id;current=p;const oldIndex=points.findLastIndex((v,index)=>index<points.length-8&&Math.hypot(v.x-p.x,v.y-p.y)<5);if(oldIndex>=0)points.length=oldIndex+1;points.push(p);if(next.id===maze.goal.id&&Math.hypot(p.x-g.x,p.y-g.y)<14){render();win();return}}render()}
function eventPoint(e){const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(scene.getScreenCTM().inverse());return {x:p.x,y:p.y}}
svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(panMode){const board=$('.board');panPointer={x:e.clientX,y:e.clientY,left:board.scrollLeft,top:board.scrollTop};svg.setPointerCapture(e.pointerId);e.preventDefault();return}if(complete)return;const p=eventPoint(e);if(Math.hypot(p.x-current.x,p.y-current.y)>25){$('#instruction').textContent=started?'いろの ついた さきから つづけよう！':'ひかる スタートに さわってね！';return}active=true;started=true;svg.setPointerCapture(e.pointerId);$('#instruction').textContent=work.live||'いいかんじ！ ゴールまで たどろう！';e.preventDefault()});
svg.addEventListener('pointermove',e=>{if(panPointer){const board=$('.board');board.scrollLeft=panPointer.left+panPointer.x-e.clientX;board.scrollTop=panPointer.top+panPointer.y-e.clientY;return}if(active)for(const sample of e.getCoalescedEvents?.().length?e.getCoalescedEvents():[e])move(eventPoint(sample))});
for(const event of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(event,()=>{active=false;panPointer=null});
svg.addEventListener('keydown',e=>{if(complete)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();started=true;$('#instruction').textContent='やじるしキーで みちを えらぼう！';return}const vectors={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]},v=vectors[e.key];if(!v||!started)return;e.preventDefault();const cell=maze.cells[currentCell],p=center(cell);let best=null,score=.45;for(const id of cell.links){const pts=edgePoints(cell,maze.cells[id]),q=pts[Math.min(3,pts.length-1)],dx=q.x-p.x,dy=q.y-p.y,dot=(dx*v[0]+dy*v[1])/Math.hypot(dx,dy);if(dot>score){score=dot;best=id}}if(best!==null){current=p;points.push(p);for(const q of edgePoints(cell,maze.cells[best])){if(complete)break;move(q)}}});
$('#reset').onclick=reset;$('#collection').onclick=()=>$('#collection-dialog').showModal();$('.brand').onclick=e=>{e.preventDefault();$('#collection-dialog').showModal()};$('.dialog-close').onclick=()=>$('#collection-dialog').close();for(const w of works)$(`#${w.id}-card`).onclick=()=>{selectWork(w.id);$('#collection-dialog').close();svg.focus()};$('#next-work').onclick=()=>{$('#success-dialog').close();selectWork(works[(works.indexOf(work)+1)%works.length].id);svg.focus()};$('#play-again').onclick=()=>{$('#success-dialog').close();reset();svg.focus()};$('#finish').onclick=()=>$('#success-dialog').close();for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
$('#zoom-in').onclick=()=>setZoom(zoom+1);$('#zoom-out').onclick=()=>setZoom(zoom-1);$('#pan-mode').onclick=()=>setPan(!panMode);
const initialId=location.hash.slice(1);
for(const w of works)selectWork(w.id,{remember:false});
selectWork(works.some(w=>w.id===initialId)?initialId:'snail',{remember:false});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id!==work.id&&works.some(w=>w.id===id))selectWork(id)});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
