// src/firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js';

const firebaseConfig = {
  apiKey: "AIzaSyBx2UdVnCdcF0BCIU8hUraB-LPLCDqDVHw",
  authDomain: "chill-space-8efd3.firebaseapp.com",
  projectId: "chill-space-8efd3",
  storageBucket: "chill-space-8efd3.firebasestorage.app",
  messagingSenderId: "639484992351",
  appId: "1:639484992351:web:220bc4872541336294b4ea"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
