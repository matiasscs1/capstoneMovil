import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../context/AuthContext";

// Importa tus componentes
import Feed from "../screens/RepresentanteFeedScreen.js"; 
import CalendarioScreen from "./CalendarioScreen";
import PerfilScreen from "./PerfilScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DropdownMenu = ({ visible, onClose, navigation, onLogout }) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                onClose();
                await onLogout();
                navigation.replace("Login");
              }}
            >
              <Text style={[styles.menuItemText, styles.logoutText]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Stack Navigator para las publicaciones
function PublicacionesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedMain" component={Feed} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      {/* Agrega aquí otras pantallas relacionadas con publicaciones */}
    </Stack.Navigator>
  );
}

export default function SimpleUserScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useAuth();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "#f57c00",
          headerTitleAlign: "left",
          headerTitle: () => {
            let title = "";
            if (route.name === "Publicaciones") title = "Feed";
            if (route.name === "Calendario") title = "Calendario";
            return <Text style={styles.headerTitle}>{title}</Text>;
          },
          headerRight: () => (
            <TouchableOpacity onPress={openMenu} style={{ marginRight: 10 }}>
              <MaterialCommunityIcons
                name="menu"
                size={30}
                color="#f57c00"
              />
            </TouchableOpacity>
          ),
          tabBarActiveTintColor: "#1e3a8a",
          tabBarInactiveTintColor: "#f57c00",
          tabBarStyle: { 
            backgroundColor: "white", 
            borderTopColor: "#ccc",
            height: 85,
            paddingBottom: 8,
            paddingTop: 8,
            position: 'absolute',
            bottom: 0, 
            left: 20,
            right: 20,
            borderRadius: 15,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          tabBarLabelStyle: { 
            fontWeight: "bold", 
            fontSize: 12,
            marginTop: 4,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "Publicaciones") {
              iconName = focused ? "post" : "post-outline";
            } else if (route.name === "Calendario") {
              iconName = focused
                ? "calendar-month"
                : "calendar-month-outline";
            }
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Publicaciones"
          component={PublicacionesStackNavigator}
          options={{
            tabBarLabel: "Feed",
          }}
        />
        <Tab.Screen 
          name="Calendario" 
          component={CalendarioScreen}
          options={{
            tabBarLabel: "Calendario",
          }}
        />
      </Tab.Navigator>

      <DropdownMenu
        visible={menuVisible}
        onClose={closeMenu}
        navigation={navigation}
        onLogout={logout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: "#f57c00",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  menuContainer: {
    position: "absolute",
    top: 55, 
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    width: 160,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutText: {
    color: "#e74c3c",
    fontWeight: "600",
  },
});