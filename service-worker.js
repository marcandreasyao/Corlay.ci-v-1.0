self.addEventListener('install', event => {
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
});