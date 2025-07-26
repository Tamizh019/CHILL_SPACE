/* public/firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBx2UdVnCdcF0BCIU8hUraB-LPLCDqDVHw",
  authDomain: "chill-space-8efd3.firebaseapp.com",
  projectId: "chill-space-8efd3",
  storageBucket: "chill-space-8efd3.firebasestorage.app",
  messagingSenderId: "639484992351",
  appId: "1:639484992351:web:220bc4872541336294b4ea"
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({notification}) => {
  const {title, body, icon, click_action} = notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || '/icon-192x192.png',
    data: {click_action: click_action || '/'}
  });
});
