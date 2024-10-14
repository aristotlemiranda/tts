import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, StatusBar } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Speech from 'expo-speech';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavBar from './components/BottomNavBar'; // Adjust the path as necessary
import SettingsScreen from './SettingsScreen'; // Import the Settings screen
import QRScreen from './components/QRScreen'; // Adjust the path as necessary

import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {

  Home: undefined;

  Settings: undefined;

};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('zh');
  const [openSource, setOpenSource] = useState(false);
  const [openTarget, setOpenTarget] = useState(false);

  const translateText = async () => {
    console.log('Translating Text:', text);
    try {
      const translator = 'https://dev.aristotlemiranda.com/translate';
      const response = await fetch(translator, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
        }),
      });

      if (!response.ok) {
        console.error('Server Error:', response.statusText);
        Alert.alert('Server Error', `Status: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log('Received Translated Text:', data.translatedText);
      setTranslatedText(data.translatedText);
      return data.translatedText;
    } catch (error) {
      console.error('Translation Error:', error);
      Alert.alert('Error', 'Failed to translate text');
      return null;
    }
  };

  const handleTranslateAndSpeak = async () => {
    const translation = await translateText();
    console.log("translatedText=", translation);
    if (translation) {
      Speech.speak(translation, { language: targetLang });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.label}>Translate:</Text>
      <TextInput
        placeholder="Enter text"
        onChangeText={setText}
        value={text}
        style={styles.input}
      />
      <Text style={styles.label}>Source Language:</Text>
      <DropDownPicker
        open={openSource}
        value={sourceLang}
        items={[
          { label: 'English', value: 'en' },
          { label: 'Chinese', value: 'zh' },
          { label: 'Spanish', value: 'es' },
        ]}
        setOpen={(open) => {
          setOpenSource(open);
          setOpenTarget(false);
        }}
        setValue={setSourceLang}
        zIndex={1000}
        zIndexInverse={3000}
        style={styles.picker}
      />
      <Text style={styles.label}>Target Language:</Text>
      <DropDownPicker
        open={openTarget}
        value={targetLang}
        items={[
          { label: 'English', value: 'en' },
          { label: 'Chinese', value: 'zh' },
          { label: 'Spanish', value: 'es' },
        ]}
        setOpen={(open) => {
          setOpenTarget(open);
          setOpenSource(false);
        }}
        setValue={setTargetLang}
        zIndex={500}
        zIndexInverse={2000}
        style={styles.picker}
      />
      <TouchableOpacity style={styles.button} onPress={handleTranslateAndSpeak}>
        <Text style={styles.buttonText}>Translate & Speak</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <Text selectable style={styles.translatedText}>Translation: {translatedText}</Text>
      <View style={styles.bottomNavContainer}>
        <BottomNavBar navigation={navigation} />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="QR" component={QRScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align all items to the left
    padding: 20,
    paddingTop: 20, // Add padding to the top
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%', // Adjust width to full
  },
  picker: {
    height: 50,
    width: '100%', // Adjust width to full
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%', // Adjust width to full
  },
  translatedText: {
    marginTop: 5,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%', // Adjust width to full
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  spacer: {
    height: 20, // Adjust the space as needed
  },
  bottomNavContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
});