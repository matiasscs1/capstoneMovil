import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import EstadisticasScreen from './EstadisticasAdminScreen.js';
import EvidenciasScreen from './EvidenciasAdminScreen.js';
import ConfiguracionScreen from './ConfiguracionAdminScreen.js';
import LogoutScreen from './LogoutScreen.js';
import Loader from '../components/Loader.js';

const Tab = createBottomTabNavigator();

export default function AdminScreen() {
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true); // Para evitar loading en primer render

  return (
    <>
      <Loader visible={loading} />

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

            if (route.name === 'Estadísticas') {
              iconName = 'chart-bar';
            } else if (route.name === 'Evidencias') {
              iconName = focused ? 'folder' : 'folder-outline';
            } else if (route.name === 'Configuración') {
              iconName = focused ? 'cog' : 'cog-outline';
            } else if (route.name === 'Logout') {
              iconName = focused ? 'logout' : 'logout-variant';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
        // Capturamos evento onTabPress para activar loader
        screenListeners={{
          tabPress: e => {
            // Solo mostrar loading si no es el primer render
            if (!isFirstRender.current) {
              setLoading(true);
              // Simulamos carga con delay, luego ocultamos loader
              setTimeout(() => {
                setLoading(false);
              }, 800); // 800 ms (ajusta como prefieras)
            } else {
              isFirstRender.current = false;
            }
          },
        }}
      >
        <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
        <Tab.Screen name="Evidencias" component={EvidenciasScreen} />
        <Tab.Screen name="Configuración" component={ConfiguracionScreen} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
      </Tab.Navigator>
    </>
  );
}
