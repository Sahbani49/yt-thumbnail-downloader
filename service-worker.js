const CACHE_NAME = "yt-thumbnail-v2";

const urlsToCache = [
  "/yt-thumbnail-downloader/",
  "/yt-thumbnail-downloader/index.html",
  "/yt-thumbnail-downloader/manifest.json",
  "/yt-thumbnail-downloader/favicon.png",
  "/yt-thumbnail-downloader/icon-192.png",
  "/yt-thumbnail-downloader/icon-512.png"
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
