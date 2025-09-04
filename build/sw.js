const CACHE_NAME = 'ds-visualizer-v1.0.0';
const STATIC_CACHE_NAME = 'ds-visualizer-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'ds-visualizer-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Routes that should work offline
const CACHE_ROUTES = [
  '/',
  '/data-structures',
  '/algorithms',
  '/offline'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else if (request.destination === 'script' || 
             request.destination === 'style' ||
             request.destination === 'font') {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Handle document requests (HTML pages)
async function handleDocumentRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Try network first for documents
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache');
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve root for SPA routes
    if (CACHE_ROUTES.some(route => pathname.startsWith(route))) {
      const rootResponse = await caches.match('/');
      if (rootResponse) {
        return rootResponse;
      }
    }
    
    // Return offline page if available
    const offlinePage = await caches.match('/offline');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Last resort - return a basic offline response
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Offline - Data Structure Visualizer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #333; margin-bottom: 1rem; }
          p { color: #666; margin-bottom: 1rem; }
          button {
            background: #6366F1;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          button:hover { background: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>You're Offline</h1>
          <p>Please check your internet connection and try again.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>
      `,
      {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );
  }
}

// Handle static assets (JS, CSS, fonts)
async function handleStaticRequest(request) {
  // Cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch static resource', error);
    throw error;
  }
}

// Handle other requests (API, images, etc.)
async function handleOtherRequest(request) {
  try {
    // Network first for other resources
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action button clicks
    console.log('Notification action clicked:', event.action);
  } else {
    // Handle notification body click
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        const url = event.notification.data?.url || '/';
        
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // Handle any pending offline actions
    console.log('Service Worker: Performing background sync');
    
    // Example: sync offline data, send analytics, etc.
    const pendingRequests = await getStoredRequests();
    
    for (const request of pendingRequests) {
      try {
        await fetch(request.url, request.options);
        await removeStoredRequest(request.id);
      } catch (error) {
        console.error('Service Worker: Failed to sync request', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Helper functions for IndexedDB operations
async function getStoredRequests() {
  // Implementation would use IndexedDB to store offline requests
  return [];
}

async function removeStoredRequest(id) {
  // Implementation would remove the request from IndexedDB
  return true;
}

// Periodic background sync (future enhancement)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync algorithm data, update cache, etc.
    console.log('Service Worker: Syncing content');
  } catch (error) {
    console.error('Service Worker: Content sync failed', error);
  }
}
