import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel.js';
import Loader from '../components/Loader.js';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function ForgotPassword({ navigation }) {
  const {
    correoRecuperacion,
    setCorreoRecuperacion,
    codigoRecuperacion,
    setCodigoRecuperacion,
    nuevaContrasenia,
    setNuevaContrasenia,
    solicitarRecuperacionContrasenia,
    cambiarContraseniaRecuperacion,
    loading,
  } = useAuthViewModel();

  const [step, setStep] = useState(1); // 1: Email, 2: Modal con código y nueva contraseña

  const handleSolicitarCodigo = async () => {
    if (!correoRecuperacion.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa tu correo electrónico',
      });
      return;
    }

    try {
      await solicitarRecuperacionContrasenia();
      Toast.show({
        type: 'success',
        text1: 'Código enviado',
        text2: 'Revisa tu correo electrónico para obtener el código de recuperación',
      });
      setStep(2);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo enviar el código',
      });
    }
  };

  const handleCambiarContrasenia = async () => {
    if (!codigoRecuperacion.trim() || !nuevaContrasenia.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return;
    }

    if (nuevaContrasenia.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    try {
      await cambiarContraseniaRecuperacion();
      Toast.show({
        type: 'success',
        text1: 'Contraseña cambiada',
        text2: 'Tu contraseña ha sido actualizada exitosamente',
      });
      setStep(1);
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo cambiar la contraseña',
      });
    }
  };

  const renderStepOne = () => (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Image source={require('../../../assets/logoterra.png')} style={styles.logo} />
      
   

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        value={correoRecuperacion}
        onChangeText={setCorreoRecuperacion}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSolicitarCodigo}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Volver al login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Image source={require('../../../assets/logoterra.png')} style={styles.logo} />
      
      

      <TextInput
        style={styles.input}
        placeholder="Código de recuperación"
        placeholderTextColor="#aaa"
        value={codigoRecuperacion}
        onChangeText={setCodigoRecuperacion}
        keyboardType="numeric"
        maxLength={6}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor="#aaa"
        value={nuevaContrasenia}
        onChangeText={setNuevaContrasenia}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCambiarContrasenia}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Cambiar contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={styles.link}>Volver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.3,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#FF8C00',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 15,
  },
});