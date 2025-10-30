// ZDK Service Worker - Offline Support
const CACHE_NAME = 'zdk-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/game.js',
    '/supabase-config.js',
    '/icon-192.png',
    '/Pay for Performance.mp3'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Installed');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Offline fallback
                    return caches.match('/index.html');
                });
            })
    );
});

// Background sync (optional - for future features)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-game-data') {
        event.waitUntil(syncGameData());
    }
});

async function syncGameData() {
    // This will be called when connection is restored
    console.log('Service Worker: Syncing game data...');
    // Future: sync any pending game saves to Supabase
}

// Push notifications (optional - for future features)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nowe osiągnięcie odblokowane!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('ZDK - Klikam więc jestem', options)
    );
});