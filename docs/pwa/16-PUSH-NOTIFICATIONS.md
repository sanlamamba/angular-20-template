# 16 - Push Notifications in Angular PWA

---

## Table of Contents
1. Introduction to Push Notifications
2. How Push Works in PWAs
3. Setting Up Push in Angular
4. VAPID Keys and Backend Setup
5. Subscribing to Push in Angular
6. Sending Push Messages from the Server
7. Handling Push Events in the Service Worker
8. Displaying Notifications to Users
9. Managing Permissions and Unsubscribing
10. Security and Privacy Considerations
11. Debugging Push Notifications
12. Best Practices
13. Further Reading

---

## 1. Introduction to Push Notifications
Push notifications allow your PWA to receive messages from a server even when the app is not open, increasing engagement and retention.

## 2. How Push Works in PWAs
- User grants permission for notifications
- App subscribes to push service (browser)
- Server sends push message to browser's push endpoint
- Service worker receives and displays notification

## 3. Setting Up Push in Angular
- Install `@angular/service-worker` (already present in your template)
- Use Angular's `SwPush` service for push subscription

## 4. VAPID Keys and Backend Setup
- Generate VAPID keys (public/private) for authentication
- Use a backend (Node.js, Firebase, etc.) to send push messages
- Store user subscriptions securely

**Generate VAPID keys (Node.js):**
```js
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log(vapidKeys);
```

## 5. Subscribing to Push in Angular
```typescript
import { SwPush } from '@angular/service-worker';

constructor(private swPush: SwPush) {}

subscribeToPush() {
  this.swPush.requestSubscription({
    serverPublicKey: 'YOUR_PUBLIC_VAPID_KEY'
  })
  .then(sub => {
    // Send sub to your backend
  })
  .catch(err => console.error('Could not subscribe', err));
}
```

## 6. Sending Push Messages from the Server
- Use libraries like `web-push` (Node.js) to send messages
- Example:
```js
webpush.sendNotification(subscription, JSON.stringify({
  title: 'Hello!',
  body: 'You have a new message.'
}), options);
```

## 7. Handling Push Events in the Service Worker
- Angular's SW handles push events and displays notifications
- For custom logic, extend the SW or use Workbox

## 8. Displaying Notifications to Users
- Notifications are shown via the browser's native UI
- Customize title, body, icon, actions, etc.

## 9. Managing Permissions and Unsubscribing
- Check permission status with `Notification.permission`
- Unsubscribe using `SwPush.unsubscribe()`

## 10. Security and Privacy Considerations
- Always ask for permission in context (not on page load)
- Never send sensitive data in push payloads
- Allow users to opt out easily

## 11. Debugging Push Notifications
- Use DevTools > Application > Service Workers > Push
- Test with test push messages
- Check for errors in the console

## 12. Best Practices
- Send relevant, timely notifications
- Avoid spamming users
- Respect user preferences and privacy
- Provide clear opt-in/out flows

## 13. Further Reading
- [Angular Push Notifications](https://angular.io/guide/service-worker-communications#push-notifications)
- [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Google: Web Push Notifications](https://web.dev/push-notifications/)

---

**Next:**
- 17: Background Sync (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
