const CACHE='speed-v052';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','index.html','app-v052.js','style.css','manifest.webmanifest','data/speed.json','data/x.json','data/web.json','icons/icon-180.png']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if(u.pathname.endsWith('/app-v052.js')||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/sw-v052.js')) return; e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
