import React, { useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getPerfil } from '../../models/auth.model.js';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    getPerfil().then((data) => console.log('Perfil:', data));
  }, []);

  if (!user) return null;

  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenido, {user.nombre} {user.apellido}</Text>
      <Text>Correo: {user.correo}</Text>
      <Text>Rol: {user.rol}</Text>

      {user.foto_perfil && (
        <Image
          source={{ uri: user.foto_perfil }}
          style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
        />
      )}

      <Button
        title="Cerrar sesión"
        onPress={() => {
          logout();
          setTimeout(() => navigation.replace('Login'), 0);
        }}
      />
    </View>
  );
}
