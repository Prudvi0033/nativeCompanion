import { View, Text, Pressable } from 'react-native';
import React from 'react';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = ({ setUserToken }: any) => {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUserToken(null); // 👈 reset token and trigger navigation to Login
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        className="bg-red-700 px-3 py-2 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg">Logout</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;
