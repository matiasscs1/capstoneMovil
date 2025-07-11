import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./views/screens/LoginScreen";
import Verify2FAScreen from "./views/screens/Verify2FAScreen";
import RegisterScreen from "./views/screens/RegisterScreen";
import AdminScreen from "./views/screens/AdminScreen.js";
import HomeScreen from "./views/screens/HomeScreen";
import RepresentanteScreen from "./views/screens/RepresentanteFeedScreen.js"; 
import PerfilUsuariosScreen from "./views/screens/PerfilUsuariosScreen.js"; 
import LoginAdminScreen from "./views/screens/LoginAdminScreen";
import ForgotPassword from "./views/screens/RecuperarContrseniaUser.js";
import SimpleUserScreen from "./views/screens/RepresentanteMenuScreen";
import MenuAdminScreen from "./views/screens/ProfesorMenuScreen.js";
import UsuarioScreen from "./views/screens/UsuarioScreen.js";
import RecompensasScreen from "./views/screens/RecompensasScreen"; 
import InsigniasScreen from "./views/screens/InsigniasScreen.js";
import PerfilScreen from "./views/screens/PerfilScreen.js"
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

function ProtectedInsigniasScreen() {
  return (
    <ProtectedRoute>
      <InsigniasScreen />
    </ProtectedRoute>
  );
}

function ProtectedRepresentanteScreen() {
  return (
    <ProtectedRoute>
      <RepresentanteScreen />
    </ProtectedRoute>
  );
}

function ProtectedMenuRepresentanteScreen() {
  return (
    <ProtectedRoute>
      <SimpleUserScreen />
    </ProtectedRoute>
  );
}

function ProtectedMenuAdminScreen() {
  return (
    <ProtectedRoute>
      <MenuAdminScreen />
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
            headerShown: false,
          }}
        >
          {/* Pantallas de autenticación */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verify2FA" component={Verify2FAScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

          {/* Pantallas protegidas */}
          <Stack.Screen
            name="Usuario"
            component={ProtectedUsuarioScreen}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "Inicio" }}
          />

          <Stack.Screen
            name="MenuAdmin"
            component={ProtectedMenuAdminScreen}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "MenuAdmin" }}
          />

          <Stack.Screen
            name="MenuRepresentante"
            component={ProtectedMenuRepresentanteScreen}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "MenuRepresentante" }}
          />

          <Stack.Screen
            name="Representante"
            component={ProtectedRepresentanteScreen}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "Representante" }}
          />

          <Stack.Screen
            name="Admin"
            component={ProtectedAdminScreen}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "Administración" }}
          />

          <Stack.Screen
            name="Recompensas"
            component={ProtectedRouteWrapper(RecompensasScreen)}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "Recompensas" }}
          />

          <Stack.Screen
            name="Insignias"
            component={ProtectedRouteWrapper(InsigniasScreen)}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "Insignias" }}
          />

          {/* Pantalla de perfil propio */}
          <Stack.Screen
            name="Perfil"
            component={ProtectedRouteWrapper(PerfilScreen)}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title={route.params?.title || route.name}
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
            initialParams={{ title: "Perfil" }}
          />

          {/* NUEVA RUTA: PerfilUsuariosScreen */}
          <Stack.Screen
            name="PerfilUsuariosScreen"
            component={ProtectedRouteWrapper(PerfilUsuariosScreen)}
            options={({ route }) => ({
              header: ({ navigation, route }) => (
                <CustomHeader
                  title="Perfil de Usuario"
                  onMenuPress={() => setMenuVisible(true)}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

// Helper para envolver componentes con ProtectedRoute inline
function ProtectedRouteWrapper(Component) {
  return function WrappedComponent(props) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}