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

import InicioScreen from "./InicioScreen";
import CalendarioScreen from "./CalendarioScreen";
import EstadisticasScreen from "./EstadisticasScreen";
import TerranovaFeedScreen from "./FeedUsuarioScreen";
import PerfilScreen from "./PerfilScreen";
import RecompensasScreen from "./RecompensasScreen";
import InsigniasScreen from "./InsigniasScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DropdownMenu = ({ visible, onClose, navigation, onLogout }) => {
  const menuItems = [
    { label: "Perfil", screen: "Perfil" },
    { label: "Recompensas", screen: "Recompensas" },
    { label: "Insignias", screen: "Insignias" },
  ];

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  navigation.navigate(item.screen);
                }}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.separator} />
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

function PublicacionesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={TerranovaFeedScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Recompensas" component={RecompensasScreen} />
      <Stack.Screen name="Insignias" component={InsigniasScreen} />
    </Stack.Navigator>
  );
}

export default function UsuarioScreen() {
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
            let title = route.name;
            if (route.name === "Publicaciones") title = "Terranova";
            if (route.name === "Participar") title = "Participar";
            if (route.name === "Calendario") title = "Calendario";
            if (route.name === "Estadísticas") title = "Estadísticas";
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
          tabBarStyle: { backgroundColor: "white", borderTopColor: "#ccc" },
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "Publicaciones") {
              iconName = focused ? "post" : "post-outline";
            } else if (route.name === "Participar") {
              iconName = focused ? "gift" : "gift-outline";
            } else if (route.name === "Calendario") {
              iconName = focused
                ? "calendar-month"
                : "calendar-month-outline";
            } else if (route.name === "Estadísticas") {
              iconName = "chart-bar";
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
        />
        <Tab.Screen name="Participar" component={InicioScreen} />
        <Tab.Screen name="Calendario" component={CalendarioScreen} />
        <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
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
    width: 180,
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
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  logoutText: {
    color: "#e74c3c",
  },
});