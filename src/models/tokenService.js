// src/models/tokenService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async () => {
  const user = await AsyncStorage.getItem('user');
  if (!user) return null;
  const parsed = JSON.parse(user);
  return parsed.token;
};
