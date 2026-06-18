// ================================================================
//  SERVICE WORKER — Makes the app work fully offline
// ================================================================

const CACHE = 'monkey-cup-v1';

// Files to cache when app first loads
const FILES = [
    'index.html',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// On install: cache all files
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
              .then(cache => cache.addAll(FILES))
    );
    self.skipWaiting();
});

// On activate: delete any old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                  .filter(k => k !== CACHE)
                  .map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// On fetch: serve from cache, fallback to network
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
              .then(cached => cached || fetch(e.request))
    );
});