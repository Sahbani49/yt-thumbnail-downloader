const CACHE_NAME = "yt-thumbnail-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.png",
  "./icon-192.png",
  "./icon-512.png"
];

// تثبيت Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// جلب الملفات
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          return networkResponse;
        })
      );
    })
  );
});
