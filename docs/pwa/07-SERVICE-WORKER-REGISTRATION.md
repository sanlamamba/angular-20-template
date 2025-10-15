# 📝 Service Worker Registration - Angular 20

**Estimated Time:** 20 minutes  
**Difficulty:** ⭐⭐ Intermediate  
**Prerequisites:** [06-SERVICE-WORKER-LIFECYCLE.md](./06-SERVICE-WORKER-LIFECYCLE.md)

---

## 🎯 What You'll Learn
- How Angular registers the Service Worker
- Registration strategies
- Manual vs automatic registration
- Debugging registration issues
- Custom registration (if needed)

---

## ⚡ How Angular Registers the Service Worker

When you run `ng add @angular/pwa`, Angular:
- Adds `provideServiceWorker('ngsw-worker.js', { ... })` to your `app.config.ts`
- Registers the SW **only in production** (`enabled: !isDevMode()`)
- Uses `registerWhenStable:30000` by default (waits for app to stabilize, then 30s delay)

**Example from your project:**
```typescript
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
```

---

## 🕒 Registration Strategies

- `registerWhenStable:30000` (default): Waits for app to stabilize, then 30s delay
- `registerImmediately`: Registers as soon as possible
- `registerWithDelay:5000`: Registers after 5 seconds
- `registerWhenStable`: Registers when app is stable (no delay)

**Change strategy in `app.config.ts`:**
```typescript
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerImmediately' // or any above
})
```

---

## 🛠️ Manual Registration (Advanced)

If you want to register the SW yourself (not recommended for most apps):
```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ngsw-worker.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}
```

---

## 🐛 Debugging Registration

- Make sure you're running a **production build**
- Serve from `dist/` folder, not `src/`
- Check `app.config.ts` for correct `enabled` flag
- Use DevTools → Application → Service Workers
- Look for errors in the console

---

## 📝 Key Takeaways
- Angular handles registration for you
- Use `registrationStrategy` to control timing
- Manual registration is rarely needed
- Debug with DevTools and console logs

---

**Next:** [08-NGSW-CONFIG-DEEP-DIVE.md](./08-NGSW-CONFIG-DEEP-DIVE.md)
