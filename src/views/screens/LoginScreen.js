import { styles } from '../../styles/LoginScreen.style.js';

import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader.js'; 
import Toast from 'react-native-toast-message'; 

export default function LoginScreen() {
  const {
    correo,
    setCorreo,
    contrasenia,
    setContrasenia,
    login,
    loading,
  } = useAuthViewModel();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const res = await login();
      Toast.show({
        type: 'success',
        text1: 'Código enviado',
        text2: 'Revisa tu correo',
      });
      navigation.navigate('Verify2FA', { correo });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: err.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} /> 

      {/* LOGO */}
      <Image
        source={require('../../../assets/logoterra.png')}
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

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿Nuevo Usuario? Crea una cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginAdmin')}>
        <Text style={styles.link}>¿Administrador? Presione Aquí</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}



