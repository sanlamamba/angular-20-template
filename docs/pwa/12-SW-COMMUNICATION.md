# 12 - Service Worker Communication in Angular PWA

---

## Table of Contents
1. Introduction
2. Why Communicate with the Service Worker?
3. Communication Channels
4. App to Service Worker: postMessage
5. Service Worker to App: postMessage
6. Using Angular's SwUpdate and SwPush
7. Example: Update Notification Flow
8. Security Considerations
9. Debugging Communication
10. Further Reading

---

## 1. Introduction
Service workers run in a separate thread from your app. Communication is essential for update notifications, background sync, push, and custom logic.

## 2. Why Communicate with the Service Worker?
- Notify app of updates
- Trigger cache refresh or skip waiting
- Receive push messages
- Custom background tasks

## 3. Communication Channels
- `postMessage` API (bi-directional)
- Angular's `SwUpdate` and `SwPush` services

## 4. App to Service Worker: postMessage
Send messages from your app to the service worker.

**Example:**
```typescript
if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
}
```

## 5. Service Worker to App: postMessage
Send messages from the service worker to all clients (browser tabs).

**Example (in SW):**
```js
self.clients.matchAll().then(clients => {
  clients.forEach(client => client.postMessage({ type: 'UPDATED' }));
});
```
**App side:**
```typescript
navigator.serviceWorker.addEventListener('message', event => {
  if (event.data.type === 'UPDATED') {
    // Handle update
  }
});
```

## 6. Using Angular's SwUpdate and SwPush
- `SwUpdate`: Listen for version updates, activate new versions
- `SwPush`: Subscribe to push notifications, handle messages

**Example:**
```typescript
import { SwUpdate } from '@angular/service-worker';

constructor(private swUpdate: SwUpdate) {
  swUpdate.versionUpdates.subscribe(evt => {
    if (evt.type === 'VERSION_READY') {
      // Prompt user to update
    }
  });
}
```

## 7. Example: Update Notification Flow
1. New version detected by SW
2. SW sends message to app
3. App shows update prompt
4. User accepts, app calls `SwUpdate.activateUpdate()`
5. App reloads with new version

## 8. Security Considerations
- Validate all messages
- Never trust data from SW blindly
- Avoid exposing sensitive data via messages

## 9. Debugging Communication
- Use `console.log` in both app and SW
- Monitor messages in DevTools > Application > Service Workers
- Test with multiple tabs/windows

## 10. Further Reading
- [Angular Service Worker Communications](https://angular.io/guide/service-worker-communications)
- [MDN: postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage)

---

**Next:**
- 13: Workbox Integration (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
