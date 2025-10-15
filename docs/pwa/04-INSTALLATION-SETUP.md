# 🚀 Installation & Setup - Get Started with PWA

**Estimated Time:** 20 minutes  
**Difficulty:** ⭐ Beginner  
**Prerequisites:** Your Angular 20 template

---

## 🎯 What You'll Do

In this guide, you'll:
- ✅ Install @angular/pwa package
- ✅ Generate PWA configuration files
- ✅ Understand what files were created
- ✅ Configure your first service worker
- ✅ Test PWA features locally
- ✅ Verify everything works

---

## 📦 Step 1: Install Angular PWA

Open your terminal in your project root and run:

```powershell
# Navigate to your project (if not already there)
cd .\angular-20-template

# Install Angular PWA
ng add @angular/pwa
```

### What This Command Does

```
┌─────────────────────────────────────────┐
│    ng add @angular/pwa will:            │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Install @angular/service-worker     │
│  ✅ Create manifest.webmanifest         │
│  ✅ Create ngsw-config.json             │
│  ✅ Generate PWA icons                  │
│  ✅ Update angular.json                 │
│  ✅ Update index.html (meta tags)       │
│  ✅ Update app.config.ts                │
│                                         │
└─────────────────────────────────────────┘
```

### Expected Output

```powershell
ℹ Using package manager: npm
✔ Found compatible package version: @angular/pwa@20.x.x
✔ Package information loaded
✔ Package successfully installed
CREATE ngsw-config.json (620 bytes)
CREATE src/manifest.webmanifest (1176 bytes)
CREATE src/assets/icons/icon-128x128.png (1253 bytes)
CREATE src/assets/icons/icon-144x144.png (1394 bytes)
CREATE src/assets/icons/icon-152x152.png (1427 bytes)
CREATE src/assets/icons/icon-192x192.png (1790 bytes)
CREATE src/assets/icons/icon-384x384.png (3557 bytes)
CREATE src/assets/icons/icon-512x512.png (5008 bytes)
CREATE src/assets/icons/icon-72x72.png (792 bytes)
CREATE src/assets/icons/icon-96x96.png (958 bytes)
UPDATE angular.json (5432 bytes)
UPDATE src/app/app.config.ts (1234 bytes)
UPDATE src/index.html (987 bytes)
```

---

## 📁 Step 2: Understand Generated Files

### 2.1 **ngsw-config.json** (Service Worker Configuration)

**Location:** `.\angular-20-template\ngsw-config.json`

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ]
}
```

**What this means:**
- `app` group: Critical files (HTML, CSS, JS) - **Downloaded immediately**
- `assets` group: Images, fonts - **Downloaded when needed**

### 2.2 **manifest.webmanifest** (App Manifest)

**Location:** `.\angular-20-template\src\manifest.webmanifest`

```json
{
  "name": "angular-20-template",
  "short_name": "Angular20",
  "theme_color": "#1976d2",
  "background_color": "#fafafa",
  "display": "standalone",
  "scope": "./",
  "start_url": "./",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

**What this means:**
- `name`: Full app name shown during install
- `short_name`: Name under icon (< 12 characters)
- `theme_color`: Browser toolbar color
- `display: standalone`: Hides browser UI (looks like native app)
- `icons`: All sizes needed for different devices

### 2.3 **src/index.html** (Updated)

**New lines added:**

```html
<head>
  <!-- Existing meta tags... -->
  
  <!-- PWA Meta Tags (NEW) -->
  <meta name="theme-color" content="#1976d2">
  <link rel="manifest" href="manifest.webmanifest">
  
  <!-- Existing links... -->
</head>
```

### 2.4 **src/app/app.config.ts** (Updated)

**New provider added:**

```typescript
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... your existing providers ...
    
    // PWA Service Worker (NEW)
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
```

**What this means:**
- Service Worker only enabled in **production mode**
- Registers after app is stable (prevents blocking startup)
- Waits 30 seconds before registering (optional delay)

### 2.5 **angular.json** (Updated)

**New configuration added:**

```json
{
  "projects": {
    "angular-20-template": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "serviceWorker": "ngsw-config.json"  // NEW
            }
          }
        }
      }
    }
  }
}
```

---

## ⚙️ Step 3: Customize Your PWA

### 3.1 Update Manifest for Your App

Open `src/manifest.webmanifest` and customize:

```json
{
  "name": "Angular 20 Enterprise Template",
  "short_name": "Angular20",
  "description": "Production-ready Angular 20 template with PWA support",
  "theme_color": "#6366f1",  // Your brand color (Tailwind indigo-500)
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "./",
  "start_url": "./",
  "categories": ["business", "productivity"],
  "orientation": "any",
  "icons": [
    // ... keep existing icons ...
  ],
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "Go to dashboard",
      "url": "/dashboard",
      "icons": [{ "src": "/assets/icons/icon-192x192.png", "sizes": "192x192" }]
    },
    {
      "name": "Profile",
      "short_name": "Profile",
      "description": "View your profile",
      "url": "/profile",
      "icons": [{ "src": "/assets/icons/icon-192x192.png", "sizes": "192x192" }]
    }
  ]
}
```

### 3.2 Update Service Worker Config

Open `ngsw-config.json` and enhance:

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-fresh",
      "urls": [
        "/api/auth/**",
        "/api/logout"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 0,
        "maxAge": "0u",
        "timeout": "5s"
      }
    },
    {
      "name": "api-performance",
      "urls": [
        "/api/dashboard/**",
        "/api/profile/**",
        "/api/users/**"
      ],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "5s"
      }
    }
  ]
}
```

**Explanation:**
- `assetGroups`: Static files (HTML, CSS, JS, images)
- `dataGroups`: API endpoints
  - `freshness`: Always try network first (auth endpoints)
  - `performance`: Cache first, network fallback (dashboard data)

### 3.3 Update Theme Color in index.html

Open `src/index.html` and update:

```html
<head>
  <!-- Update theme color to match your brand -->
  <meta name="theme-color" content="#6366f1" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: dark)">
  
  <!-- Add Apple-specific meta tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Angular20">
  <link rel="apple-touch-icon" href="assets/icons/icon-192x192.png">
</head>
```

---

## 🏗️ Step 4: Build and Test

### 4.1 Build Production Version

PWA only works in production mode. Build your app:

```powershell
# Build for production
npm run build

# This will create dist/ folder with Service Worker
```

**Expected output:**
```
✔ Browser application bundle generation complete.
✔ Server application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.
✔ Service worker generation complete.  # ← PWA generated!

Initial chunk files   | Names         | Raw size
main-ABC123.js        | main          | 123.45 kB
polyfills-DEF456.js   | polyfills     | 34.56 kB

Build at: 2025-10-15 - Hash: xyz789
```

### 4.2 Test Locally with HTTP Server

Service Workers require HTTPS (or localhost). Let's test:

```powershell
# Install http-server globally (if you don't have it)
npm install -g http-server

# Serve the production build
cd dist/angular-20-template/browser
http-server -p 8080 -c-1

# OR use npx (no global install needed)
npx http-server dist/angular-20-template/browser -p 8080 -c-1
```

**Open your browser:** http://localhost:8080

### 4.3 Verify Service Worker Registration

1. Open **Chrome DevTools** (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. You should see:
   ```
   ✅ ngsw-worker.js
   Status: activated and is running
   Source: http://localhost:8080/ngsw-worker.js
   ```

### 4.4 Verify Cache Storage

1. Still in **Application** tab
2. Click **Cache Storage** in left sidebar
3. You should see caches like:
   ```
   ngsw:/:db:control
   ngsw:/:<hash>:assets:app:cache
   ngsw:/:<hash>:assets:assets:cache
   ```

### 4.5 Test Offline Mode

1. In DevTools, go to **Network** tab
2. Check **Offline** checkbox (throttling dropdown)
3. Refresh the page (F5)
4. **Your app should still load!** 🎉

---

## 🧪 Step 5: Add Service Worker Update Detection

Let's add a service to detect when a new version is available.

Create: `src/app/core/services/sw-update.ts`

```typescript
import { ApplicationRef, Injectable, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first } from 'rxjs/operators';
import { concat, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private swUpdate = inject(SwUpdate);
  private appRef = inject(ApplicationRef);

  readonly updateAvailable = signal(false);
  readonly currentVersion = signal<string>('');
  readonly latestVersion = signal<string>('');

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.checkForUpdates();
      this.handleUpdates();
    }
  }

  private checkForUpdates(): void {
    // Check for updates every 6 hours
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        if (updateFound) {
          console.log('🔄 Update found, will download in background');
        }
      } catch (error) {
        console.error('❌ Failed to check for updates:', error);
      }
    });
  }

  private handleUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(evt => {
        console.log('✅ New version available:', evt.latestVersion);
        this.updateAvailable.set(true);
        this.currentVersion.set(JSON.stringify(evt.currentVersion));
        this.latestVersion.set(JSON.stringify(evt.latestVersion));
      });
  }

  async activateUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) return;

    try {
      await this.swUpdate.activateUpdate();
      console.log('✅ Update activated, reloading...');
      document.location.reload();
    } catch (error) {
      console.error('❌ Failed to activate update:', error);
    }
  }
}
```

### Add Update Notification Component

Create: `src/app/shared/components/update-notification.ts`

```typescript
import { Component, inject } from '@angular/core';
import { SwUpdateService } from '@core/services/sw-update';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [ButtonModule],
  template: `
    @if (swUpdate.updateAvailable()) {
      <div class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
        <p class="font-semibold mb-2">🎉 Update Available!</p>
        <p class="text-sm mb-3">A new version of the app is ready.</p>
        <button 
          pButton 
          label="Update Now" 
          icon="pi pi-refresh"
          class="w-full"
          (click)="update()">
        </button>
      </div>
    }
  `
})
export class UpdateNotificationComponent {
  protected swUpdate = inject(SwUpdateService);

  update() {
    this.swUpdate.activateUpdate();
  }
}
```

### Add to App Component

Update `src/app/app.ts`:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpdateNotificationComponent } from '@shared/components/update-notification';
import { SwUpdateService } from '@core/services/sw-update';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    UpdateNotificationComponent  // Add this
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private swUpdate = inject(SwUpdateService);

  ngOnInit() {
    // Service initializes automatically
    console.log('PWA Update Service initialized');
  }
}
```

Update `src/app/app.html`:

```html
<router-outlet />
<app-update-notification />  <!-- Add this -->
```

---

## ✅ Step 6: Verification Checklist

Run through this checklist to ensure everything is working:

```typescript
PWA Installation Checklist:

□ @angular/pwa package installed
  └─ Run: npm list @angular/pwa

□ Files generated:
  ├─ □ ngsw-config.json exists
  ├─ □ src/manifest.webmanifest exists
  ├─ □ src/assets/icons/ folder with 8 icons
  └─ □ src/app/app.config.ts has provideServiceWorker

□ Production build works:
  ├─ □ npm run build succeeds
  └─ □ dist/angular-20-template/browser/ngsw-worker.js exists

□ Local testing works:
  ├─ □ http-server serves app correctly
  ├─ □ Service Worker registers (DevTools → Application)
  ├─ □ Caches created (DevTools → Cache Storage)
  └─ □ Offline mode works (DevTools → Network → Offline)

□ Update detection works:
  ├─ □ SwUpdateService created
  ├─ □ UpdateNotificationComponent created
  └─ □ Component added to app.html
```

---

## 🐛 Troubleshooting

### Service Worker Not Registering

**Problem:** Service Worker doesn't appear in DevTools

**Solutions:**
1. Ensure you're running production build (`npm run build`)
2. Serve from `dist/` folder, not `src/`
3. Check `app.config.ts` has `enabled: !isDevMode()`
4. Clear cache and hard reload (Ctrl+Shift+R)

### Offline Mode Not Working

**Problem:** App doesn't work offline

**Solutions:**
1. Wait 30 seconds after first load (registration delay)
2. Refresh once after Service Worker activates
3. Check Network tab for failed requests
4. Verify cache contains required files

### Icons Not Showing

**Problem:** Default Angular icons appear

**Solutions:**
1. Replace icons in `src/assets/icons/` with your own
2. Ensure manifest.webmanifest points to correct paths
3. Rebuild app after changing icons

---

## 🎓 Key Takeaways

1. **PWA setup is automatic** - `ng add @angular/pwa` does everything
2. **Production builds only** - Service Worker disabled in development
3. **HTTPS required** - Except localhost
4. **Update detection built-in** - Angular provides SwUpdate service
5. **Offline works immediately** - After first load and activation

---

## 🔜 Next Steps

Now that PWA is installed, continue to:

**➡️ [05-PROJECT-STRUCTURE.md](./05-PROJECT-STRUCTURE.md)** - Understand all PWA files

Or explore specific features:

- [06-SERVICE-WORKER-LIFECYCLE.md](./06-SERVICE-WORKER-LIFECYCLE.md) - Deep dive into Service Worker
- [26-WEB-APP-MANIFEST-COMPLETE.md](./26-WEB-APP-MANIFEST-COMPLETE.md) - Customize your manifest
- [88-ANGULAR-PWA-INTEGRATION.md](./88-ANGULAR-PWA-INTEGRATION.md) - Advanced Angular integration

---

## 🎉 Congratulations!

Your Angular 20 template is now a Progressive Web App! 

**What you've achieved:**
- ✅ Service Worker configured
- ✅ Offline support enabled
- ✅ App is installable
- ✅ Caching configured
- ✅ Update detection working

**Next:** Customize and optimize your PWA!

---

**Last Updated:** October 15, 2025  
**Next:** [05-PROJECT-STRUCTURE.md](./05-PROJECT-STRUCTURE.md)
