// Import Workbox from a CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = 'corlay-cache-v2';

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Files to cache
const assetsToCache = [
  '/',
  'index.html',
  'contact.html',
  'assets/css/style.css',
  'assets/js/main.js',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-256x256.png',
  'assets/icons/icon-384x384.png',
  'assets/icons/icon-512x512.png',
  '/fallback.html',
];

// Precache and manage assets with Workbox
workbox.precaching.precacheAndRoute(assetsToCache);

// Stale-While-Revalidate for CSS and JS files
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);

// Cache First for images
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
      }),
    ],
  })
);

// Use the install event to pre-cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cache hit or make a network request if not in cache
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback if both cache and network fail
      return caches.match('/fallback.html');
    })
  );
});