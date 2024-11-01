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
