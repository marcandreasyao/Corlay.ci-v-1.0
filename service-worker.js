if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('corlay-cache-v3').then(cache => {
      return cache.addAll([
        './',
        'index.html',
        'contact.html',
        'assets/css/style.css',
        'assets/js/main.js',
        'assets/icons/icon-192x192.png',
        '/fallback.html'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => caches.match('/fallback.html'));
    })
  );
});