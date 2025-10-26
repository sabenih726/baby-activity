const CACHE_NAME = 'baby-tracker-v1';
// Daftar file yang akan disimpan di cache
const urlsToCache = [
  './', // Halaman utama
  'index.html',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
  // Anda harus menambahkan path ke semua ikon Anda di sini juga
  // 'icons/icon-72x72.png',
  // 'icons/icon-96x96.png',
  // ... dst
];

// Event 'install': Dipanggil saat Service Worker pertama kali di-install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        // Menambahkan semua file penting ke cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Dipanggil setiap kali aplikasi meminta file (mis. gambar, skrip, html)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Strategi: "Network falling back to cache"
    // 1. Coba ambil dari jaringan (internet) dulu
    fetch(event.request)
      .then(networkResponse => {
        // Jika berhasil, simpan ke cache dan kembalikan respons
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseToCache));
        return networkResponse;
      })
      .catch(() => {
        // 2. Jika jaringan gagal (offline), coba ambil dari cache
        return caches.match(event.request);
      })
  );
});

// Event 'activate': Dipanggil untuk membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Hapus cache lain yang tidak ada di whitelist
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
