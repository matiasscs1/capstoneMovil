import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext.js'; 
import { useNavigation } from '@react-navigation/native';

export default function LogoutScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await logout();
      navigation.replace('Login'); // redirige a login
    })();
  }, [logout, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
