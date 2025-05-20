import React, { useEffect } from 'react';
import { View, Text, Button, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getPerfil } from "../../models/usuario.model.js";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  useEffect(() => {
    getPerfil().then((data) => console.log("✅ Perfil:", data));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>
        Bienvenido, {user.nombre} {user.apellido}
      </Text>
      <Text>Correo: {user.correo}</Text>
      <Text>Rol: {user.rol}</Text>
      {user.foto_perfil && (
        <Image
          source={{ uri: user.foto_perfil }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      )}
      <Button
        title="Cerrar sesión"
        onPress={() => {
          logout();
          navigation.replace("Login");
        }}
      />
    </View>
  );
}
