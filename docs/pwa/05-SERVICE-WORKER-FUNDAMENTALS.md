# 05 - Service Worker Fundamentals: Concepts, Anatomy, and Angular Integration

---

## Table of Contents
1. What is a Service Worker?
2. Service Worker Anatomy
3. Service Worker Lifecycle (High-Level)
4. Service Worker vs Web Worker
5. Why Service Workers Matter for PWAs
6. Service Worker Registration in Angular
7. Service Worker File Structure in Angular Projects
8. Security Considerations
9. Debugging and DevTools
10. Further Reading

---

## 1. What is a Service Worker?
A **Service Worker** is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction. Key features:
- Acts as a network proxy between your app and the internet
- Enables offline experiences, background sync, push notifications
- Runs on HTTPS only (except localhost for development)
- Event-driven: responds to install, activate, fetch, message, sync, push, etc.

## 2. Service Worker Anatomy
A typical service worker script includes:
- **Install event**: Caches static assets
- **Activate event**: Cleans up old caches
- **Fetch event**: Intercepts network requests
- **Message event**: Communicates with the main thread
- **Push event**: Handles push notifications
- **Sync event**: Handles background sync
- **PeriodicSync event**: Handles periodic background tasks

**Detailed Example (vanilla JS):**
```js
// Service Worker Lifecycle Events
const CACHE_VERSION = 'v1';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/assets/logo.png'
];

// Install Event - Happens when SW is first installed
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate Event - Happens after install, cleans up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch Event - Intercepts all network requests
self.addEventListener('fetch', event => {
  console.log('[SW] Fetching:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(networkResponse => {
            // Optionally cache new responses
            if (event.request.method === 'GET') {
              return caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('[SW] Fetch failed:', error);
            // Return fallback page
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Message Event - Communication from app to SW
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Push Event - Handle push notifications
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event.data.text());
  
  const options = {
    body: event.data.text(),
    icon: '/assets/icon-192x192.png',
    badge: '/assets/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'View', icon: '/assets/checkmark.png' },
      { action: 'close', title: 'Close', icon: '/assets/xmark.png' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('App Notification', options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync Event - Handle background sync
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncDataToServer());
  }
});

// Helper function for background sync
async function syncDataToServer() {
  // Get pending data from IndexedDB
  const db = await openDatabase();
  const pendingData = await db.getAll('pending-sync');
  
  for (const item of pendingData) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: { 'Content-Type': 'application/json' }
      });
      await db.delete('pending-sync', item.id);
    } catch (error) {
      console.error('[SW] Sync failed for item:', item, error);
    }
  }
}
```

**Angular Service Worker (ngsw-worker.js):**
In Angular, you rarely write your own service worker. Instead, Angular generates `ngsw-worker.js` based on your `ngsw-config.json`. However, you can extend it with custom logic:

```typescript
// custom-sw.js (advanced use case)
importScripts('./ngsw-worker.js'); // Import Angular's SW

// Add custom logic
self.addEventListener('fetch', event => {
  // Custom fetch logic before/after Angular's SW
  console.log('Custom SW intercepting:', event.request.url);
});
```

## 3. Service Worker Lifecycle (High-Level)
- **Register**: Browser detects and installs the SW
- **Install**: SW downloads and caches assets
- **Activate**: SW takes control, cleans up
- **Idle/Run**: Handles fetch, push, sync events
- **Update**: New SW detected, waits to activate

## 4. Service Worker vs Web Worker
| Feature            | Service Worker         | Web Worker           |
|--------------------|-----------------------|----------------------|
| Runs in background | Yes                   | Yes                  |
| Network proxy      | Yes                   | No                   |
| Push/Sync support  | Yes                   | No                   |
| Access DOM         | No                    | No                   |
| Use case           | Offline, push, cache  | Heavy computation    |

## 5. Why Service Workers Matter for PWAs
- **Offline support**: Cache assets/data for offline use
- **Performance**: Serve assets from cache, reduce latency
- **Push notifications**: Re-engage users
- **Background sync**: Sync data when back online
- **Security**: Only works on HTTPS

## 6. Service Worker Registration in Angular
Angular abstracts SW registration via the `@angular/service-worker` package. You rarely write your own SW file; instead, Angular generates and manages it for you.

**Key files:**
- `ngsw-worker.js`: The actual SW script (auto-generated)
- `ngsw-config.json`: Your config for caching, data groups, etc.
- `ngsw.json`: Generated manifest of all cached resources

### 6.1. Automatic Registration (Recommended)

**In your app.config.ts:**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
```

**Registration Strategies:**
- `registerWhenStable:30000`: Register when app stabilizes or after 30s (recommended)
- `registerImmediately`: Register immediately (may impact initial load)
- `registerWithDelay:5000`: Register after 5 seconds

### 6.2. Manual Registration with Full Control

```typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    if ('serviceWorker' in navigator && environment.production) {
      navigator.serviceWorker
        .register('/ngsw-worker.js', {
          scope: '/',
          updateViaCache: 'none' // Always check for updates
        })
        .then(registration => {
          console.log('✅ Service Worker registered:', registration);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 New Service Worker installing...');
            
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('✨ New version available! Please refresh.');
                // Show update notification to user
              }
            });
          });
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  })
  .catch(err => console.error(err));
```

### 6.3. Using SwUpdate Service (Angular Way)

Create a dedicated service for managing SW updates:

```typescript
// src/app/core/services/sw-update.service.ts
import { Injectable, ApplicationRef, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first, concat, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  updateAvailable = signal(false);
  currentVersion = signal<string | null>(null);
  latestVersion = signal<string | null>(null);

  constructor(
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef
  ) {
    this.init();
  }

  private init() {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker updates are not enabled');
      return;
    }

    // Check for updates when app stabilizes and then every 6 hours
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? '🔄 Update found' : '✅ App is up to date');
      } catch (error) {
        console.error('❌ Failed to check for updates:', error);
      }
    });

    // Listen for version updates
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(event => {
        console.log('Current version:', event.currentVersion);
        console.log('Available version:', event.latestVersion);
        
        this.currentVersion.set(event.currentVersion.hash);
        this.latestVersion.set(event.latestVersion.hash);
        this.updateAvailable.set(true);
      });

    // Handle unrecoverable state
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('Unrecoverable SW state:', event.reason);
      alert(
        'An error occurred that we cannot recover from:\n' +
        event.reason +
        '\n\nPlease reload the page.'
      );
    });
  }

  async activateUpdate(): Promise<void> {
    if (!this.updateAvailable()) return;

    try {
      await this.swUpdate.activateUpdate();
      this.updateAvailable.set(false);
      document.location.reload();
    } catch (error) {
      console.error('❌ Failed to activate update:', error);
    }
  }

  async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) return false;
    
    try {
      return await this.swUpdate.checkForUpdate();
    } catch (error) {
      console.error('❌ Update check failed:', error);
      return false;
    }
  }
}
```

### 6.4. Update Notification Component

```typescript
// src/app/shared/components/update-notification.ts
import { Component, inject } from '@angular/core';
import { SwUpdateService } from '@core/services/sw-update.service';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  template: `
    @if (swUpdate.updateAvailable()) {
      <div class="fixed bottom-4 right-4 bg-primary-500 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <h3 class="font-semibold mb-1">Update Available!</h3>
            <p class="text-sm text-white/90 mb-3">
              A new version of the app is ready. Click to update now.
            </p>
            <div class="flex gap-2">
              <button 
                (click)="swUpdate.activateUpdate()" 
                class="px-4 py-2 bg-white text-primary-600 rounded hover:bg-gray-100 font-medium text-sm">
                Update Now
              </button>
              <button 
                (click)="swUpdate.updateAvailable.set(false)" 
                class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm">
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class UpdateNotificationComponent {
  swUpdate = inject(SwUpdateService);
}
```

### 6.5. Testing Service Worker Locally

```bash
# 1. Build production version (SW only works in prod)
ng build --configuration production

# 2. Serve with http-server (install if needed)
npm install -g http-server
http-server ./dist/your-app-name -p 8080 -c-1

# 3. Open browser at http://localhost:8080

# 4. Check DevTools > Application > Service Workers
```

### 6.6. Unregistering Service Worker

Sometimes you need to unregister (for testing or cleanup):

```typescript
// Programmatically unregister
async function unregisterServiceWorker() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
    console.log('Service Worker unregistered');
  }
  
  // Clear all caches
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('All caches cleared');
  
  // Reload page
  window.location.reload();
}
```

**Via Angular CLI (in ngsw-config.json):**
```json
{
  "index": "/index.html",
  "assetGroups": [],
  "dataGroups": []
}
```
Empty config will prevent SW from caching anything.

## 7. Service Worker File Structure in Angular Projects
```
angular.json
src/
  ngsw-config.json   <-- SW config
  main.ts           <-- Bootstraps app
  ...
dist/
  ngsw-worker.js    <-- Generated at build
  ngsw.json         <-- Generated config
```

## 8. Security Considerations

Service Workers have immense power—they can intercept all network requests, cache data, and run in the background. This makes security critical.

### 8.1. HTTPS Requirement
- **Service Workers ONLY work on HTTPS** (except `localhost` for development)
- This prevents man-in-the-middle attacks
- Ensures data integrity between your app and the SW

**Why HTTPS matters:**
```
Without HTTPS:
User → [Attacker] → Server
         ↓
    Modify SW script
    Inject malicious code
    Steal credentials

With HTTPS:
User → [Encrypted] → Server
         ✓ 
    Verified, secure connection
```

### 8.2. Never Cache Sensitive Data

**❌ DON'T cache:**
- Authentication tokens (JWT, OAuth tokens)
- User credentials or passwords
- Payment information
- Private API responses containing PII
- Session data

**✅ DO cache:**
- Public assets (images, fonts, icons)
- Static HTML/CSS/JS bundles
- Public API responses
- Offline fallback pages

**Example ngsw-config.json:**
```json
{
  "dataGroups": [
    {
      "name": "public-api",
      "urls": [
        "https://api.example.com/public/**"
      ],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1h",
        "strategy": "performance"
      }
    },
    {
      "name": "auth-api",
      "urls": [
        "https://api.example.com/auth/**",
        "https://api.example.com/user/**"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxAge": "0u",  // Never cache
        "timeout": "5s"
      }
    }
  ]
}
```

### 8.3. Validate and Sanitize Messages

When using `postMessage` to communicate with SW:

```typescript
// ❌ INSECURE: No validation
self.addEventListener('message', event => {
  eval(event.data.code); // NEVER DO THIS!
});

// ✅ SECURE: Validate message type and origin
self.addEventListener('message', event => {
  // Check origin
  if (event.origin !== 'https://yourdomain.com') {
    console.warn('Message from unauthorized origin:', event.origin);
    return;
  }

  // Validate message structure
  if (!event.data || typeof event.data.type !== 'string') {
    console.warn('Invalid message format');
    return;
  }

  // Handle only known message types
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CLEAR_CACHE':
      clearSpecificCache(event.data.cacheName);
      break;
    default:
      console.warn('Unknown message type:', event.data.type);
  }
});
```

### 8.4. Scope and Registration Security

```typescript
// ❌ Too broad scope
navigator.serviceWorker.register('/sw.js', { 
  scope: '/' // Controls entire domain
});

// ✅ Specific scope
navigator.serviceWorker.register('/sw.js', { 
  scope: '/app/' // Only controls /app/* routes
});

// ✅ Prevent cache poisoning
navigator.serviceWorker.register('/sw.js', { 
  scope: '/app/',
  updateViaCache: 'none' // Always fetch SW from network
});
```

### 8.5. Content Security Policy (CSP)

Add CSP headers to prevent XSS attacks:

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://api.example.com;
        worker-src 'self';
      ">
```

### 8.6. Regular Updates and Audits

```typescript
// Implement version checking
const SW_VERSION = '1.0.5';
const MIN_REQUIRED_VERSION = '1.0.0';

self.addEventListener('install', event => {
  console.log(`Installing SW version ${SW_VERSION}`);
  
  // Check if this version is newer than minimum required
  if (compareVersions(SW_VERSION, MIN_REQUIRED_VERSION) < 0) {
    throw new Error('SW version too old');
  }
});

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}
```

### 8.7. Secure Data Storage

If you must store data client-side:

```typescript
// Use IndexedDB with encryption for sensitive data
import { AES, enc } from 'crypto-js';

class SecureStorage {
  private encryptionKey: string;

  constructor(key: string) {
    this.encryptionKey = key;
  }

  encrypt(data: any): string {
    return AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
  }

  decrypt(ciphertext: string): any {
    const bytes = AES.decrypt(ciphertext, this.encryptionKey);
    return JSON.parse(bytes.toString(enc.Utf8));
  }

  async saveSecure(key: string, data: any): Promise<void> {
    const encrypted = this.encrypt(data);
    // Save to IndexedDB
    await this.saveToIndexedDB(key, encrypted);
  }

  async getSecure(key: string): Promise<any> {
    const encrypted = await this.getFromIndexedDB(key);
    return encrypted ? this.decrypt(encrypted) : null;
  }

  // IndexedDB helpers...
  private async saveToIndexedDB(key: string, value: string): Promise<void> {
    // Implementation
  }

  private async getFromIndexedDB(key: string): Promise<string | null> {
    // Implementation
  }
}
```

### 8.8. Security Checklist

- [ ] **HTTPS only**: Ensure your site runs on HTTPS in production
- [ ] **Scope validation**: Use minimal necessary scope for SW
- [ ] **No sensitive caching**: Never cache tokens, passwords, or PII
- [ ] **Message validation**: Validate all postMessage communications
- [ ] **CSP headers**: Implement Content Security Policy
- [ ] **Regular updates**: Keep Angular and dependencies up to date
- [ ] **Audit tools**: Use `npm audit`, Snyk, or similar tools
- [ ] **Error logging**: Monitor SW errors in production
- [ ] **Access control**: Implement proper authentication/authorization
- [ ] **Rate limiting**: Protect against abuse of SW features

## 9. Debugging and DevTools

Debugging Service Workers requires specialized tools and techniques.

### 9.1. Chrome DevTools Service Worker Panel

**Access:** DevTools → Application tab → Service Workers

**Features:**
- **Status**: See if SW is activated, waiting, or installing
- **Update**: Force check for updates
- **Unregister**: Remove SW registration
- **Stop**: Terminate SW (for testing)
- **Bypass for network**: Disable SW temporarily
- **Update on reload**: Auto-update SW on page reload

```
Actions:
┌─────────────────────────────────────┐
│ ☐ Offline                           │  Simulate offline mode
│ ☐ Update on reload                  │  Auto-update SW
│ ☐ Bypass for network                │  Disable SW
│                                     │
│ ngsw-worker.js                      │
│ Status: activated and is running    │
│ Source: /ngsw-worker.js             │
│ Received: 2025-10-15 14:30:22      │
│                                     │
│ [skipWaiting] [Unregister] [Update]│
└─────────────────────────────────────┘
```

### 9.2. Inspecting Cache Storage

**Access:** DevTools → Application tab → Cache Storage

```typescript
// Programmatically inspect caches
async function inspectCaches() {
  const cacheNames = await caches.keys();
  console.log('📦 Available caches:', cacheNames);
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    console.log(`\n🗄️ Cache: ${cacheName}`);
    console.log(`   Items: ${requests.length}`);
    
    for (const request of requests.slice(0, 5)) { // Show first 5
      console.log(`   - ${request.url}`);
    }
  }
}

// Calculate total cache size
async function getCacheSize() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    
    console.log(`💾 Storage used: ${(usage / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Storage quota: ${(quota / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Usage: ${((usage / quota) * 100).toFixed(2)}%`);
  }
}
```

### 9.3. Network Panel Debugging

**Access:** DevTools → Network tab

Look for:
- **Size column**: "(ServiceWorker)" or "(from ServiceWorker)" = served from cache
- **Timing**: Faster responses = likely cached
- **Failed requests**: Check if SW is handling offline properly

```
Name              Status  Type       Size            Time
index.html        200     document   (ServiceWorker) 12ms  ✅ From SW
styles.css        200     stylesheet (ServiceWorker) 8ms   ✅ From SW
api/users         200     xhr        1.2 KB          45ms  🌐 From network
offline-page.html 200     document   (ServiceWorker) 5ms   ✅ Offline fallback
```

### 9.4. Console Logging in Service Worker

```typescript
// Detailed logging for debugging
const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[SW Debug]', new Date().toISOString(), ...args);
  }
}

self.addEventListener('install', event => {
  log('🔧 Install event triggered');
  log('   Cache version:', CACHE_VERSION);
  log('   Assets to cache:', ASSETS_TO_CACHE.length);
});

self.addEventListener('fetch', event => {
  log('🌐 Fetch:', event.request.method, event.request.url);
  log('   Mode:', event.request.mode);
  log('   Destination:', event.request.destination);
});

// Performance timing
self.addEventListener('fetch', event => {
  const start = performance.now();
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        const duration = performance.now() - start;
        log(`⚡ Response time: ${duration.toFixed(2)}ms`);
        log(`   Source: ${response ? 'cache' : 'network'}`);
        return response || fetch(event.request);
      })
  );
});
```

### 9.5. Angular-Specific Debugging

```typescript
// Create a debug service
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class SwDebugService {
  constructor(private swUpdate: SwUpdate) {
    this.enableDebugMode();
  }

  private enableDebugMode() {
    if (!this.swUpdate.isEnabled) {
      console.warn('⚠️ Service Worker is not enabled');
      return;
    }

    // Log all version events
    this.swUpdate.versionUpdates.subscribe(event => {
      console.log('🔄 SW Version Event:', event.type);
      
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log('   New version detected');
          break;
        case 'VERSION_READY':
          console.log('   New version ready');
          console.log('   Current:', event.currentVersion);
          console.log('   Latest:', event.latestVersion);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.error('   Installation failed');
          break;
        case 'NO_NEW_VERSION_DETECTED':
          console.log('   No new version');
          break;
      }
    });

    // Log unrecoverable states
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('❌ Unrecoverable SW state:', event.reason);
    });
  }

  async checkServiceWorkerStatus(): Promise<void> {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      console.log('❌ No Service Worker registered');
      return;
    }

    console.log('✅ Service Worker Status:');
    console.log('   Scope:', registration.scope);
    console.log('   Active:', !!registration.active);
    console.log('   Installing:', !!registration.installing);
    console.log('   Waiting:', !!registration.waiting);
    
    if (registration.active) {
      console.log('   Script URL:', registration.active.scriptURL);
      console.log('   State:', registration.active.state);
    }
  }

  async getCacheInfo(): Promise<void> {
    const cacheNames = await caches.keys();
    console.log('📦 Cache Information:');
    console.log('   Total caches:', cacheNames.length);
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      console.log(`   - ${name}: ${keys.length} items`);
    }
  }
}
```

### 9.6. Testing Service Worker Updates

```typescript
// Test update flow
async function testUpdateFlow() {
  console.log('🧪 Testing SW update flow...');
  
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    console.error('No SW registered');
    return;
  }

  // 1. Check current version
  console.log('1️⃣ Current SW:', registration.active?.scriptURL);

  // 2. Trigger update check
  console.log('2️⃣ Checking for updates...');
  await registration.update();

  // 3. Wait for new SW
  if (registration.waiting) {
    console.log('3️⃣ New SW is waiting');
    console.log('   Sending SKIP_WAITING message...');
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    console.log('3️⃣ No new SW found');
  }

  // 4. Monitor state changes
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    console.log('4️⃣ New SW detected:', newWorker?.scriptURL);
    
    newWorker?.addEventListener('statechange', () => {
      console.log('   State:', newWorker.state);
    });
  });
}
```

### 9.7. Common Debugging Scenarios

**Scenario 1: SW not updating**
```bash
# Check these:
1. Open DevTools → Application → Service Workers
2. Check "Update on reload" checkbox
3. Hard refresh (Ctrl+Shift+R)
4. Check if updateViaCache is set to 'none'
5. Verify file hash changed in ngsw.json
```

**Scenario 2: Resources not caching**
```bash
# Debug steps:
1. Check ngsw-config.json patterns
2. Inspect Cache Storage in DevTools
3. Look for fetch errors in Console
4. Verify HTTPS (SW won't cache on HTTP)
5. Check file paths are correct
```

**Scenario 3: Offline mode not working**
```bash
# Troubleshooting:
1. Enable offline mode in DevTools
2. Check navigation fallback in ngsw-config.json
3. Verify index.html is cached
4. Check SW fetch handler logs
5. Look for navigation requests in Network tab
```

### 9.8. Debugging Tools and Extensions

**Chrome Extensions:**
- **Lighthouse**: Audit PWA quality
- **Web Vitals**: Monitor performance metrics
- **Application**: Built-in DevTools panel

**CLI Tools:**
```bash
# Analyze bundle and SW config
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Check PWA score
npx lighthouse https://your-app.com --view

# Verify SW configuration
cat dist/your-app/ngsw.json | jq '.'
```

### 9.9. Production Debugging

```typescript
// Safe production logging
class ProductionLogger {
  private logs: string[] = [];
  private maxLogs = 100;

  log(message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message} ${JSON.stringify(args)}`;
    
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to analytics in production
    if (this.isProduction()) {
      this.sendToAnalytics(logEntry);
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  private isProduction(): boolean {
    return location.hostname !== 'localhost';
  }

  private sendToAnalytics(log: string) {
    // Send to your analytics service
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ log }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      // Silently fail in production
    });
  }
}
```

## 10. Further Reading
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Angular Service Worker Guide](https://angular.io/guide/service-worker-intro)
- [Google: Service Worker Cookbook](https://serviceworke.rs/)

---

**Next:**
- 06: Service Worker Lifecycle (already created)
- 07: Service Worker Registration (already created)
- 08: ngsw-config Deep Dive (already created)
- 09: Caching Strategies (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
