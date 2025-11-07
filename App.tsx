import './global.css';
import React, { useEffect, useState, createContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignupScreen from 'screens/SignupScreen';

const Stack = createNativeStackNavigator();

export const AuthContext = createContext({
  userToken: null as string | null,
  setUserToken: (token: string | null) => {},
});

const App = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Stored token:', token);
      setUserToken(token);
      setLoading(false);
    };
    getToken();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFFF00" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ userToken, setUserToken }}>
      <NavigationContainer>
        {userToken ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name='Signup' component={SignupScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="home" component={HomeScreen} />
  </Stack.Navigator>
);

export default App;
