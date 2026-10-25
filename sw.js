// Service worker de Mi Cartera: guarda los archivos de la app para que abra sin internet.
// Al publicar una versión nueva, cambia VERSION: el celular la descarga y se recarga sola.
const VERSION = 'v1';
const CACHE = 'mi-cartera-' + VERSION;
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/geist-latin-400-normal.woff2',
  './fonts/geist-latin-500-normal.woff2',
  './fonts/geist-latin-600-normal.woff2',
  './fonts/geist-latin-700-normal.woff2',
  './fonts/geist-mono-latin-400-normal.woff2',
  './fonts/geist-mono-latin-500-normal.woff2',
  './fonts/geist-mono-latin-600-normal.woff2',
  './fonts/instrument-serif-latin-400-normal.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('mi-cartera-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    })
  );
});
