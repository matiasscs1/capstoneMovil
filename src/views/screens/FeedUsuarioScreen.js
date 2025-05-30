import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader.js';
import { usePublicacionesViewModel } from '../../viewmodels/feedUsuariosViewModel.js';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

export default function Feed() {
  const {
    publicaciones,
    cargarPublicaciones,
    cargarDatosUsuario,
    crear,
    loading,
    toggleLikePublicacion,
    cargarComentarios,
    crearComentario,
  } = usePublicacionesViewModel();

  const [publicacionesConAutor, setPublicacionesConAutor] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [descripcionNueva, setDescripcionNueva] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  const [nuevoComentario, setNuevoComentario] = useState('');
  const inputComentarioRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a las fotos.');
      }
    })();
  }, []);

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

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  if (loading && publicacionesConAutor.length === 0) {
    return <Loader visible={true} />;
  }

  const abrirModalComentarios = async (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    try {
      const listaComentarios = await cargarComentarios(publicacion.id_publicacion || publicacion._id);
      setComentarios(listaComentarios || []);
      setModalComentariosVisible(true);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los comentarios');
    }
  };

  const cerrarModalComentarios = () => {
    setModalComentariosVisible(false);
    setComentarios([]);
    setPublicacionSeleccionada(null);
    setNuevoComentario('');
  };

  const manejarLike = async (publicacion) => {
    try {
      await toggleLikePublicacion(publicacion.id_publicacion || publicacion._id);
      await cargarPublicaciones();
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el like');
    }
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

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => {
    setDescripcionNueva('');
    setFotoUri(null);
    setModalVisible(false);
  };

  const seleccionarFoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setFotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería');
    }
  };

  const crearPublicacion = async () => {
    if (!descripcionNueva.trim()) {
      Alert.alert('Error', 'Escribe una descripción');
      return;
    }
    if (!fotoUri) {
      Alert.alert('Error', 'Selecciona una foto');
      return;
    }

    setSubiendo(true);

    try {
      const archivos = [
        {
          uri: fotoUri,
          name: 'foto.jpg',
          type: 'image/jpeg',
        },
      ];

      await crear(descripcionNueva, archivos);

      Alert.alert('¡Listo!', 'Publicación creada correctamente');

      await cargarPublicaciones();

      setDescripcionNueva('');
      setFotoUri(null);
      setModalVisible(false);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Contenido inapropiado',
        text2: err.message || 'Error desconocido',
      });
    } finally {
      setSubiendo(false);
    }
  };

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      await crearComentario(publicacionSeleccionada.id_publicacion || publicacionSeleccionada._id, nuevoComentario.trim());
      const listaActualizada = await cargarComentarios(publicacionSeleccionada.id_publicacion || publicacionSeleccionada._id);
      setComentarios(listaActualizada || []);
      setNuevoComentario('');
      inputComentarioRef.current?.blur();
    } catch {
      Alert.alert('Error', 'No se pudo enviar el comentario');
    }
  };

  return (
    <>
      <FlatList
        data={publicacionesConAutor}
        keyExtractor={(pub) => pub.id_publicacion || pub._id}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={cargarPublicaciones}
        renderItem={({ item: pub }) => {
          const autor = pub.autor || {};
          const fotoUsuario = autor.fotoUrl || 'https://via.placeholder.com/40';
          const imagenPublicacion = pub.imagenes?.[0]?.url;
          const likesCount = pub.likes?.length || 0;
          const userHasLiked = pub.likes?.some((like) => like === 'currentUserId');

          return (
            <View style={styles.card}>
              <View style={styles.header}>
                <Image source={{ uri: fotoUsuario }} style={styles.avatar} />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.nombreAutor}>{autor.nombre || 'Usuario'}</Text>
                  <Text style={styles.fechaHeader}>{formatearFechaLegible(pub.fechaPublicacion)}</Text>
                </View>
              </View>

              {imagenPublicacion && (
                <Image source={{ uri: imagenPublicacion }} style={styles.imagenPublicacion} />
              )}

              <Text style={styles.descripcion}>{pub.descripcion}</Text>

              <View style={styles.interaccionesRow}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => manejarLike(pub)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.iconoCorazon, userHasLiked && styles.corazonRojo]}>
                    ❤️
                  </Text>
                  <Text style={styles.likesCount}>{likesCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.comentariosButton}
                  onPress={() => abrirModalComentarios(pub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.iconoComentario}>💬</Text>
                  <Text style={styles.comentariosCount}>{comentarios.length || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Modal Comentarios */}
      <Modal visible={modalComentariosVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.titulo}>Comentarios</Text>
              <TouchableOpacity onPress={cerrarModalComentarios} style={styles.cerrarBtn}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={comentarios}
              keyExtractor={(item) => item._id || item.id || Math.random().toString()}
              renderItem={({ item }) => (
                <View style={styles.comentarioContainer}>
                  <Text style={styles.nombreComentario}>{item.autor?.nombre || 'Anonimo'}</Text>
                  <Text style={styles.textoComentario}>{item.texto}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
              style={styles.listaComentarios}
            />

            <View style={[styles.inputContainer, keyboardVisible && { marginBottom: 12 }]}>
              <TextInput
                ref={inputComentarioRef}
                style={styles.input}
                placeholder={`Agrega un comentario para ${publicacionSeleccionada?.autor?.nombre || 'usuario'}`}
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
                multiline
                returnKeyType="send"
                onSubmitEditing={enviarComentario}
                blurOnSubmit={true}
              />

              <TouchableOpacity
                onPress={enviarComentario}
                disabled={nuevoComentario.trim().length === 0}
                style={[
                  styles.botonEnviar,
                  nuevoComentario.trim().length === 0 && styles.botonEnviarDisabled,
                ]}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Botón flotante para crear publicación */}
      <TouchableOpacity style={styles.fab} onPress={abrirModal} activeOpacity={0.7}>
        <View style={styles.cameraIcon}>
          <View style={styles.cameraBody}>
            <View style={styles.cameraLens} />
          </View>
          <View style={styles.cameraFlash} />
        </View>
      </TouchableOpacity>

      {/* Modal para crear publicación */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={cerrarModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <TouchableOpacity style={styles.botonFoto} onPress={seleccionarFoto}>
              <Text style={styles.botonFotoTexto}>Seleccionar imagen</Text>
            </TouchableOpacity>

            {fotoUri && <Image source={{ uri: fotoUri }} style={styles.previsualizacionFoto} />}

            <TextInput
              style={styles.input}
              placeholder="Descripción"
              multiline
              value={descripcionNueva}
              onChangeText={setDescripcionNueva}
            />

            <View style={styles.botonesRow}>
              <TouchableOpacity style={[styles.boton, styles.botonCancelar]} onPress={cerrarModal}>
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, styles.botonPublicar]}
                onPress={crearPublicacion}
                disabled={subiendo}
              >
                <Text style={styles.botonTexto}>{subiendo ? 'Subiendo...' : 'Publicar'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  nombreAutor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  fechaHeader: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  imagenPublicacion: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
  },
  descripcion: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  interaccionesRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  iconoCorazon: {
    fontSize: 20,
    color: '#999',
    marginRight: 5,
  },
  corazonRojo: {
    color: 'red',
  },
  likesCount: {
    fontSize: 14,
    color: '#333',
  },
  comentariosButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoComentario: {
    fontSize: 20,
    color: '#999',
    marginRight: 5,
  },
  comentariosCount: {
    fontSize: 14,
    color: '#333',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: 'white',
    height: screenHeight * 0.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 50,
    marginBottom: 0,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cerrarBtn: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  comentarioContainer: {
    marginBottom: 20,
  },
  nombreComentario: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  textoComentario: {
    fontSize: 14,
    color: '#222',
  },
  listaComentarios: {
    flexGrow: 1,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 20,
    marginTop: 10,
  },
  input: {
    flex: 1,
    maxHeight: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    color: '#222',
  },
  botonEnviar: {
    backgroundColor: '#f57c00',
    padding: 10,
    borderRadius: 25,
    marginLeft: 8,
  },
  botonEnviarDisabled: {
    backgroundColor: '#f57c00aa',
  },
  fab: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    backgroundColor: '#f57c00',
    width: 65,
    height: 65,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cameraIcon: {
    width: 28,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBody: {
    width: 24,
    height: 18,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 3,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLens: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  cameraFlash: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 6,
    height: 4,
    borderRadius: 1,
    backgroundColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 100,
  },
  botonFoto: {
    backgroundColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  botonFotoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previsualizacionFoto: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  botonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  botonPublicar: {
    backgroundColor: '#f57c00',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
