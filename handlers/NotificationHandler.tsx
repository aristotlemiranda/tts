import React, { useEffect } from "react";
import { Alert, Platform, Linking, PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { FirebaseMessagingTypes} from "@react-native-firebase/messaging";

import * as Speech from "expo-speech";
import Sound from "react-native-sound";
import notifee, { AuthorizationStatus , AndroidImportance } from '@notifee/react-native'

// Set the sound category for playback
Sound.setCategory("Playback");

// Function to play custom sound
//mainly to have the foreground notification sound
const playCustomSound = (callback) => {
  const sound = new Sound("soniccashr.mp3", Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("Failed to load the sound", error);
      return;
    }
    sound.play((success) => {
      if (success) {
        console.log("Successfully played the sound");
      } else {
        console.log("Playback failed due to audio decoding errors");
      }
      callback();
    });
  });
};


// Notification queue
const notificationQueue: FirebaseMessagingTypes.RemoteMessage[] = [];
let isProcessing = false;

const processQueue = () => {
  const remoteMessage = notificationQueue.shift() as unknown as FirebaseMessagingTypes.RemoteMessage;
  isProcessing = true;
  const body = remoteMessage?.notification?.body;
  if (body && typeof body === "string") {
    Alert.alert("Notification", body);
    Speech.speak(body);
    // playCustomSound(() => {
    //   setTimeout(() => {
    //     Speech.speak(body); // Text-to-speech functionality
    //     isProcessing = false;
    //     processQueue(); // Process the next notification in the queue
    //   }, 1000); // 1000 milliseconds delay (1 second)
    // });
  }
};

// Function to display foreground notifications with custom sound
async function displayForegroundNotification(remoteMessage) {
  console.log("Display foreground with Sound");
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId: 'AMM-TTSv01',
      sound: 'soniccashr', // Custom sound for foreground notifications
      importance: AndroidImportance.HIGH,
    },
  });
}


// Function to handle received notifications in the foreground
export function handleNotificationReceived(): () => void {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", remoteMessage);
      await displayForegroundNotification(remoteMessage);

      notificationQueue.push(remoteMessage); // Enqueue the notification
      processQueue(); // Start processing the queue
  });

  return unsubscribe; // Return the unsubscribe function
}


// Function to set up Notifee notification channel
async function setupNotificationChannel() {
  await notifee.createChannel({
    id: 'AMM-TTSv01',
    name: 'Custom Sound Channel',
    sound: 'soniccashr', // Ensure this sound file is in your Android project's raw directory
    importance: AndroidImportance.HIGH,
  });
}


// Function to set background message handler
const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
    // Handle background message here if needed
   
    // Check if the notification's body exists and is a string
    const body = remoteMessage.notification?.body;
    if (body && typeof body === "string") {
      Speech.speak("Hello World, it is working"); // Text-to-speech functionality
      // Play custom sound on notification
      // playCustomSound(() => {
      //   setTimeout(() => {
      //     isProcessing = false;
      //     processQueue(); // Process the next notification in the queue
      //   }, 1000); // 1000 milliseconds delay (1 second)
      // });
    }
  });
};

export async function requestNotificationPermission() {
  // Get current settings
  console.log("Testing...")
  const settings = await notifee.getNotificationSettings();
  console.log("Settings:", settings);

   const postPermission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
   const hasPermission = await PermissionsAndroid.check(postPermission);
   console.log("Has Permission:", hasPermission);
   console.log("Post Permission:", postPermission);
  // For Android, we can request again directly
  if (Platform.OS === 'android') {
    const permission = notifee.requestPermission();
    if((await permission).authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      console.log("Permission is already granted.");
    }else {
      console.log("Permission is not granted.");
      //Redirect user to Settings.
      Linking.openSettings();
    }
  }
  
  //Test for android, add check version <13
  // For iOS, if previously denied, we need to redirect to Settings
  if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    // Show custom alert to guide user to Settings
    Alert.alert(
      'Enable Notifications',
      'Please enable notifications in your device settings to receive updates.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          }
        }
      ]
    );
    return settings;
  }
  
  // If not determined yet, request permission
  return await notifee.requestPermission();
}
// You can modify your getFcmToken function to use Notifee's permission first
// Modified getFcmToken function
export async function getFcmToken() {
  try {
    const settings = await requestNotificationPermission();
    
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
        return fcmToken;
      }
      console.error("Failed to get FCM token");
    } else {
      console.log("Notifications not authorized");
    }
  } catch (error) {
    console.error("Error in getFcmToken:", error);
  }
}



// Function to set up notifications
export async function setupNotifications(
  setTokenCallback: (token: string) => void
) {
  // Request permissions and get FCM token
  const fcmToken = await getFcmToken();
  if (fcmToken) {
    console.log("FCM Token:", fcmToken);
    setTokenCallback(fcmToken); // Set the token in the state
  }

  setupNotificationChannel();

  setBackgroundMessageHandler(); // Register background handler

  // Handle notification clicks 
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log("Notication clicked background state>>", remoteMessage);
    Alert.alert(
      "Notification Clicked",
      JSON.stringify(remoteMessage.notification)
    );
  });

  // Get the initial notification if the app was opened from a quit state
  //this trigger when the app in quite state received a notification and when the message was clicked.
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("Notification quite state>>", remoteMessage);
        Alert.alert(
          "Notification Opened from Quit State",
          JSON.stringify(remoteMessage.notification)
        );
      }
    });

  // Handle foreground notifications
  const unsubscribe = handleNotificationReceived();

  return unsubscribe; // Return the unsubscribe function
}

// Function to clean up listeners
export function removeNotificationListeners(unsubscribe: () => void) {
  unsubscribe();
}
