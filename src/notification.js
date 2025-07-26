// src/notification.js
import { messaging } from './firebase-config.js';
import { getToken, onMessage } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js';

const VAPID_KEY = 'BH8NVU6U5qQyBMQ0MA9aDMv2t1Osa72oHrdwFGZ-qWl__VT-kTGzH5hg6hZeARVU5Qm76s6B2O4-InhjkcoDnAQ';

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const token = await getToken(messaging, { vapidKey: VAPID_KEY });
  if (token) {
    console.log('FCM token:', token);
    // TODO: save token to your Supabase database
  }
  return token;
}

export function listenForForegroundMessages() {
  onMessage(messaging, ({notification}) => {
    const {title, body, icon} = notification;
    new Notification(title, { body, icon });
  });
}
