const CACHE_NAME = 'baby-tracker-cache-v1';
// Aset yang akan di-cache untuk fungsionalitas offline
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    // Perhatikan: Pastikan file ikon ini benar-benar ada di folder 'icons'
    'icons/icon-192x192.png', 
    'icons/icon-512x512.png',
    // Chart.js perlu di-cache agar grafik tetap bekerja offline
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js' 
];

// Event: Install - Menginstal service worker dan meng-cache aset
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Membuka cache dan caching semua aset.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Event: Fetch - Mengambil aset dari cache (Cache First Strategy)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Respon dari cache ditemukan
                if (response) {
                    return response;
                }
                // Tidak ada di cache, ambil dari jaringan
                return fetch(event.request);
            })
    );
});

// Event: Activate - Menghapus cache lama
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Hapus cache lama jika namanya berbeda
                        console.log('[Service Worker] Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
