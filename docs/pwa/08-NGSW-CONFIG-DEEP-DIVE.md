# 🛠️ ngsw-config.json Deep Dive (Angular Service Worker)

**Estimated Time:** 40 minutes  
**Difficulty:** ⭐⭐⭐ Advanced  
**Prerequisites:** [07-SERVICE-WORKER-REGISTRATION.md](./07-SERVICE-WORKER-REGISTRATION.md)

---

## 🎯 What You'll Learn
- Structure of ngsw-config.json
- Asset groups vs data groups
- InstallMode and updateMode
- Caching strategies for static and dynamic content
- How to configure for your Angular 20 template

---

## 📁 ngsw-config.json Structure

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [ ... ],
  "dataGroups": [ ... ]
}
```

### 1. **assetGroups**
- For static files (HTML, CSS, JS, images, fonts)
- Two main groups: `app` (critical shell) and `assets` (images, fonts)

```json
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
```

- `installMode: prefetch` = Download immediately
- `installMode: lazy` = Download on demand
- `updateMode: prefetch` = Update in background

### 2. **dataGroups**
- For dynamic data (API calls)
- Example:
```json
"dataGroups": [
  {
    "name": "api-performance",
    "urls": [
      "/api/dashboard/**",
      "/api/profile/**"
    ],
    "cacheConfig": {
      "strategy": "performance",
      "maxSize": 100,
      "maxAge": "1h",
      "timeout": "5s"
    }
  },
  {
    "name": "api-fresh",
    "urls": [
      "/api/auth/**"
    ],
    "cacheConfig": {
      "strategy": "freshness",
      "maxSize": 0,
      "maxAge": "0u",
      "timeout": "5s"
    }
  }
]
```
- `strategy: performance` = Cache-first, fallback to network
- `strategy: freshness` = Network-first, fallback to cache

---

## 🏗️ How to Configure for Your Template

- **App Shell**: Add all shell files to `app` group
- **Assets**: Add all icons, images, fonts to `assets` group
- **API Data**: Add `/api/dashboard/**`, `/api/profile/**` to `dataGroups` with `performance`
- **Auth**: Add `/api/auth/**` to `dataGroups` with `freshness`

---

## 📝 Example ngsw-config.json for Your Project

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
    },
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
    }
  ]
}
```

---

## 🐛 Debugging ngsw-config.json
- Use `ngsw-config` schema for validation
- Check DevTools → Application → Cache Storage
- Use `ngsw.json` endpoint to inspect SW state
- Use `ngsw-bypass` query param to bypass SW

---

## 📝 Key Takeaways
- `assetGroups` for static files, `dataGroups` for API
- Use `performance` for offline-first, `freshness` for online-first
- Tune `maxSize`, `maxAge`, `timeout` for your needs
- Test and iterate for best results

---

**Next:** [09-CACHING-STRATEGIES-BASICS.md](./09-CACHING-STRATEGIES-BASICS.md)
