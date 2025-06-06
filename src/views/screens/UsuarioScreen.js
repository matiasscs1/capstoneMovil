import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import InicioScreen from './InicioScreen'; // Participar
import CalendarioScreen from './CalendarioScreen';
import EstadisticasScreen from './EstadisticasScreen';
import TerranovaFeedScreen from './FeedUsuarioScreen';
import Loader from '../components/Loader';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator();

function MainTabs({ setCurrentTitle }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: '#f57c00',
        tabBarStyle: { backgroundColor: 'white', borderTopColor: '#ccc' },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Participar')iconName = focused ? 'gift' : 'gift-outline';
          if (route.name === 'Publicaciones') iconName = focused ? 'post' : 'post-outline';
          if (route.name === 'Calendario') iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          if (route.name === 'Estadísticas') iconName = focused ? 'chart-bar' : 'chart-bar';

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Publicaciones" component={TerranovaFeedScreen} />
      <Tab.Screen name="Participar" component={InicioScreen} />
      <Tab.Screen name="Calendario" component={CalendarioScreen} />
      <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
    </Tab.Navigator>
  );
}

export default function UsuarioScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Terranova');

  const handlePerfil = () => {
    setMenuVisible(false);
    navigation.navigate('Perfil');
  };

  const handleConfiguracion = () => {
    setMenuVisible(false);
    navigation.navigate('Recompensas');
  };

  const handleCerrarSesion = async () => {
    setMenuVisible(false);
    setLoading(true);
    try {
      await AsyncStorage.removeItem('token'); // Cambia 'token' por tu key real
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      setLoading(false);
      console.error('Error al cerrar sesión', error);
    }
  };

  const UserMenuModal = () => (
    <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
      <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)} activeOpacity={1}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItemContainer} onPress={handlePerfil}>
            <MaterialCommunityIcons name="account" size={24} color="#1e3a8a" />
            <Text style={styles.menuItem}>Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer} onPress={handleConfiguracion}>
            <MaterialCommunityIcons name="cog" size={24} color="#1e3a8a" />
            <Text style={styles.menuItem}>Recompensas</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={[styles.menuItemContainer, styles.logoutContainer]} onPress={handleCerrarSesion}>
            <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
            <Text style={[styles.menuItem, styles.logoutText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Agregar un listener para cargar la pantalla al hacer clic
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCurrentTitle('Participar');
    });

    return unsubscribe;
  }, [navigation]);

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
