const CACHE_NAME = 'hexon-ai-v1';
const ASSETS = [
  './',
  './index.html',
  './icon.png'
];

// Installs background caching hooks
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Responds even when offline or experiencing poor network speeds
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
