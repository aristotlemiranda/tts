import React, { useEffect } from "react";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { FirebaseMessagingTypes} from "@react-native-firebase/messaging";

import * as Speech from "expo-speech";
import Sound from "react-native-sound";

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
    playCustomSound(() => {
      setTimeout(() => {
        Speech.speak(body); // Text-to-speech functionality
        isProcessing = false;
        processQueue(); // Process the next notification in the queue
      }, 1000); // 1000 milliseconds delay (1 second)
    });
  }
};

// Function to handle received notifications in the foreground
export function handleNotificationReceived(): () => void {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", remoteMessage);
      notificationQueue.push(remoteMessage); // Enqueue the notification
      processQueue(); // Start processing the queue
  });

  return unsubscribe; // Return the unsubscribe function
}

// Function to set background message handler
const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
    // Handle background message here if needed

    // Check if the notification's body exists and is a string
    const body = remoteMessage.notification?.body;
    if (body && typeof body === "string") {
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

// Function to request permissions and get FCM token
export async function getFcmToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);

    // Get the FCM token
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      return fcmToken;
    } else {
      console.error("Failed to get FCM token");
    }
  } else {
    console.error("Permission denied for push notifications");
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
