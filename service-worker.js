/* self.addEventListener('install', event => {
  console.log('Service worker installing...');
  // Perform install steps
  var CACHE_NAME = 'corlay-cache-v1';
  var urlsToCache = [
    '/',
    'index.html',
    'contact.html',
    'assets/css/style.css',
    'assets/js/main.js'
  ];

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
}); */

// Import Workbox from a CDN
// This is the "Offline copy of pages" service worker

const CACHE_NAME = 'corlay-cache-v2' // Update the version number

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

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
  '/fallback.html', // Ensure you have a fallback.html in your public directory
  // Add other necessary files for your PWA
];

// Precache and manage assets with Workbox
workbox.precaching.precacheAndRoute(assetsToCache);

// Stale-While-Revalidate for CSS and JS files
workbox.routing.registerRoute(
  ({request}) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Cache First for images
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // Cache images for 30 days
      })
    ]
  })
);

// Use the install event to pre-cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(assetsToCache);
      })
  );
});

// Enhanced fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache hit or make a network request if not in cache
        return response || fetch(event.request);
      })
      .catch(() => caches.match('/fallback.html')) // Fallback if both cache and network fail
  );
});