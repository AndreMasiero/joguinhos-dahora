/*
 * Service worker do hub "Joguinhos da Hora".
 * Guarda o app inteiro (shell + cada joguinho) em cache pra funcionar 100% offline
 * depois da primeira visita. Ao adicionar um novo joguinho, é só somar as URLs dele
 * em PRECACHE_URLS (opcional — mesmo sem isso, a página fica cacheada sozinha na
 * primeira vez que for aberta) e subir o número de CACHE_VERSION pra forçar a
 * atualização do cache em quem já instalou o app.
 */

const CACHE_VERSION = 'v9';
const CACHE_NAME = 'joguinhos-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './fonts/fonts.css',
  './fonts/bungee-shade.woff2',
  './fonts/nunito-400.woff2',
  './fonts/nunito-600.woff2',
  './fonts/nunito-700.woff2',
  './fonts/nunito-800.woff2',
  './fonts/nunito-900.woff2',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  './games/truco/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // não intercepta nada externo

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
    })
  );
});
