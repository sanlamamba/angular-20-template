# 10 - Advanced Service Worker Patterns in Angular PWA

---

## Table of Contents
1. Introduction
2. Background Sync
3. Push Notifications
4. Periodic Sync
5. Custom Routing and Navigation Fallback
6. Handling Updates and User Prompts
7. Communication Between App and Service Worker
8. Extending Angular's Service Worker
9. Security and Privacy Considerations
10. Further Reading

---

## 1. Introduction
Beyond basic caching, service workers enable advanced features that make your PWA more resilient, interactive, and user-friendly. This doc covers advanced patterns and how to implement them in Angular 20.

## 2. Background Sync
Allows your app to defer actions (like sending data) until the user has connectivity.

**Example (vanilla SW):**
```js
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(sendOutboxPosts());
  }
});
```
**Angular:**
- Angular's default SW does not support background sync out of the box.
- Use [Workbox](https://developer.chrome.com/docs/workbox/) or custom SW for this feature.

## 3. Push Notifications
Receive and display notifications even when the app is not open.

**Angular:**
- Use Angular's `SwPush` service for subscribing to push notifications.
- Requires a backend to send push messages.

**Example:**
```typescript
import { SwPush } from '@angular/service-worker';

constructor(private swPush: SwPush) {}

subscribeToNotifications() {
  this.swPush.requestSubscription({
    serverPublicKey: 'YOUR_VAPID_PUBLIC_KEY'
  })
  .then(sub => {/* send sub to backend */})
  .catch(err => console.error(err));
}
```

## 4. Periodic Sync
Lets your app update content in the background at regular intervals.
- Not yet widely supported.
- Use [Periodic Background Sync API](https://web.dev/periodic-background-sync/) for future-proofing.

## 5. Custom Routing and Navigation Fallback
Handle navigation requests when offline (e.g., serve `index.html` for SPA routes).

**ngsw-config.json:**
```json
{
  "navigationUrls": [
    { "positive": true, "regex": "/.*" },
    { "positive": false, "regex": "/api/.*" }
  ]
}
```

## 6. Handling Updates and User Prompts
Detect and prompt users when a new version is available.

**Angular Example:**
```typescript
import { SwUpdate } from '@angular/service-worker';

constructor(private swUpdate: SwUpdate) {
  swUpdate.versionUpdates.subscribe(evt => {
    if (evt.type === 'VERSION_READY') {
      // Show update prompt to user
    }
  });
}
```

## 7. Communication Between App and Service Worker
Use the `postMessage` API to send messages between your app and the SW.

**App to SW:**
```typescript
navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
```
**SW to App:**
```js
self.clients.matchAll().then(clients => {
  clients.forEach(client => client.postMessage({ type: 'UPDATED' }));
});
```

## 8. Extending Angular's Service Worker
- You can add a custom SW alongside Angular's, but this is advanced and requires careful integration.
- Use [ngsw-worker.js hacks](https://github.com/angular/angular/issues/27209) or eject to a custom SW for full control.

## 9. Security and Privacy Considerations
- Always validate messages and data
- Never cache sensitive data
- Respect user privacy for push and background sync

## 10. Further Reading
- [Angular Service Worker Advanced](https://angular.io/guide/service-worker-communications)
- [Workbox Advanced Recipes](https://developer.chrome.com/docs/workbox/)
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Next:**
- 11: Service Worker Debugging and DevTools (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
