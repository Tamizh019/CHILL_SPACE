// src/notification.js - Enhanced with debugging
import { messaging } from './firebase-config.js';
import { getToken, onMessage } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js';

const VAPID_KEY = 'BH8NVU6U5qQyBMQ0MA9aDMv2t1Osa72oHrdwFGZ-qWl__VT-kTGzH5hg6hZeARVU5Qm76s6B2O4-InhjkcoDnAQ';

export async function requestNotificationPermission() {
  console.log('🔔 Starting notification permission request...');
  
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('This browser does not support service workers');
    }

    console.log('🔔 Current permission status:', Notification.permission);
    
    // Request permission
    const permission = await Notification.requestPermission();
    console.log('🔔 Permission result:', permission);
    
    if (permission !== 'granted') {
      console.log('❌ Permission denied');
      return null;
    }

    console.log('✅ Permission granted, getting FCM token...');
    
    // Get FCM token
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (token) {
      console.log('✅ FCM token generated:', token);
      
      // TODO: Save token to your Supabase database
      // Example: await saveTokenToSupabase(token);
      
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
  console.log('🔔 Setting up foreground message listener...');
  
  onMessage(messaging, (payload) => {
    console.log('🔔 Foreground message received:', payload);
    
    const { title, body, icon } = payload.notification || {};
    
    if (title) {
      // Show browser notification
      new Notification(title, { 
        body: body || 'New message',
        icon: icon || '/Assets/pfp2.jpg',
        tag: 'fcm-notification'
      });
    }
  });
  
  console.log('✅ Foreground message listener active');
}

// Helper function to save token to Supabase (optional)
async function saveTokenToSupabase(token) {
  try {
    // Add your Supabase token saving logic here
    console.log('💾 Would save token to Supabase:', token);
  } catch (error) {
    console.error('❌ Error saving token:', error);
  }
}
