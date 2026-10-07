/* Service Worker for Toru O Portfolio & Tools */
const CACHE_NAME = 'toru-portfolio-v10';
const CORE_ASSETS = [
  './',
  'index.html',
  'floating-companion.js?v=7.3',
  'character-generator.js',
  'color-palette.js',
  'color-palette.css',
  'reference-board.js?v=2.6',
  'reference-board.css?v=2.6',
  'logo.png',
  'site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('Cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external analytics, video streaming, and Google Sheets CSV
  if (
    url.hostname.includes('goatcounter') ||
    url.hostname.includes('zgo.at') ||
    url.pathname.endsWith('.mp4') ||
    url.hostname.includes('docs.google.com') ||
    url.hostname.includes('googleusercontent.com')
  ) {
    return;
  }

  // HTML navigation: Network first, fall back to cache
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(request).then((cached) => cached || caches.match('index.html')))
    );
    return;
  }

  // JS & CSS scripts/styles or versioned queries: Network first, fall back to cache
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.search.includes('v=')) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Core assets: Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
