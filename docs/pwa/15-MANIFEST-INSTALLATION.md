# 15 - Manifest & Installation Patterns in Angular PWA

---

## Table of Contents
1. What is the Web App Manifest?
2. Manifest Fields Explained
3. Creating and Configuring manifest.webmanifest
4. Integrating the Manifest in Angular
5. Installation Prompts and UX
6. Customizing the Install Experience
7. Handling Updates to the Manifest
8. Testing Manifest and Installation
9. Best Practices
10. Further Reading

---

## 1. What is the Web App Manifest?
The **Web App Manifest** is a JSON file that tells the browser about your PWA and how it should behave when installed on a device. It enables "Add to Home Screen" and controls the app's appearance and launch behavior.

## 2. Manifest Fields Explained
- `name`: Full app name
- `short_name`: Shorter name for homescreen
- `start_url`: URL to open when launched
- `display`: `standalone`, `fullscreen`, `minimal-ui`, `browser`
- `background_color`: Splash screen color
- `theme_color`: Browser UI color
- `icons`: Array of icon objects (sizes, types)
- `description`: App description
- `orientation`: `portrait`, `landscape`, etc.
- `scope`: Navigation scope

## 3. Creating and Configuring manifest.webmanifest
- Place `manifest.webmanifest` in `src/` or `public/`
- Example:
```json
{
  "name": "Angular 20 PWA Template",
  "short_name": "A20PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "description": "A modern Angular 20 PWA template.",
  "icons": [
    { "src": "/assets/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

## 4. Integrating the Manifest in Angular
- Reference the manifest in `index.html`:
```html
<link rel="manifest" href="/manifest.webmanifest">
```
- Ensure icons exist in the specified paths
- Angular CLI adds the manifest automatically if you use `ng add @angular/pwa`

## 5. Installation Prompts and UX
- Browsers show an install prompt when PWA criteria are met
- You can listen for the `beforeinstallprompt` event to customize the prompt

**Example:**
```typescript
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  // Show custom install UI, then call event.prompt() when ready
});
```

## 6. Customizing the Install Experience
- Show a custom banner or button to encourage installation
- Track install events for analytics
- Provide clear value proposition for installing

## 7. Handling Updates to the Manifest
- Update the manifest file as your app evolves
- Clear browser cache or use versioned URLs to force update
- Test on multiple devices/browsers

## 8. Testing Manifest and Installation
- Use Chrome DevTools > Application > Manifest
- Check for errors, missing icons, or fields
- Test Add to Home Screen on mobile devices

## 9. Best Practices
- Provide icons in multiple sizes (192x192, 512x512, etc.)
- Use `display: standalone` for app-like feel
- Keep `start_url` and `scope` consistent
- Regularly review and update manifest fields

## 10. Further Reading
- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Angular PWA Manifest Guide](https://angular.io/guide/service-worker-config)
- [Google: Manifest Best Practices](https://web.dev/add-manifest/)

---

**Next:**
- 16: Push Notifications (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
