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

<<<<<<< HEAD

# Obsfucate
does this command obsfucate. PS D:\Development\React Native\tts> npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
No, the command npx react-native bundle does not obfuscate your JavaScript code. This command simply bundles your JavaScript files into a single file for use in your React Native application. It will minify the code (if --dev false is specified), but minification is not the same as obfuscation.

Minification vs. Obfuscation
Minification: This process removes whitespace, comments, and sometimes shortens variable names. It reduces the size of the JavaScript file, making it quicker to download and parse.

Obfuscation: This involves transforming the code to make it harder to read and understand, often by renaming variables and functions to short, nonsensical names and sometimes restructuring the code.

How to Obfuscate Your React Native Bundle
To obfuscate your JavaScript code in a React Native project, you can use tools like javascript-obfuscator. Here's how you can integrate it into your build process:

Install JavaScript Obfuscator:

sh
npm install javascript-obfuscator --save-dev
Create a Script to Obfuscate the Bundle: Add a script in your package.json to obfuscate the bundle after it is generated:

json
"scripts": {
  "bundle:android": "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res && javascript-obfuscator android/app/src/main/assets/index.android.bundle --output android/app/src/main/assets/index.android.bundle"
}
Run the Obfuscation Script:

sh
npm run bundle:android
=======
https://appdistribution.firebase.dev/i/425de204e33c44df
>>>>>>> 409187948647b150dded186c74b7b9ed8a5b2337
