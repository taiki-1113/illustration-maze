// Apply an installed update at the collection, after saving this tab's progress.
// A controller appearing on first install is not an update and must not reload.
export function createUpdateGate({serviceWorker,isSafe,save,reload}){
 let controlled=!!serviceWorker.controller,pending=false,reloading=false;
 function check(){if(pending&&!reloading&&isSafe()&&save()){reloading=true;reload()}}
 serviceWorker.addEventListener('controllerchange',()=>{if(controlled)pending=true;controlled=true;check()});
 return {check};
}
