const CACHE_NAME = 'food-scanner-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap'
];

// 1. ติดตั้ง Service Worker และเก็บไฟล์ลงเครื่อง (Cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. เมื่อมีการเรียกใช้ไฟล์ ให้ดึงจากเครื่องก่อน (ถ้ามี) ถ้าไม่มีค่อยดึงจากเน็ต
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // ถ้ามีใน cache ให้ส่งกลับไปเลย
        if (response) {
          return response;
        }
        // ถ้าไม่มี ให้ไปดึงจาก internet
        return fetch(event.request);
      })
  );
});

// 3. ล้าง Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
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
