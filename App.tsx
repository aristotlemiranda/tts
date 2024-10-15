import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StatusBar } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Speech from 'expo-speech';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavBar from './components/BottomNavBar';
import SettingsScreen from './SettingsScreen';
import QRScreen from './components/QRScreen';

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
    <View className="flex-1 justify-center items-start p-5 pt-5">
      <StatusBar barStyle="dark-content" />
      <Text className="text-lg font-bold mb-2">Translate:</Text>
      <TextInput
        placeholder="Enter text"
        onChangeText={setText}
        value={text}
        className="mb-5 p-2 border border-gray-400 w-full"
      />
      <Text className="text-lg font-bold mb-2">Source Language:</Text>
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
        style={{ height: 50, width: '100%', marginBottom: 20 }}  // Still using style prop for DropDownPicker
      />
      <Text className="text-lg font-bold mb-2">Target Language:</Text>
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
        style={{ height: 50, width: '100%', marginBottom: 20 }}  // Still using style prop for DropDownPicker
      />
      <TouchableOpacity className="bg-blue-500 p-3 w-full items-center mb-5" onPress={handleTranslateAndSpeak}>
        <Text className="text-white text-lg">Translate & Speak</Text>
      </TouchableOpacity>
      <Text selectable className="mt-1 p-2 border border-gray-400 w-full text-left">Translation: {translatedText}</Text>
      <View className="flex-1 justify-end w-full">
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
