import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance } from 'lib/axios';
import * as SecureStore from 'expo-secure-store';

const SignupScreen = ({ setUserToken }: any) => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    longitude: '',
    latitude: '',
    interests: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => { 
    const { name, email, password, phone, age, longitude, latitude, interests } = form;
    if (!name || !email || !password || !phone || !age || !longitude || !latitude || !interests) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        phone,
        age: Number(age),
        isAdmin: false,
        longitude,
        latitude,
        interests: [interests.toUpperCase()],
      };

      const res = await axiosInstance.post('/auth/sign-up', payload);

      if (res.data?.token) {
        await SecureStore.setItemAsync('userToken', res.data.token);
        setUserToken(res.data.token);
        Alert.alert('Signup Successful');
      } else {
        Alert.alert('Signup failed', res.data?.msg || 'Something went wrong');
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Signup failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white p-8">
      <Text className="text-2xl font-bold text-yellow-500 mb-4">Create Account</Text>

      {Object.entries({
        name: 'Full Name',
        email: 'Email',
        password: 'Password',
        phone: 'Phone',
        age: 'Age',
        longitude: 'Longitude',
        latitude: 'Latitude',
        interests: 'Interest (e.g., CONFERENCE)',
      }).map(([key, placeholder]) => (
        <TextInput
          key={key}
          placeholder={placeholder}
          value={(form as any)[key]}
          onChangeText={(v) => handleChange(key, v)}
          secureTextEntry={key === 'password'}
          keyboardType={key === 'age' ? 'numeric' : key === 'phone' ? 'phone-pad' : 'default'}
          className="w-full rounded-lg border-b border-yellow-400 px-4 py-2 text-black"
        />
      ))}

      <Pressable
        onPress={handleSignUp}
        disabled={loading}
        className="w-full rounded-lg bg-yellow-400 py-3 mt-4 active:bg-yellow-300"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-center font-semibold text-black">Sign Up</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text className="text-blue-500 underline mt-2">Already have an account? Log in</Text>
      </Pressable>
    </View>
  );
};

export default SignupScreen;
