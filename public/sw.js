const STATIC_CACHE = 'neurosantulan-static-v1';
const DYNAMIC_CACHE = 'neurosantulan-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/login',
  '/register',
  '/book-appointment',
  '/profile',
  '/admin',
  '/_next/static/css/',
  '/_next/static/js/',
  '/fonts/',
  '/images/',
  '/placeholder.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Skip Supabase requests (they need fresh data)
  if (url.hostname.includes('supabase')) return;

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('Serving from cache:', request.url);
          return response;
        }

        // Otherwise, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('Caching dynamic content:', request.url);
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            console.log('Network failed, trying cache fallback');
            return caches.match(request);
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline form submissions, etc.
  return Promise.resolve();
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Neurosantulan', options)
  );
});
