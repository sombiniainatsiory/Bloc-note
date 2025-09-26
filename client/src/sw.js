// Nom du cache
const CACHE_NAME = "bloc-note-v1";
// Fichiers essentiels à mettre en cache (app shell)
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest"
  // Vite va générer /assets/* au build. On fera un "cache-first" dynamique ci-dessous.
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Stratégie cache-first pour assets statiques, network-first pour HTML
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // HTML -> network first (pour récupérer la dernière version), fallback cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Pour le reste -> cache first, sinon réseau et mise en cache
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          // Cache seulement les GET et même origine
          if (req.method === "GET" && url.origin === self.location.origin) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
      );
    })
  );
});
