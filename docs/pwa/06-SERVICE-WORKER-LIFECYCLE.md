# ⚙️ Service Worker Lifecycle - Deep Dive

**Estimated Time:** 30 minutes  
**Difficulty:** ⭐⭐⭐ Advanced  
**Prerequisites:** [04-INSTALLATION-SETUP.md](./04-INSTALLATION-SETUP.md)

---

## 🎯 What You'll Learn
- Service Worker lifecycle phases
- How Angular's Service Worker fits in
- Debugging lifecycle issues
- Handling updates and versioning
- Practical code for your Angular 20 template

---

## 🔄 Service Worker Lifecycle Phases

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Install    │  Activate   │  Idle       │  Terminate  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 1. **Install**
- Browser downloads new SW (ngsw-worker.js)
- Runs `install` event
- Pre-caches app shell/assets (from ngsw-config.json)
- If successful, moves to **activate**

### 2. **Activate**
- Runs `activate` event
- Cleans up old caches
- Claims control of all pages (if `clients.claim()` is called)
- Ready to intercept fetches

### 3. **Idle**
- SW sits in background, intercepts fetches, handles push, sync, etc.
- Can be terminated by browser to save memory
- Will restart on next event

### 4. **Terminate**
- Browser can kill SW at any time
- SW is stateless between activations (use IndexedDB for persistence)

---

## 🔁 Update Flow

1. **New build deployed** (ngsw-worker.js changes)
2. Browser downloads new SW in background
3. Runs `install` event (new SW)
4. Runs `activate` event (new SW)
5. **Old SW stays active** until all tabs closed or `skipWaiting()` called
6. New SW takes control (serves new content)

---

## 🛠️ Debugging Lifecycle in Angular

1. Open Chrome DevTools → Application → Service Workers
2. See status: "activated and is running" or "waiting to activate"
3. Use **Update** and **Skip Waiting** buttons to test
4. Use `SwUpdate` service in Angular to listen for updates

---

## 📝 Practical Example: Update Notification

You already have this in [04-INSTALLATION-SETUP.md](./04-INSTALLATION-SETUP.md):
- `SwUpdateService` (checks for updates)
- `UpdateNotificationComponent` (shows update banner)

**Force update in DevTools:**
- Click "Update" to download new SW
- Click "Skip Waiting" to activate immediately
- Refresh page to load new version

---

## 🧩 Custom Lifecycle Hooks (Advanced)

If you ever write a custom SW (not needed for Angular's default):
```js
self.addEventListener('install', event => {
  // Precache assets
  event.waitUntil(
    caches.open('my-cache').then(cache => cache.addAll(['/index.html', '/main.js']))
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== 'my-cache').map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Intercept network requests
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
```

---

## 📝 Key Takeaways
- Service Worker lifecycle is automatic in Angular
- Use DevTools to debug and test updates
- Use `SwUpdate` for update notifications
- Custom SW only needed for advanced use cases

---

**Next:** [07-SERVICE-WORKER-REGISTRATION.md](./07-SERVICE-WORKER-REGISTRATION.md)
