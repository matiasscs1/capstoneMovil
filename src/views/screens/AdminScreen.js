import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import EstadisticasScreen from './EstadisticasAdminScreen.js';
import EvidenciasScreen from './EvidenciasAdminScreen.js';
import ConfiguracionScreen from './ConfiguracionAdminScreen.js';
import PanelModeracion from './ModeracionAdminScreen.js';
import LogoutScreen from './LogoutScreen.js';
import Loader from '../components/Loader.js';

const Tab = createBottomTabNavigator();

export default function AdminScreen() {
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

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
            fontSize: 10,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Estadísticas') {
              iconName = 'chart-bar';
            } else if (route.name === 'Evidencias') {
              iconName = focused ? 'folder' : 'folder-outline';
            } else if (route.name === 'Moderación') {
              iconName = focused ? 'shield-check' : 'shield-check-outline';
            } else if (route.name === 'Configuración') {
              iconName = focused ? 'cog' : 'cog-outline';
            } else if (route.name === 'Logout') {
              iconName = focused ? 'logout' : 'logout-variant';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
        screenListeners={{
          tabPress: e => {
            if (!isFirstRender.current) {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 800);
            } else {
              isFirstRender.current = false;
            }
          },
        }}
      >
        <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
        <Tab.Screen name="Evidencias" component={EvidenciasScreen} />
        <Tab.Screen name="Moderación" component={PanelModeracion} />
        <Tab.Screen name="Configuración" component={ConfiguracionScreen} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
      </Tab.Navigator>
    </>
  );
}