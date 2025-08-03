// 缓存名称
const CACHE_NAME = 'ai-assistant-v1';

// 需要缓存的资源
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/icon-192.png',
  '/icon-512.png'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});