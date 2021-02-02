/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const CACHE_NAME = "task-manager-pwa";
const urlsToCache = ["/", "/completed"];

// Install service worker
// eslint-disable-next-line no-restricted-globals
// eslint-disable-next-line no-undef
self.addEventListener("install", (event) => {
  // Perform the install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return the requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return response as Cache is hit
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Update service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["task-manager-pwa"];
  event.waitUntil(
    // eslint-disable-next-line arrow-body-style
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
