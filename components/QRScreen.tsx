import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Text, TouchableOpacity, View, Button } from 'react-native';

export default function QRScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState('');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-2.5">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setQrData(data);
  };

  return (
    <View className="flex-1">
      <CameraView
        className="flex-1"
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View className="flex-1 justify-center items-center bottom-5">
          {/* Overlay for QR scanning area */}
          <View className="w-3/4 h-3/4 border-4 border-blue-500 bg-transparent rounded-lg justify-center items-center">
            <Text className="text-white text-lg absolute">Align QR Code Here</Text>
          </View>
        </View>

        {scanned && (
          <View className="absolute top-80 left-0 right-0 items-center">
          <TouchableOpacity className="bg-blue-600 rounded-2xl py-2.5 px-5 shadow-md" onPress={() => setScanned(false)}>
            <Text className="text-white text-lg font-bold text-center">Tap to Scan Again</Text>
          </TouchableOpacity>
        </View>
        )}
      </CameraView>
      
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-700">QR Data: {qrData}</Text>
      </View>
    </View>
  );
}
