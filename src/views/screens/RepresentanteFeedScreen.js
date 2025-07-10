import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { styles } from '../../styles/FeedScreen.styles.js';
import Loader from '../components/Loader.js';
import { useAuth } from '../../context/AuthContext.js';
import { usePublicacionesViewModel } from '../../viewmodels/feedUsuariosViewModel.js';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

export default function RepresentanteScreen({ navigation }) {
  const {
    publicaciones,
    cargarPublicaciones,
    cargarDatosUsuario,
    loading,
    cargarComentarios,
  } = usePublicacionesViewModel();

  const [publicacionesConAutor, setPublicacionesConAutor] = useState([]);
  const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const { user } = useAuth();

  const currentUserId = user?.id_usuario;

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  useEffect(() => {
    const cargarAutores = async () => {
      if (!publicaciones || publicaciones.length === 0) {
        setPublicacionesConAutor([]);
        return;
      }
      const pubsEnriquecidas = await Promise.all(
        publicaciones.map(async (pub) => {
          try {
            const usuario = await cargarDatosUsuario(pub.autorId);
            const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
            const fotoPerfil = usuario.foto_perfil?.[0]?.url || null;
            return {
              ...pub,
              autor: {
                nombre: nombreCompleto || pub.autor?.nombre || 'Usuario',
                fotoUrl: fotoPerfil,
                rol: usuario.rol || pub.autor?.rol || '',
              },
            };
          } catch {
            return pub;
          }
        })
      );
      setPublicacionesConAutor(pubsEnriquecidas);
    };
    cargarAutores();
  }, [publicaciones]);

  if (loading && publicacionesConAutor.length === 0) {
    return <Loader visible={true} />;
  }

  // Función para navegar al perfil (solo lectura)
  const navegarAPerfil = (autorId) => {
    if (autorId === currentUserId) {
      navigation.navigate('Perfil');
    } else {
      navigation.navigate('PerfilUsuariosScreen', { userId: autorId });
    }
  };

  // Función para abrir modal de comentarios (solo lectura)
  const abrirModalComentarios = async (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    try {
      if (!publicacion.id_publicacion) throw new Error('No hay id_publicacion');
      const listaComentarios = await cargarComentarios(publicacion.id_publicacion);
      setComentarios(listaComentarios || []);
      setModalComentariosVisible(true);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  const cerrarModalComentarios = () => {
    setModalComentariosVisible(false);
    setComentarios([]);
    setPublicacionSeleccionada(null);
  };

  const formatearFechaLegible = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    if (isNaN(fecha)) return '';
    const opcionesFecha = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${fechaFormateada} a las ${hora}:${minutos}`;
  };

  return (
    <>
      <FlatList
        data={publicacionesConAutor}
        keyExtractor={(pub) => pub.id_publicacion?.toString() || pub._id?.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={cargarPublicaciones}
        renderItem={({ item: pub }) => {
          const autor = pub.autor || {};
          const fotoUsuario = autor.fotoUrl || 'https://via.placeholder.com/40';
          const imagenPublicacion = pub.imagenes?.[0]?.url;
          const likesCount = pub.likes?.length || 0;
          const userHasLiked = pub.likes?.includes(currentUserId);

          return (
            <View style={styles.card}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navegarAPerfil(pub.autorId)}
                  style={styles.autorContainer}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: fotoUsuario }} style={styles.avatar} />
                  <View style={styles.headerTextContainer}>
                    <Text style={[styles.nombreAutor, styles.nombreClickeable]}>
                      {autor.nombre || 'Usuario'}
                    </Text>
                    <Text style={styles.fechaHeader}>
                      {formatearFechaLegible(pub.fechaPublicacion)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              {imagenPublicacion && (
                <Image source={{ uri: imagenPublicacion }} style={styles.imagenPublicacion} />
              )}
              
              <Text style={styles.descripcion}>{pub.descripcion}</Text>
              
              <View style={styles.interaccionesRow}>
                {/* Solo mostrar likes sin permitir interacción */}
                <View style={styles.likeButton}>
                  <Text style={[styles.iconoCorazon, userHasLiked && styles.corazonRojo]}>
                    ❤️
                  </Text>
                  <Text style={styles.likesCount}>{likesCount}</Text>
                </View>
                
                {/* Solo mostrar comentarios sin permitir interacción */}
                <TouchableOpacity
                  style={styles.comentariosButton}
                  onPress={() => abrirModalComentarios(pub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.iconoComentario}>💬</Text>
                  <Text style={styles.comentariosCount}>
                    {pub.comentarios?.length || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Modal Comentarios - Solo Lectura */}
      <Modal visible={modalComentariosVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}
        >
          <View style={[styles.modalContainer, { height: screenHeight * 0.5 }]}>
            <View style={styles.header}>
              <Text style={styles.titulo}>Comentarios</Text>
              <TouchableOpacity onPress={cerrarModalComentarios} style={styles.cerrarBtn}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={comentarios}
              keyExtractor={(item, idx) => item.id_comentario?.toString() || idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.comentarioContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => navegarAPerfil(item.autorId)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.nombreComentario, styles.nombreClickeable]}>
                          {item.autor?.nombre || 'Anónimo'}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.textoComentario}>{item.texto}</Text>
                      <Text style={styles.fechaComentario}>
                        {formatearFechaLegible(item.fechaComentario)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 12 }}
              style={styles.listaComentarios}
              ListEmptyComponent={
                <Text style={styles.sinComentarios}>
                  No hay comentarios aún
                </Text>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}