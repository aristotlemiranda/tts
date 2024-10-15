import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { HomeIcon, CogIcon, BellIcon, QrCodeIcon } from 'react-native-heroicons/outline';

const BottomNavBar = ({ navigation }) => {
  return (
    <View className="flex-row justify-around items-center h-15 border-t border-gray-400">
      <TouchableOpacity className="p-2">
        <HomeIcon size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity className="p-2" onPress={() => navigation.navigate('Settings')}>
        <CogIcon size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity className="p-2">
        <BellIcon size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity className="p-2" onPress={() => navigation.navigate('QR')}>
        <QrCodeIcon size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;
