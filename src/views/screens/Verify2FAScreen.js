import React from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { useAuth } from '../../context/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Verify2FAScreen() {
  const { codigo, setCodigo, verify } = useAuthViewModel();
  const { loginWith2FA } = useAuth();
  const navigation = useNavigation();
  const { correo } = useRoute().params;

  const handleVerify = async () => {
    try {
      const { usuario } = await verify(correo);
      await loginWith2FA(usuario);
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('❌', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Código 2FA</Text>
      <TextInput keyboardType="numeric" value={codigo} onChangeText={setCodigo} />
      <Button title="Verificar código" onPress={handleVerify} />
    </View>
  );
}
