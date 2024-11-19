import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import * as Speech from 'expo-speech';

export function handleNotificationReceived(): () => void {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('A new FCM message arrived!', remoteMessage);

    // Check if the notification's body exists and is a string
    const body = remoteMessage.notification?.body;
    if (body && typeof body === 'string') {
      Alert.alert('Notification', body);
      Speech.speak(body); // working.
     //const message = "你好，世界"; 
     // "Hello, world" in Chinese 
     //const language = "zh-CN"; 
     // Language code for Chinese 
     //Speech.speak(message, { language: language });
    }

  });

  return unsubscribe; // Return the unsubscribe function
}

// Request permissions and get FCM token
export async function getFcmToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);

    // Get the FCM token
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } else {
      console.error('Failed to get FCM token');
    }
  } else {
    console.error('Permission denied for push notifications');
  }
}

// Set up notifications
export async function setupNotifications(setTokenCallback: (token: string) => void) {
  // Request permissions and get FCM token
  const fcmToken = await getFcmToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    setTokenCallback(fcmToken); // Set the token in the state
  }

  // Handle foreground notifications
  const unsubscribe = handleNotificationReceived();

  return unsubscribe; // Return the unsubscribe function
}

// Clean up listeners
export function removeNotificationListeners(unsubscribe: () => void) {
  unsubscribe();
}
