const CACHE_NAME = 'meu-mundo-em-simbolos-v6';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/constants.ts',
  '/hooks.ts',
  '/types.ts',
  '/metadata.json',
  '/components/common/Icon.tsx',
  '/components/keyboard/AddCustomSymbol.tsx',
  '/components/keyboard/CategoryTabs.tsx',
  '/components/keyboard/RecentSymbols.tsx',
  '/components/keyboard/SavedPhrases.tsx',
  '/components/keyboard/SymbolGrid.tsx',
  '/components/keyboard/SymbolKeyboard.tsx',
  '/components/modals/EditSymbolModal.tsx',
  '/components/Header.tsx',
  '/components/PhraseBuilder.tsx',
  '/components/SentenceStrip.tsx',
  '/components/SplashScreen.tsx',
  '/components/SymbolCard.tsx',
  '/components/Toolbar.tsx',
  '/screens/FreeTextScreen.tsx',
  '/screens/SentenceEditorScreen.tsx',
  '/screens/TherapistScreen.tsx',
  '/components/therapist/AnalyticsDashboard.tsx',
  '/components/therapist/GoalsAndSessions.tsx',
  '/services/voiceService.ts',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/lucide-react@^0.552.0',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        const requests = URLS_TO_CACHE.map(url => {
            if (url.startsWith('http')) {
                return new Request(url, { mode: 'no-cors' });
            }
            return url;
        });
        return cache.addAll(requests).catch(err => {
            console.error("Cache.addAll failed. Caching files individually.", err);
            for(const req of requests) {
                cache.add(req).catch(e => console.warn(`Failed to cache ${req.url || req}`, e));
            }
        });
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // For navigation requests, use a network-first strategy.
  // This ensures the user gets the latest app shell, but it works offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // If the network fails, serve the main app shell from the cache.
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For all other requests (assets like JS, CSS, images), use a cache-first strategy.
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // If the resource is in the cache, serve it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's not in the cache, fetch it from the network.
        return fetch(request)
          .then(networkResponse => {
            // And cache the new resource for next time.
            // Check if we received a valid response before caching.
            if(networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});