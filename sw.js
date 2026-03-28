/* ============================================================
   RUTA DE LAS GALLETAS PATAGÓNICAS — Service Worker
   Estrategia: Cache-first para assets propios + Google Fonts
   Incrementá la versión (v1 → v2, etc.) al publicar cambios.
   ============================================================ */

const CACHE_APP   = 'rgp-app-v3';
const CACHE_FONTS = 'rgp-fonts-v1';

const APP_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './icons/icon.svg',
  './icons/favicon.svg'
];

/* ===== INSTALL — pre-cache app shell ===== */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_APP)
      .then(cache => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ===== ACTIVATE — purge old caches ===== */
self.addEventListener('activate', (event) => {
  const keep = [CACHE_APP, CACHE_FONTS];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ===== FETCH ===== */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Google Fonts — cache-first, long-lived */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_FONTS).then(cache =>
        cache.match(request).then(cached =>
          cached || fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          })
        )
      )
    );
    return;
  }

  /* Same-origin requests — cache-first, fallback to network, then index.html */
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request)
          .then(response => {
            if (response.ok && request.method === 'GET') {
              caches.open(CACHE_APP).then(c => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => caches.match('./index.html'));
      })
    );
  }
});
