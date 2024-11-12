# README


# Install Expo Go in your mobile phone.

# Install Expo-cli
> npm install -g eas-cli

# Create an Expo account and login
To build your app, you will need to create an Expo account and login to the EAS CLI.

Sign up for an Expo account.
Run the following command in your terminal to log in to the EAS CLI:

> eas login



# How to run this application
> cd "YourAppDirectory"
> $env:REACT_NATIVE_PACKAGER_HOSTNAME="IP ADDRESS OF YOUR COMPUTER"
> npx expo start --port 8083 --lan


# Using Dev Build
1. Build in EAS 
eas build --platform android --profile development
2. Open Android Studio, run a simulator
3. Install the .apk in the simulator
4. Run the development server.
npx expo start

# Step after excuting prebuild
1. Add index.js
   '''
   import { AppRegistry } from 'react-native';
   import App from './App'; // Adjust the path if your App.tsx is in a different directory
   import { name as appName } from './app.json';

   AppRegistry.registerComponent(appName, () => App);

   '''
2. Add metro.config.js
   '''
   const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = defaultConfig;

'''
3. Install metro config 
npm install @expo/metro-config --save-dev

4. Bundle the Javascript
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
Note: create assets folder if not created.
mkdir -p android/app/src/main/assets


6. Build the apk
 cd android
./gradlew assembleRelease
Note: find the output in android/app/build/outputs/apk/release/app-release.apk

# Sample built apk
https://1drv.ms/f/c/b580b384d2e8a606/Ei-QKVv8ay9Lohx_exvezcABoojFm1uZ679kgDCIiHOR2Q?e=tmQvqH
