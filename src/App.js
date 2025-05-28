import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./views/screens/LoginScreen";
import Verify2FAScreen from "./views/screens/Verify2FAScreen";
import RegisterScreen from "./views/screens/RegisterScreen";
import AdminScreen from "./views/screens/AdminScreen.js";

import HomeScreen from "./views/screens/HomeScreen";
import LoginAdminScreen from "./views/screens/LoginAdminScreen";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./views/screens/ProtectedRoute";
import Toast from "react-native-toast-message";
import { toastConfig } from "./views/components/ToastConfig.js";
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verify2FA" component={Verify2FAScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
          <Stack.Screen name="Home"
            options={{
              headerLeft: () => null,
              gestureEnabled: false,
              headerBackTitleVisible: false,  // <-- Oculta texto back (en iOS)
              headerShown: true,               // o false para ocultar todo el header
            }}

          >
            {() => (
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Admin"
            options={{
              headerLeft: () => null,
              gestureEnabled: false,
              headerBackTitleVisible: false,  // <-- Oculta texto back (en iOS)
              headerShown: true,               // o false para ocultar todo el header
            }}

          >
            {() => (
              <ProtectedRoute>
                <AdminScreen />
              </ProtectedRoute>
            )}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
