export const isAndroid=nav=>/Android/i.test(nav?.userAgent||'')||nav?.userAgentData?.platform==='Android';

// Only a work-selection click enters fullscreen. Route changes can update an
// existing session, but must not reopen fullscreen after the user has exited.
export function createPlayOrientation({document:doc=globalThis.document,screen:device=globalThis.screen,enabled=()=>isAndroid(globalThis.navigator),onChange=()=>{}}={}){
 const root=doc.documentElement,orientation=device?.orientation;
 let preferred=null,active=false,version=0,ownedFullscreen=false,locked=false,pendingFullscreen=null;
 function notify(){
  const type=orientation?.type;
  const matches=preferred&&(type?type.startsWith(preferred):(preferred==='portrait'?root.clientHeight>=root.clientWidth:root.clientWidth>=root.clientHeight));
  onChange({preferred,locked,showHint:!!(enabled()&&preferred&&!matches)});
 }
 function unlock(){if(locked){try{orientation?.unlock?.()}catch{}locked=false}}
 async function exitOwned(){
  if(ownedFullscreen&&doc.fullscreenElement===root){ownedFullscreen=false;try{await doc.exitFullscreen()}catch{}}
 }
 async function enter(value){
  if(!value){await leave();return}
  if(preferred!==value)unlock();preferred=value;notify();
  if(!enabled())return;
  active=true;const ticket=++version;
  if(!doc.fullscreenElement&&root.requestFullscreen){
   if(!pendingFullscreen)pendingFullscreen=(async()=>{
    try{await root.requestFullscreen({navigationUI:'hide'});if(doc.fullscreenElement===root)ownedFullscreen=true}catch{}
   })();
   const waiting=pendingFullscreen;await waiting;if(pendingFullscreen===waiting)pendingFullscreen=null;
  }
  if(ticket!==version){if(!active)await exitOwned();return}
  try{
   if(orientation?.lock){await orientation.lock(value);if(ticket!==version){if(!active)try{orientation.unlock()}catch{}return}locked=true}
  }catch{}
  notify();
 }
 async function leave(){
  ++version;active=false;preferred=null;unlock();notify();await exitOwned();
 }
 function update(value){
  if(!value)return leave();
  if(active&&preferred!==value)return enter(value);
  preferred=value;notify();
 }
 doc.addEventListener('fullscreenchange',()=>{
  if((ownedFullscreen||active)&&doc.fullscreenElement!==root){ownedFullscreen=false;active=false;++version;unlock()}
  notify();
 });
 orientation?.addEventListener?.('change',notify);
 return {enter,update,leave};
}
