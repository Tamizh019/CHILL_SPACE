// src/notification.js - Updated with your NEW VAPID key
import { messaging } from './firebase-config.js';
import { getToken, onMessage } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js';

// 🔥 Your NEW VAPID key
const VAPID_KEY = 'BHViadjwRv_goMmgoClp0UI9KJgFiZ3CxE4U5Sp2fiDpO6YvlVbpP0Hj5bQF-y7SWEMy55nJjpwtPrq3VukZOM4';

export async function requestNotificationPermission() {
  console.log('🔔 Starting notification permission request...');
  
  try {
    const permission = await Notification.requestPermission();
    console.log('🔔 Permission result:', permission);
    
    if (permission !== 'granted') {
      console.log('❌ Permission denied');
      return null;
    }

    console.log('✅ Permission granted, getting FCM token...');
    
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (token) {
      console.log('✅ FCM token generated:', token);
      return token;
    } else {
      console.log('❌ No FCM token generated');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error in requestNotificationPermission:', error);
    throw error;
  }
}

export function listenForForegroundMessages() {
  onMessage(messaging, (payload) => {
    console.log('🔔 Foreground message received:', payload);
    const { title, body, icon } = payload.notification || {};
    if (title) {
      new Notification(title, { 
        body: body || 'New message',
        icon: icon || '/Assets/pfp2.jpg'
      });
    }
  });
}
