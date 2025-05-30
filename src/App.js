import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";

import LoginScreen from "./views/screens/LoginScreen";
import Verify2FAScreen from "./views/screens/Verify2FAScreen";
import RegisterScreen from "./views/screens/RegisterScreen";
import AdminScreen from "./views/screens/AdminScreen.js";
import HomeScreen from "./views/screens/HomeScreen";
import LoginAdminScreen from "./views/screens/LoginAdminScreen";
import UsuarioScreen from "./views/screens/UsuarioScreen.js";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./views/screens/ProtectedRoute";
import Toast from "react-native-toast-message";
import { toastConfig } from "./views/components/ToastConfig.js";
import CustomHeader from "./views/components/CustomHeader";

const Stack = createNativeStackNavigator();

function ProtectedAdminScreen() {
  return (
    <ProtectedRoute>
      <AdminScreen />
    </ProtectedRoute>
  );
}

function ProtectedUsuarioScreen() {
  return (
    <ProtectedRoute>
      <UsuarioScreen />
    </ProtectedRoute>
  );
}

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false // Ocultamos el header globalmente
          }}
        >
          {/* Pantallas de autenticación (sin header) */}
          <Stack.Group>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
            />
            <Stack.Screen 
              name="Verify2FA" 
              component={Verify2FAScreen} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
            />
            <Stack.Screen 
              name="LoginAdmin" 
              component={LoginAdminScreen} 
            />
          </Stack.Group>

          <Stack.Group
            screenOptions={{
              header: ({ navigation, route }) => (
                <CustomHeader 
                  title={route.params?.title || route.name} 
                  onMenuPress={() => setMenuVisible(true)} 
                />
              ),
            }}
          >
            <Stack.Screen
              name="Usuario" 
              component={ProtectedUsuarioScreen}
              initialParams={{ title: 'Inicio' }}
            />

            <Stack.Screen
              name="Admin"
              component={ProtectedAdminScreen}
              initialParams={{ title: 'Administración' }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}