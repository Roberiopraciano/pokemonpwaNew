const CACHE_DATA = "offline-data";
const STATIC_RESOUCES = ["index.html", "app.js", "logo.png"];

//Install Service Worker
self.addEventListener("install", async (e) => {
  console.log("Sw install");

  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_DATA);
      return await cache.addAll(STATIC_RESOUCES);
    })()
  );
  self.skipWaiting();
});

// Listener for ferchng request
self.addEventListener("fetch", async (e) => {
  console.log(`Sw fetch: ${e.request.url}   `);

  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_DATA);

      try {
        const networkResponse = await fetch(e.request);
        await cache.put(e.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(e.request);
        return cachedResponse;
      }
    })()
  );
});

// Activate the Sw
self.addEventListener("activate", async (e) => {
  console.log("Sw activate");
});
