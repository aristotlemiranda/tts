import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeIcon, CogIcon, BellIcon, QrCodeIcon } from 'react-native-heroicons/outline';

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon}>
        <HomeIcon size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Settings')}>
        <CogIcon size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <BellIcon size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('QR')}>
        <QrCodeIcon size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  icon: {
    padding: 10,
  },
});

export default BottomNavBar;