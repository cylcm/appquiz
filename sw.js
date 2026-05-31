/* ===================================================================
   QUEST PSLE — Service Worker (Phase 2)
   - Cache-first for app shell and data/*.json (offline-first).
   - Network-first for the Anthropic API (AI tutor stays live).
   - NEVER touches localStorage (the pa_* keys live there, untouched).
     Service workers cannot access localStorage at all; this SW only
     manages the Cache Storage API.
   - Cache name is versioned; bump CACHE_VERSION to ship new content.
   =================================================================== */
"use strict";

var CACHE_VERSION = "questpsle-v1";          // bump to invalidate old caches
var SHELL_CACHE   = CACHE_VERSION + "-shell";
var DATA_CACHE    = CACHE_VERSION + "-data";

// Same-origin assets to precache on install. Relative paths keep this
// working from any sub-path and on local dev servers.
var SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./version.json",
  "./data/english.json",
  "./data/math.json",
  "./data/science.json",
  "./data/mcq.json"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      // addAll is atomic; if one asset 404s the install fails. Use a
      // tolerant add so a missing optional file never blocks install.
      return Promise.all(SHELL_ASSETS.map(function (url) {
        return cache.add(url).catch(function () { /* ignore individual misses */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        // Drop any cache that isn't part of the current version.
        if (key.indexOf(CACHE_VERSION) !== 0) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isAnthropic(url) { return url.indexOf("api.anthropic.com") !== -1; }
function isDataPack(url)  { return /\/data\/[^/]+\.json(\?.*)?$/.test(url); }
function isVersion(url)   { return /\/version\.json(\?.*)?$/.test(url); }

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;                 // never cache POSTs (AI calls)
  var url = req.url;

  // 1) Anthropic API → network-first, never cached.
  if (isAnthropic(url)) {
    event.respondWith(fetch(req).catch(function () {
      return new Response(JSON.stringify({ error: { message: "Offline: AI unavailable" } }),
        { status: 503, headers: { "Content-Type": "application/json" } });
    }));
    return;
  }

  // 2) version.json → network-first (so content updates are detected),
  //    falling back to cache when offline.
  if (isVersion(url)) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(SHELL_CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  // 3) data/*.json → cache-first, with background revalidate so an
  //    updated pack is picked up on the next visit.
  if (isDataPack(url)) {
    event.respondWith(
      caches.open(DATA_CACHE).then(function (cache) {
        return cache.match(req).then(function (cached) {
          var network = fetch(req).then(function (res) {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(function () { return cached; });
          return cached || network;
        });
      })
    );
    return;
  }

  // 4) Everything else (shell, fonts) → cache-first, fall back to network.
  event.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        // opportunistically cache same-origin GETs
        if (res && res.ok && req.url.indexOf(self.location.origin) === 0) {
          var copy = res.clone();
          caches.open(SHELL_CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
    })
  );
});

// Allow the page to ask us to refresh the data cache after a version bump.
self.addEventListener("message", function (event) {
  var msg = event.data || {};
  if (msg.type === "refresh-data" && Array.isArray(msg.packs)) {
    event.waitUntil(
      caches.open(DATA_CACHE).then(function (cache) {
        return Promise.all(msg.packs.map(function (name) {
          var u = "./data/" + name + ".json";
          return fetch(u, { cache: "reload" }).then(function (res) {
            if (res && res.ok) return cache.put(u, res.clone());
          }).catch(function () {});
        }));
      })
    );
  }
  if (msg.type === "skip-waiting") self.skipWaiting();
});
