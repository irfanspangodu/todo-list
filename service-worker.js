const CACHE_NAME = "todo-app-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./assets/css/styles.css",
  "./assets/js/script.js",
  "./manifest.json",
  "./assets/icons/icon-512x512.png",
  "./assets/icons/icon-192x192.png",
  "./assets/icons/icon-256x256.png",
  "./assets/icons/icon-64x64.png",
  "./assets/icons/icon-48x48.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
