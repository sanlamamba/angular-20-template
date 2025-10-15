# 19 - Cache Storage API in Angular PWA

---

## Table of Contents
1. What is the Cache Storage API?
2. Why Use Cache Storage in PWAs?
3. Cache Storage vs IndexedDB
4. Cache Storage API Concepts
5. Using Cache Storage in Service Workers
6. Example: Caching and Retrieving Requests
7. Integrating with Angular's Service Worker
8. Debugging Cache Storage
9. Cleaning Up Old Caches
10. Best Practices
11. Further Reading

---

## 1. What is the Cache Storage API?
The Cache Storage API provides a way for service workers and web apps to store network request/response pairs for offline use and performance optimization.

## 2. Why Use Cache Storage in PWAs?
- Serve assets and data offline
- Speed up repeat visits by serving from cache
- Control cache lifetimes and invalidation

## 3. Cache Storage vs IndexedDB
| Feature         | Cache Storage | IndexedDB   |
|-----------------|--------------|-------------|
| Stores          | Requests/Responses | Any JS object |
| Use case        | HTTP caching  | Structured data |
| API             | Promise-based | Event/Promise-based |
| Accessed by     | SW, window    | SW, window  |

## 4. Cache Storage API Concepts
- **Cache**: Named storage for request/response pairs
- **Cache.match()**: Find a response for a request
- **Cache.put()**: Store a request/response
- **Cache.delete()**: Remove a request/response
- **caches**: Global object for managing multiple caches

## 5. Using Cache Storage in Service Workers
**Example:**
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResponse => {
        return caches.open('my-cache').then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
```

## 6. Example: Caching and Retrieving Requests
- Cache static assets on install
- Serve from cache on fetch
- Update cache as needed

## 7. Integrating with Angular's Service Worker
- Angular's SW manages caches based on `ngsw-config.json`
- You can inspect and clear caches via DevTools
- For custom caching, extend the SW or use Workbox

## 8. Debugging Cache Storage
- DevTools > Application > Cache Storage
- Inspect, delete, or update cached entries
- Monitor cache usage and size

## 9. Cleaning Up Old Caches
- Remove outdated caches during SW activation
**Example:**
```js
self.addEventListener('activate', event => {
  const cacheWhitelist = ['my-cache'];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});
```

## 10. Best Practices
- Name caches with versioning (e.g., `my-cache-v1`)
- Limit cache size and clean up regularly
- Avoid caching sensitive data
- Test cache behavior in all browsers

## 11. Further Reading
- [MDN: Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Google: Offline Cookbook](https://web.dev/offline-cookbook/)
- [Angular Service Worker Caching](https://angular.io/guide/service-worker-config)

---

**Next:**
- 20: Security & Privacy in PWAs (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
