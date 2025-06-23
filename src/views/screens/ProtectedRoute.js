import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // <-- Asegúrate que la ruta es correcta
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    // Si la carga ha terminado y NO hay usuario, redirigimos.
    // 'replace' evita que el usuario pueda volver atrás a la pantalla protegida.
    if (!loading && !user) {
      navigation.replace('Login');
    }
  }, [loading, user, navigation]); // Se ejecuta cuando 'loading' o 'user' cambian.

  // Mientras el contexto está cargando el usuario desde AsyncStorage,
  // mostramos una pantalla de carga. Esto es CRUCIAL.
  // Previene que 'children' (como PerfilScreen) se renderice prematuramente.
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  // Si la carga terminó y SÍ hay un usuario, renderizamos la pantalla solicitada.
  // Si no hay usuario, se renderizará 'null' por un instante antes de que el useEffect redirija,
  // lo cual es un comportamiento aceptable y no visible para el usuario.
  return user ? children : null;
};

// Añadimos estilos para que el loader se vea bien.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // O el color de fondo de tu app
  },
});

export default ProtectedRoute;