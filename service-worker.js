importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/reg-sw.js', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/pages/beranda.html', revision: '1' },
  { url: '/pages/kompetisi.html', revision: '1' },
  { url: '/pages/jadwal.html', revision: '1' },
  { url: '/pages/jadwaltersimpan.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/css/style.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/jquery.js', revision: '1' },
  { url: '/menus/kompetisi.js', revision: '1' },
  { url: '/menus/jadwal.js', revision: '1' },
  { url: '/menus/jadwaltersimpan.js', revision: '1' },
  { url: '/assets/icon/icon-72px.png', revision: '1' },
  { url: '/assets/icon/icon-96px.png', revision: '1' },
  { url: '/assets/icon/icon-128px.png', revision: '1' },
  { url: '/assets/icon/icon-144px.png', revision: '1' },
  { url: '/assets/icon/icon-152px.png', revision: '1' },
  { url: '/assets/icon/icon-192px.png', revision: '1' },
  { url: '/assets/icon/icon-384px.png', revision: '1' },
  { url: '/assets/icon/icon-512px.png', revision: '1' },
  { url: '/assets/liga/laliga.png', revision: '1' },
  { url: '/assets/liga/serie-a.png', revision: '1' },
  { url: '/assets/liga/epl.png', revision: '1' },
  { url: '/assets/liga/ligue-one.png', revision: '1' },
  { url: '/assets/liga/bundesliga.png', revision: '1' },
  { url: '/assets/liga/eredivisie.png', revision: '1' },
  { url: '/assets/jumbotron.jpg', revision: '1' },
  { url: '/assets/side-img.jpg', revision: '1' },
]);

workbox.routing.registerRoute(
  /^https:\/\/api\.football\-data\.org\/v2\/competitions/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'team-schedule-cache'
  })
);

self.addEventListener('push', (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  const options = {
    body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options),
  );
});
