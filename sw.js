/* ============================================================
   RUTA DE LAS GALLETAS PATAGÓNICAS — Service Worker
   - App shell (HTML/CSS/JS/icons): cache-first
   - data/*.json y uploads/*:       network-first (siempre fresco)
   - Google Fonts:                  cache-first, long-lived
   Incrementá CACHE_APP al publicar cambios en el código.
   ============================================================ */

const CACHE_APP   = 'rgp-app-v4';
const CACHE_FONTS = 'rgp-fonts-v1';
const CACHE_DATA  = 'rgp-data-v1';

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
  const keep = [CACHE_APP, CACHE_FONTS, CACHE_DATA];
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

  if (url.origin !== self.location.origin) return;

  /* data/*.json y uploads/* — network-first, fallback a caché offline */
  const isData    = url.pathname.includes('/data/');
  const isUpload  = url.pathname.includes('/uploads/');

  if (isData || isUpload) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            caches.open(CACHE_DATA).then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request, { cacheName: CACHE_DATA }))
    );
    return;
  }

  /* App shell — cache-first, fallback a network */
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
});

