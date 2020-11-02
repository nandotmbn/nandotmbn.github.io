const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'BNSc7GCXoq7ofNO68LQ0Z9MJpAIy6WxNDfD5azKz3NicKbcLY0cjyhdP4f2UWZ_LXon-pXZ4Sf9b1E7ZixG5te0',
  privateKey: 'dJ-S3BPtZ0ldwKbckJNBdWX_DkxL7y8XuCQVvSe7STY',
};

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);
const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/chHT51nAAD8:APA91bGPoUMPdagHoX3aLgxXAzySX94XF-8wV-ouZWRpLoC9ib33BLGkkuOwk57Nkc8CPlndgyver6v2FmYhvcOOfZzxr6moirhV0eNu9rT-sUqog4VOvSCeVes2REpV7S4Ld5Nnacl3',
  keys: {
    p256dh: 'BMDzUAhlln3014D+flj9MNkci/SI0A3YnAOtAZXTe+mjPRriu3dkdKEXGJfaU+ekpOsxpcSdcXGcNVs4/Rghoxs=',
    auth: 'Wl2OdpFCelO5UHuwQc85mg==',
  },
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

const options = {
  gcmAPIKey: '331462312525',
  TTL: 60,
};
webPush.sendNotification(
  pushSubscription,
  payload,
  options,
);
