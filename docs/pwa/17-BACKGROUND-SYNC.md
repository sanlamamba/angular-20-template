# 17 - Background Sync in Angular PWA

---

## Table of Contents
1. What is Background Sync?
2. Why Use Background Sync?
3. How Background Sync Works
4. Browser Support and Limitations
5. Implementing Background Sync in Angular
6. Using Workbox for Background Sync
7. Queuing Requests While Offline
8. Syncing Data When Online
9. Debugging and Testing Background Sync
10. Best Practices
11. Further Reading

---

## 1. What is Background Sync?
Background Sync lets your PWA defer actions (like sending data) until the user has connectivity, improving reliability for users with unstable networks.

## 2. Why Use Background Sync?
- Ensures important actions (e.g., form submissions) are not lost
- Improves user experience in poor connectivity
- Enables true offline-first workflows

## 3. How Background Sync Works
- User performs an action while offline
- App queues the action (e.g., in IndexedDB)
- When connectivity returns, the service worker is triggered to process the queue

## 4. Browser Support and Limitations
- Supported in Chrome, Edge, Opera (not in Safari or Firefox as of 2025)
- Requires HTTPS
- Not available in Angular's default service worker (use Workbox or custom SW)

## 5. Implementing Background Sync in Angular
- Use Workbox or write a custom service worker
- Queue requests in IndexedDB/localStorage
- Register a sync event in the SW

## 6. Using Workbox for Background Sync
**Install Workbox background sync plugin:**
```sh
npm install workbox-background-sync
```
**Example (workbox-sw.js):**
```js
import { Queue } from 'workbox-background-sync';

const queue = new Queue('post-queue');

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return queue.pushRequest({request: event.request});
      })
    );
  }
});
```

## 7. Queuing Requests While Offline
- Store failed requests in IndexedDB or use Workbox's queue
- Provide UI feedback to users about queued actions

## 8. Syncing Data When Online
- Service worker processes the queue when online
- Use `sync` event or Workbox's automatic retry

## 9. Debugging and Testing Background Sync
- Use DevTools > Application > Service Workers > Sync
- Simulate offline/online transitions
- Inspect IndexedDB for queued requests

## 10. Best Practices
- Only queue critical actions
- Inform users about sync status
- Handle errors and retries gracefully
- Clean up old/failed requests

## 11. Further Reading
- [Workbox Background Sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync/)
- [MDN: Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API)
- [Google: Reliable Background Sync](https://web.dev/background-sync/)

---

**Next:**
- 18: IndexedDB & Client-Side Storage (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
