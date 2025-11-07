import { Text, TextInput, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance } from 'lib/axios';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../App';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { setUserToken } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter all the fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.data.token) {
        await SecureStore.setItemAsync('userToken', res.data.token);
        setUserToken(res.data.token); // 👈 triggers App to re-render and switch to Home
        Alert.alert('Login Successful');
      } else {
        Alert.alert('Login failed', res.data?.msg || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 p-8">
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        className="w-full rounded-lg border-b border-neutral-500 px-4 text-sm"
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full rounded-lg border-b border-neutral-500 px-4 text-sm"
      />
      <Pressable
        onPress={handleLogin}
        className="w-full rounded-lg bg-yellow-400 py-3 active:bg-yellow-300"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-center font-semibold text-black">Login</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text className="text-blue-500 underline">
          Don’t have an account? Sign up
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
