/* Service worker mínimo: cachea el simulador para que abra sin internet
   después de la primera visita. No guarda progreso del examen —
   eso es intencional, ver la nota en el propio simulador. */
const CACHE = "simulador-unam-v3";
const ARCHIVOS = ["./", "./simulador-unam.html", "./manifest.json",
                   "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(()=>{});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
