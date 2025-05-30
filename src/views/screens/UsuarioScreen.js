import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import InicioScreen from './InicioScreen.js';
import CalendarioScreen from './CalendarioScreen.js';
import TerranovaFeedScreen from './FeedUsuarioScreen.js';
import EstadisticasScreen from './EstadisticasScreen.js';
import Loader from '../components/Loader.js';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator();

function MainTabs({ setCurrentTitle }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: '#f57c00',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#ccc',
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Publicaciones') {
            iconName = focused ? 'post' : 'post-outline';
          } else if (route.name === 'Calendario') {
            iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          } else if (route.name === 'Estadísticas') {
            iconName = focused ? 'chart-bar' : 'chart-bar';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        children={() => <InicioScreen setCurrentTitle={setCurrentTitle} />}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Publicaciones"
        children={() => <TerranovaFeedScreen setCurrentTitle={setCurrentTitle} />}
        options={{ title: 'Publicaciones' }}
      />
      <Tab.Screen
        name="Calendario"
        children={() => <CalendarioScreen setCurrentTitle={setCurrentTitle} />}
        options={{ title: 'Calendario' }}
      />
      <Tab.Screen
        name="Estadísticas"
        children={() => <EstadisticasScreen setCurrentTitle={setCurrentTitle} />}
        options={{ title: 'Estadísticas' }}
      />
    </Tab.Navigator>
  );
}

export default function UsuarioScreen() {
  const navigation = useNavigation(); // <-- aquí obtenemos navigation con el hook
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Terranova');

  const handlePerfil = () => {
    setMenuVisible(false);
    navigation.navigate('Perfil');
  };

  const handleConfiguracion = () => {
    setMenuVisible(false);
    navigation.navigate('Configuracion');
  };

  const handleCerrarSesion = async () => {
    setMenuVisible(false);
    setLoading(true);
    try {
      await AsyncStorage.removeItem('token'); // Cambia 'token' por tu key real
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setLoading(false);
      console.error('Error al cerrar sesión', error);
    }
  };

  const UserMenuModal = () => (
    <Modal
      visible={menuVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setMenuVisible(false)}
        activeOpacity={1}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItemContainer} onPress={handlePerfil}>
            <MaterialCommunityIcons name="account" size={24} color="#1e3a8a" />
            <Text style={styles.menuItem}>Mi Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemContainer} onPress={handleConfiguracion}>
            <MaterialCommunityIcons name="cog" size={24} color="#1e3a8a" />
            <Text style={styles.menuItem}>Recompensa</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={[styles.menuItemContainer, styles.logoutContainer]}
            onPress={handleCerrarSesion}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
            <Text style={[styles.menuItem, styles.logoutText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Loader visible={loading} />

      <CustomHeader title={currentTitle} onMenuPress={() => setMenuVisible(true)} />

      <MainTabs setCurrentTitle={setCurrentTitle} />

      <UserMenuModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 60,
    marginRight: 10,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItem: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  logoutContainer: {
    marginTop: 4,
  },
  logoutText: {
    color: '#ef4444',
  },
});
