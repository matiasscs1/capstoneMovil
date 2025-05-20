import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader.js';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function LoginAdminScreen() {
  const {
    codigoAdmin,
    recuperarCodigo,
    setCodigoAdmin,
    loginUserAdmin,
    loading,
  } = useAuthViewModel();
  const [modalVisible, setModalVisible] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const navigation = useNavigation();

  const handleLoginAdmin = async () => {
    try {
      const res = await loginUserAdmin();
      Toast.show({
        type: 'success',
        text1: 'Código Correcto',
        text2: 'Acceso concedido',
      });
      navigation.navigate('Home');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error en el código',
        text2: err.message,
      });
    }
  };

const handleRecuperarCodigo = async () => {
  const esCorreoValido = correoRecuperacion.includes('@') && correoRecuperacion.includes('.');
  if (!esCorreoValido) {
    Toast.show({
      type: 'error',
      text1: 'Correo inválido',
      text2: 'Debe contener @ y un dominio',
    });
    return;
  }

  try {
    const res = await recuperarCodigo(correoRecuperacion); 
    Toast.show({
      type: 'success',
      text1: 'Código enviado',
      text2: 'Revise su correo',
    });
    setModalVisible(false);
    setCorreoRecuperacion('');
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Error al enviar el código',
      text2: err.message,
    });
  }
};


  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Image source={require('../../../assets/logoterra.png')} style={styles.logo} />

      <TextInput
        style={styles.input}
        placeholder="Código de Administrador"
        placeholderTextColor="#aaa"
        value={codigoAdmin}
        onChangeText={setCodigoAdmin}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleLoginAdmin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.link}>¿Olvidó el código? Presione aquí</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Loader visible={loading} />
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar código</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              value={correoRecuperacion}
              onChangeText={setCorreoRecuperacion}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleRecuperarCodigo}>
              <Text style={styles.modalButtonText}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.link}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {

    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 60,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 10,
  },
  link: {
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    fontSize: width > 400 ? 18 : 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f57c00',
    paddingVertical: width > 400 ? 16 : 12,
    borderRadius: 25,
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width > 400 ? 20 : 18,
    textAlign: 'center',
  },


});
