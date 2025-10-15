# 14 - Offline Experience Patterns in Angular PWA

---

## Table of Contents
1. Introduction
2. Why Offline Matters
3. Types of Offline Experiences
4. Detecting Offline State in Angular
5. Designing Offline-First UI/UX
6. Handling User Actions While Offline
7. Syncing Data When Back Online
8. Custom Offline Pages and Fallbacks
9. Testing Offline Scenarios
10. Best Practices
11. Further Reading

---

## 1. Introduction
A great PWA provides a seamless experience even when the user is offline or has a poor connection. This doc covers how to design, implement, and test robust offline experiences in your Angular 20 app.

## 2. Why Offline Matters
- Users expect apps to "just work" regardless of connectivity
- Enables productivity in low-signal or no-signal environments
- Reduces frustration and increases engagement

## 3. Types of Offline Experiences
- **Read-only**: User can view cached content
- **Read-write with sync**: User can create/edit data, which syncs when online
- **Custom offline UI**: Show friendly messages, illustrations, or fallback pages

## 4. Detecting Offline State in Angular
Use the browser's `navigator.onLine` property and listen for `online`/`offline` events.

**Example:**
```typescript
import { Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  online = signal(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.online.set(true));
    window.addEventListener('offline', () => this.online.set(false));
  }
}
```

## 5. Designing Offline-First UI/UX
- Show clear indicators when offline (e.g., banners, icons)
- Disable or queue actions that require connectivity
- Provide feedback for failed/successful syncs
- Use optimistic UI updates for queued actions

## 6. Handling User Actions While Offline
- Queue API requests in IndexedDB or localStorage
- Use background sync (Workbox or custom SW) to send data when online
- Inform users about queued actions and sync status

## 7. Syncing Data When Back Online
- Listen for the `online` event to trigger sync
- Use Angular services to replay queued actions
- Handle conflicts and errors gracefully

**Example:**
```typescript
window.addEventListener('online', () => {
  // Call a service to sync queued actions
});
```

## 8. Custom Offline Pages and Fallbacks
- Configure `ngsw-config.json` to serve a custom offline page
- Example:
```json
{
  "navigationUrls": [
    { "positive": true, "regex": "/.*" }
  ],
  "assetGroups": [
    {
      "name": "offline-page",
      "installMode": "prefetch",
      "resources": {
        "files": ["/offline.html"]
      }
    }
  ]
}
```
- In your SW, serve `offline.html` for navigation requests when offline

## 9. Testing Offline Scenarios
- Use DevTools > Network > Offline
- Test all critical user flows (navigation, forms, sync)
- Simulate slow/unstable networks

## 10. Best Practices
- Cache only what is needed for offline
- Provide clear, actionable offline messages
- Regularly test and update offline flows
- Avoid data loss: always queue and sync user actions

## 11. Further Reading
- [Angular PWA Guide: Offline](https://angular.io/guide/service-worker-intro#offline-capabilities)
- [Google: Offline UX Patterns](https://web.dev/offline-fallback-page/)
- [MDN: Offline Events](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events)

---

**Next:**
- 15: Manifest & Installation Patterns (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
