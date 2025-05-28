import React, { useState } from 'react';
import { styles} from '../../styles/LoginAdminScreen.style.js';

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
import { useAuth } from '../../context/AuthContext'; // <--- Importa el contexto

const { width } = Dimensions.get('window');

export default function LoginAdminScreen() {
  const {
    codigoAdmin,
    recuperarCodigo,
    setCodigoAdmin,
    loginUserAdmin,
    loading,
  } = useAuthViewModel();

  const { loginWith2FA } = useAuth(); // <--- Contexto para guardar user y token
  const [modalVisible, setModalVisible] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const navigation = useNavigation();

  const handleLoginAdmin = async () => {
    try {
      const res = await loginUserAdmin();

      // Guarda usuario y token en contexto y AsyncStorage
      await loginWith2FA(res.usuario, res.usuario.token);

      Toast.show({
        type: 'success',
        text1: 'Código Correcto',
        text2: 'Acceso concedido',
      });

      navigation.replace('Admin'); 
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

