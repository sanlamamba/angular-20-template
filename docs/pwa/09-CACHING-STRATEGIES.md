# 09 - Caching Strategies in Angular PWA

---

## Table of Contents
1. What is Caching?
2. Why Caching Matters for PWAs
3. Types of Caching
4. Caching Strategies Overview
5. Caching in Angular: Asset Groups & Data Groups
6. Implementing Caching Strategies in ngsw-config.json
7. Custom Caching with Service Worker (Advanced)
8. Debugging and Testing Caching
9. Best Practices
10. Further Reading

---

## 1. What is Caching?
Caching is the process of storing copies of files or data in a location closer to the user (browser, device) so that future requests for that data can be served faster, even offline.

## 2. Why Caching Matters for PWAs
- **Offline support**: Serve content when the user is offline
- **Performance**: Reduce load times by serving from cache
- **Reduced server load**: Fewer requests to backend
- **Improved reliability**: App works even with flaky connections

## 3. Types of Caching
- **Static/Asset Caching**: HTML, CSS, JS, images
- **Dynamic/Data Caching**: API responses, user data
- **Runtime Caching**: Caching resources as they are requested

## 4. Caching Strategies Overview

### 4.1. Cache First (Performance Strategy)
**Flow:** Cache → Network → Fallback

```
Request comes in
     ↓
Check cache
     ↓
   Found? ──Yes──→ Return from cache
     ↓
    No
     ↓
Fetch from network
     ↓
  Success? ──Yes──→ Cache response + Return
     ↓
    No
     ↓
Return fallback
```

**Use cases:**
- Static assets (JS, CSS, images, fonts)
- App shell components
- Icons and logos
- Content that rarely changes

**Implementation (vanilla):**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(networkResponse => {
            return caches.open('dynamic-v1')
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          });
      })
      .catch(() => {
        // Return offline fallback
        return caches.match('/offline.html');
      })
  );
});
```

**Angular (ngsw-config.json):**
```json
{
  "assetGroups": [
    {
      "name": "app-assets",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.css",
          "/*.js",
          "/*.woff2"
        ]
      }
    }
  ]
}
```

### 4.2. Network First (Freshness Strategy)
**Flow:** Network → Cache → Fallback

```
Request comes in
     ↓
Fetch from network (with timeout)
     ↓
  Success? ──Yes──→ Cache response + Return
     ↓
    No/Timeout
     ↓
Check cache
     ↓
   Found? ──Yes──→ Return from cache
     ↓
    No
     ↓
Return error/fallback
```

**Use cases:**
- API responses
- User data
- News feeds
- Frequently updated content

**Implementation (vanilla):**
```js
const TIMEOUT = 3000; // 3 seconds

self.addEventListener('fetch', event => {
  event.respondWith(
    Promise.race([
      fetch(event.request)
        .then(networkResponse => {
          // Cache successful response
          return caches.open('api-v1')
            .then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
        }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), TIMEOUT)
      )
    ])
    .catch(() => {
      // Fallback to cache
      return caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('Serving stale data from cache');
            return cachedResponse;
          }
          throw new Error('No cached data available');
        });
    })
  );
});
```

**Angular (ngsw-config.json):**
```json
{
  "dataGroups": [
    {
      "name": "api-freshness",
      "urls": [
        "https://api.example.com/users/**",
        "https://api.example.com/posts/**"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "3s"
      }
    }
  ]
}
```

### 4.3. Stale-While-Revalidate
**Flow:** Cache immediately → Update in background

```
Request comes in
     ↓
Check cache
     ↓
   Found? ──Yes──→ Return from cache immediately
     │                        ↓
     │              Fetch from network in background
     │                        ↓
     │                Update cache silently
     ↓
    No
     ↓
Fetch from network → Cache → Return
```

**Use cases:**
- Social media feeds
- Product listings
- User profiles
- Content where immediate response is more important than freshness

**Implementation (vanilla):**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('swr-cache-v1')
      .then(cache => {
        return cache.match(event.request)
          .then(cachedResponse => {
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            
            // Return cached response immediately, or wait for network
            return cachedResponse || fetchPromise;
          });
      })
  );
});
```

**Workbox (recommended for SWR):**
```js
import { StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/products'),
  new StaleWhileRevalidate({
    cacheName: 'products-cache',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200 ? response : null;
        }
      }
    ]
  })
);
```

### 4.4. Cache Only
**Flow:** Only serve from cache, never network

**Use cases:**
- Offline-only apps
- Pre-cached essential resources
- Testing/development

**Implementation:**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (!response) {
          throw new Error('Not in cache');
        }
        return response;
      })
  );
});
```

### 4.5. Network Only
**Flow:** Always fetch from network, never cache

**Use cases:**
- Authentication endpoints
- Payment processing
- Real-time data
- Sensitive operations

**Implementation:**
```js
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/auth')) {
    event.respondWith(fetch(event.request));
  }
});
```

**Angular:**
```json
{
  "dataGroups": [
    {
      "name": "api-no-cache",
      "urls": [
        "https://api.example.com/auth/**",
        "https://api.example.com/payments/**"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 0,  // Don't cache
        "maxAge": "0u",  // Expire immediately
        "timeout": "10s"
      }
    }
  ]
}
```

### 4.6. Strategy Comparison Table

| Strategy | Speed | Freshness | Offline | Network | Cache | Best For |
|----------|-------|-----------|---------|---------|-------|----------|
| Cache First | ⚡⚡⚡ | ⭐ | ✅ | ⬇️ Low | ⬆️ High | Static assets |
| Network First | ⚡ | ⭐⭐⭐ | ⚠️ | ⬆️ High | ⬇️ Low | API data |
| Stale-While-Revalidate | ⚡⚡⚡ | ⭐⭐ | ✅ | ⬆️ Moderate | ⬆️ Moderate | Social feeds |
| Cache Only | ⚡⚡⚡ | ⭐ | ✅ | ⬇️ None | ⬆️ Full | Offline apps |
| Network Only | ⚡ | ⭐⭐⭐ | ❌ | ⬆️ Full | ⬇️ None | Auth/Payments |

### 4.7. Hybrid Strategies

**Time-based caching:**
```js
function shouldRevalidate(cachedResponse) {
  const cachedTime = new Date(cachedResponse.headers.get('date'));
  const now = new Date();
  const age = (now - cachedTime) / 1000; // seconds
  
  return age > 3600; // Revalidate if older than 1 hour
}

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse && !shouldRevalidate(cachedResponse)) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(networkResponse => {
            const cache = await caches.open('hybrid-cache');
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => cachedResponse); // Fallback to stale cache
      })
  );
});
```

**Request-type based routing:**
```js
self.addEventListener('fetch', event => {
  const { destination, method, url } = event.request;
  
  // Route based on request type
  if (destination === 'image') {
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
  } else if (destination === 'document') {
    event.respondWith(staleWhileRevalidate(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});
```

## 5. Caching in Angular: Asset Groups & Data Groups
Angular's `ngsw-config.json` uses two main sections:
- **assetGroups**: For static files (JS, CSS, images)
- **dataGroups**: For dynamic data (API calls)

**Example:**
```json
{
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/*.css", "/*.js"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-data",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "10s"
      }
    }
  ]
}
```

## 6. Implementing Caching Strategies in ngsw-config.json
- **installMode**: `prefetch` (cache at install), `lazy` (cache on demand)
- **updateMode**: `prefetch` (update all), `lazy` (update when requested)
- **strategy** (dataGroups): `performance` (cache-first), `freshness` (network-first)

**Project Example:**
```json
{
  "assetGroups": [
    {
      "name": "assets",
      "installMode": "prefetch",
      "resources": {
        "files": ["/assets/**", "/*.css", "/*.js"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api",
      "urls": ["https://api.example.com/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 50,
        "maxAge": "6h",
        "timeout": "5s"
      }
    }
  ]
}
```

## 7. Custom Caching with Service Worker (Advanced)
If you need more control, you can write a custom service worker or extend Angular's default. This is rare, but possible for advanced use cases (e.g., background sync, custom cache logic).

**Example (vanilla SW):**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

## 8. Debugging and Testing Caching
- Use Chrome DevTools > Application > Cache Storage
- Inspect `ngsw:xxx` caches
- Test offline mode (DevTools > Network > Offline)
- Use Angular's `ngsw-config.json` debug options

## 9. Best Practices
- Cache only what you need
- Set reasonable `maxAge` and `maxSize`
- Use `networkFirst` for dynamic data, `cacheFirst` for static assets
- Regularly test updates and cache invalidation
- Avoid caching sensitive data

## 10. Further Reading
- [Angular Service Worker Caching](https://angular.io/guide/service-worker-config)
- [Google: Caching Strategies](https://web.dev/offline-cookbook/)
- [MDN: Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

---

**Next:**
- 10: Advanced Service Worker Patterns (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
