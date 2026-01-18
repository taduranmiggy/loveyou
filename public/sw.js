// Milady PWA Service Worker - Capybara-powered offline support! 🦫✨

const CACHE_NAME = 'milady-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add your bundled assets here when they're generated
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/user',
  '/api/pill-types',
  '/api/quotes'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🦫 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('🦫 Caching static assets...');
        // Only cache assets that exist
        return cache.addAll([
          '/',
          '/manifest.json'
        ]);
      })
      .then(() => {
        console.log('🦫✨ Service Worker installed successfully!');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('🦫❌ Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🦫 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old cache versions
              return cacheName.startsWith('milady-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('🦫🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('🦫✅ Service Worker activated!');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First (for static assets)
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First (for API calls)
    if (isApiRequest(url.pathname)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (for HTML pages)
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    console.error('🦫❌ Fetch error:', error);
    return await getOfflineFallback(request);
  }
}

// Cache First strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('🦫📦 Serving from cache:', request.url);
    return cachedResponse;
  }
  
  console.log('🦫🌐 Fetching and caching:', request.url);
  const response = await fetch(request);
  
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network First strategy - for API calls
async function networkFirst(request) {
  try {
    console.log('🦫🌐 Fetching from network:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      console.log('🦫💾 Cached API response:', request.url);
    }
    
    return response;
  } catch (error) {
    console.log('🦫📦 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Add offline indicator to response headers
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Served-By', 'milady-cache');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: headers
      });
    }
    
    throw error;
  }
}

// Stale While Revalidate strategy - for HTML pages
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore fetch errors for background updates
  });
  
  if (cachedResponse) {
    console.log('🦫📦 Serving stale content:', request.url);
    return cachedResponse;
  }
  
  console.log('🦫🌐 No cache, waiting for network:', request.url);
  return await fetchPromise;
}

// Get offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For navigation requests, serve cached index.html
  if (request.mode === 'navigate') {
    const cachedPage = await caches.match('/');
    if (cachedPage) {
      console.log('🦫🏠 Serving cached homepage for navigation');
      return cachedPage;
    }
  }
  
  // For API requests, return offline message
  if (isApiRequest(url.pathname)) {
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'You are offline. This action will sync when reconnected. 🦫💭',
        capybara: '🦫'
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Served-By': 'milady-offline'
        }
      }
    );
  }
  
  // For other requests, return 404
  return new Response('🦫❌ Offline - Resource not available', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.includes('/static/') || 
         pathname.endsWith('.js') || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.png') || 
         pathname.endsWith('.jpg') || 
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

function isApiRequest(pathname) {
  return pathname.startsWith('/api/') || 
         API_CACHE_PATTERNS.some(pattern => pathname.includes(pattern));
}

// Background sync for queued actions
self.addEventListener('sync', (event) => {
  console.log('🦫🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'milady-sync') {
    event.waitUntil(
      // Notify the main app to process sync queue
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'BACKGROUND_SYNC',
            message: 'Process sync queue'
          });
        });
      })
    );
  }
});

// Push notifications (for future pill reminders)
self.addEventListener('push', (event) => {
  console.log('🦫📢 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : '🦫💕 Time for your pill reminder!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'taken',
        title: '✅ Taken',
        icon: '/check-icon.png'
      },
      {
        action: 'snooze',
        title: '⏰ Snooze 10min',
        icon: '/snooze-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Milady Pill Reminder 🦫', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🦫👆 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'taken') {
    // Mark pill as taken
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PILL_TAKEN',
            timestamp: new Date().toISOString()
          });
        });
      })
    );
  } else if (event.action === 'snooze') {
    // Snooze for 10 minutes
    setTimeout(() => {
      self.registration.showNotification('Milady Pill Reminder 🦫 (Snoozed)', {
        body: '🦫⏰ Snooze time is up! Time for your pill.',
        icon: '/icon-192.png',
        vibrate: [200, 100, 200]
      });
    }, 10 * 60 * 1000); // 10 minutes
  } else {
    // Default action - open app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('🦫✨ Milady Service Worker loaded successfully!');
