import React, { useState } from 'react';
import { styles } from '../../styles/RegisterScreen.style.js';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader.js';

const roles = ['estudiante', 'representante'];

export default function RegisterScreen({ navigation }) {
  const {
    correo,
    setCorreo,
    contrasenia,
    setContrasenia,
    codigo,
    setCodigo,
    loading,
    modalVisible,
    setModalVisible,
    registrarTemporal,
    verificarCodigoRegistro,
  } = useAuthViewModel();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [foto_perfil, setfoto_perfil] = useState(null);

  // Estado para controlar el modal del selector de rol
  const [modalRolVisible, setModalRolVisible] = useState(false);

  const handleSelectPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Activa el acceso a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setfoto_perfil(result.assets[0].uri);
    }
  };

  const formatFecha = (date) => {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const validarCorreo = (correo) => correo.includes('@') && correo.includes('.');

  const handleRegister = async () => {
    if (!nombre || !apellido || !correo || !fechaNacimiento || !contrasenia || !rol || !foto_perfil) {
      return Alert.alert('Faltan campos', 'Completa todos los campos.');
    }

    if (!validarCorreo(correo)) {
      return Alert.alert('Correo inválido', 'Incluye un @ y dominio válido.');
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);
    formData.append('contrasenia', contrasenia);
    formData.append('rol', rol); // <-- Aquí se agrega el rol seleccionado
    formData.append('fecha_nacimiento', fechaNacimiento.toISOString());
    formData.append('foto_perfil', {
      uri: foto_perfil,
      name: 'perfil.jpg',
      type: 'image/jpeg',
    });

    try {
      await registrarTemporal(formData);
      Toast.show({
        type: 'success',
        text1: 'Código enviado',
        text2: 'Revisa tu correo',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.message,
        text2: 'Contraseña insegura o su correo ya está registrado',
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verificarCodigoRegistro();
      Toast.show({
        type: 'success',
        text1: 'Registro exitoso',
        text2: 'Bienvenido a Terranova',
      });
      navigation.replace('Login');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error al registrarse',
        text2: err.message,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Loader visible={loading} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={handleSelectPhoto}>
          {foto_perfil ? (
            <Image source={{ uri: foto_perfil }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.plus}>+</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Apellido"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Selector de rol */}
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setModalRolVisible(true)}
        >
          <Text style={{ color: rol ? '#000' : '#aaa' }}>{rol || 'Seleccione un rol'}</Text>
        </TouchableOpacity>

        <Modal visible={modalRolVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setModalRolVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.modalRolContent}>
              <FlatList
                data={roles}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.rolOption}
                    onPress={() => {
                      setRol(item);
                      setModalRolVisible(false);
                    }}
                  >
                    <Text style={styles.rolOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity style={styles.input} onPress={() => setMostrarPicker(true)}>
          <Text style={{ color: '#000' }}>{formatFecha(fechaNacimiento)}</Text>
        </TouchableOpacity>

        {mostrarPicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setMostrarPicker(false);
              if (selectedDate) setFechaNacimiento(selectedDate);
            }}
          />
        )}

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={contrasenia}
          onChangeText={setContrasenia}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DE VERIFICACIÓN */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ingresa el código enviado al correo</Text>
            <TextInput
              style={styles.input}
              placeholder="Código"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={codigo}
              onChangeText={setCodigo}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.loginLink}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}


