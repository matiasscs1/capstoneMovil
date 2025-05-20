import React from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { correo, setCorreo, contrasenia, setContrasenia, login } = useAuthViewModel();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login();
      Alert.alert('✅', 'Código 2FA enviado al correo');
      navigation.navigate('Verify2FA', { correo });
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require('../../../assets/logoterra.png')} // ajusta la ruta según tu proyecto
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={contrasenia}
        onChangeText={setContrasenia}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>¿Nuevo Usuario? Crea una cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>¿Administrador? Presione Aquí</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 80,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  link: {
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 25,
  },
});
