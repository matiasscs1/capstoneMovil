import React from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
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

      if (!usuario || !usuario.token) {
        Alert.alert('Error', 'Token o usuario inválido');
        return;
      }

      // Guarda el usuario y token en contexto y AsyncStorage
      await loginWith2FA(usuario, usuario.token);

      navigation.replace('Usuario');
    } catch (err) {
      Alert.alert('❌', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificación 2FA</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingrese código 2FA"
        keyboardType="numeric"
        value={codigo}
        onChangeText={setCodigo}
        maxLength={6}
      />
      <View style={styles.buttonContainer}>
        <Button title="Verificar código" onPress={handleVerify} color="#F57C00" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 80,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
});
