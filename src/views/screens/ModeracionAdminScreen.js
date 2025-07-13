import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePublicacionesViewModel } from '../../viewmodels/feedUsuariosViewModel';
import { styles } from '../../styles/ModeracionAdmin.styles.js';

const { width } = Dimensions.get('window');

const PanelModeracion = () => {
  const {
    publicaciones,
    loading,
    error,
    cargarPublicaciones,
    eliminar,
    cargarDatosUsuario
  } = usePublicacionesViewModel();

  const [publicacionesReportadas, setPublicacionesReportadas] = useState([]);
  const [usuariosData, setUsuariosData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarPublicacionesReportadas();
  }, []);

  const cargarPublicacionesReportadas = async () => {
    try {
      // Cargar todas las publicaciones
      const todasLasPublicaciones = await cargarPublicaciones();
      
      // Aquí puedes filtrar las que necesitan moderación
      setPublicacionesReportadas(todasLasPublicaciones);
      
      // Cargar datos de usuarios para cada publicación
      const usuarios = {};
      for (const pub of todasLasPublicaciones) {
        if (!usuarios[pub.autorId]) {
          try {
            const datosUsuario = await cargarDatosUsuario(pub.autorId);
            usuarios[pub.autorId] = datosUsuario;
          } catch (err) {
            usuarios[pub.autorId] = { nombre: 'Usuario', apellido: 'desconocido' };
          }
        }
      }
      setUsuariosData(usuarios);
    } catch (err) {
      console.error('Error cargando publicaciones:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarPublicacionesReportadas();
    setRefreshing(false);
  };

  const handleVerDetalles = (publicacion) => {
    Alert.alert(
      'Detalles de la publicación',
      `Descripción: ${publicacion.descripcion || 'Sin descripción'}\nAutor: ${getNombreUsuario(publicacion.autorId)}\nFecha: ${formatearFecha(publicacion.fechaPublicacion)}`,
      [{ text: 'Cerrar' }]
    );
  };

  const handleEliminar = (publicacion) => {
    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de que quieres eliminar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminar(publicacion.id_publicacion);
              await cargarPublicacionesReportadas();
              Alert.alert('Éxito', 'Publicación eliminada correctamente');
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar la publicación: ' + err.message);
            }
          }
        }
      ]
    );
  };

  const getTipoContenido = (publicacion) => {
    if (publicacion.imagenes && publicacion.imagenes.length > 0) {
      return 'Publicación con imagen';
    }
    return 'Publicación de texto';
  };

  const getNombreUsuario = (autorId) => {
    const usuario = usuariosData[autorId];
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  if (loading && publicacionesReportadas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97B22" />
        <Text style={styles.loadingText}>Cargando contenido para moderar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="white" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Panel de Moderación</Text>
            <Text style={styles.subtitle}>Revisión de contenido multimedia</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Total de publicaciones: {publicacionesReportadas.length}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de publicaciones */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F97B22']}
            tintColor="#F97B22"
          />
        }
      >
        <View style={styles.grid}>
          {publicacionesReportadas.map((publicacion) => (
            <View key={publicacion.id_publicacion} style={styles.card}>
              {/* Imagen */}
              <View style={styles.imageContainer}>
                {publicacion.imagenes && publicacion.imagenes.length > 0 ? (
                  <Image 
                    source={{ uri: publicacion.imagenes[0].url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                  </View>
                )}
              </View>

              {/* Contenido */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {getTipoContenido(publicacion)}
                </Text>
                
                {/* Descripción */}
                {publicacion.descripcion && (
                  <Text style={styles.description} numberOfLines={2}>
                    {publicacion.descripcion}
                  </Text>
                )}
                
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Ionicons name="document-text-outline" size={16} color="#F97B22" />
                    <Text style={styles.infoText}>Publicación</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color="#F97B22" />
                    <Text style={styles.infoText}>{getNombreUsuario(publicacion.autorId)}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#F97B22" />
                    <Text style={styles.infoText}>{formatearFecha(publicacion.fechaPublicacion)}</Text>
                  </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleVerDetalles(publicacion)}
                  >
                    <Ionicons name="eye-outline" size={16} color="#F97B22" />
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleEliminar(publicacion)}
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío */}
        {publicacionesReportadas.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>
              No hay contenido para revisar
            </Text>
            <Text style={styles.emptyStateText}>
              Todas las publicaciones han sido moderadas correctamente.
            </Text>
          </View>
        )}
      </ScrollView>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
};



export default PanelModeracion;