/* Fetch documents from the network, with a small offline contact page only.
   Never cache enquiry contents, full pages, analytics or hosting challenges. */
'use strict';
const CACHE='shreenath-auto-pwa-20261010-r25';
const OFFLINE='/offline';
const FILES=[OFFLINE,'/assets/css/offline.css?v=20261010-r14','/assets/js/offline.js?v=20261010-r14','/assets/images/app-icon/icon-192.png?v=20261010-r25','/assets/images/app-icon/icon-512.png?v=20261010-r25'];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    // Reject challenge/error pages rather than saving them as the offline app.
    const entries=await Promise.all(FILES.map(async path=>{
      const response=await fetch(path,{cache:'no-store',credentials:'same-origin'});
      if(!response.ok)throw new Error('Offline resource unavailable');
      const type=response.headers.get('content-type')||'';
      if(path===OFFLINE){
        if(!type.includes('text/html')||!(await response.clone().text()).includes('name="shreenath-offline"'))throw new Error('Unexpected offline document');
      }else if(path.includes('.css')?!type.includes('text/css'):path.includes('.js')?!/javascript/.test(type):!type.includes('image/png')){
        throw new Error('Unexpected offline resource');
      }
      return [path,response];
    }));
    const cache=await caches.open(CACHE);
    await Promise.all(entries.map(([path,response])=>cache.put(path,response)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('shreenath-auto-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  const offlineAsset=FILES.find(path=>path!==OFFLINE&&new URL(path,self.location.origin).pathname===url.pathname);
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{return await fetch(request,{cache:'no-store'});}
      catch{
        const cache=await caches.open(CACHE);
        return await cache.match(OFFLINE)||new Response('You are offline. Please reconnect and try again.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
  }else if(offlineAsset){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      return await cache.match(offlineAsset)||fetch(request);
    })());
  }
});
