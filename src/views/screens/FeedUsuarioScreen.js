import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
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
import { styles } from '../../styles/FeedScreen.styles.js';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader.js';
import { useAuth } from '../../context/AuthContext.js';
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
    toggleLike,
    cargarComentarios,
    crearComent,
    editarComent,
    eliminarComent,
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

  const [comentarioLoading, setComentarioLoading] = useState(false);
  const [comentarioError, setComentarioError] = useState(null);
  const { user } = useAuth();

  const currentUserId = user?.id;

  // === Solicita permisos de galería una sola vez ===
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

  // === Enriquecer publicaciones con info de autor ===
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

  // === Listener de teclado para mover input ===
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

  // === MODAL DE COMENTARIOS ===
  const abrirModalComentarios = async (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    try {
      if (!publicacion.id_publicacion) throw new Error('No hay id_publicacion');
      const listaComentarios = await cargarComentarios(publicacion.id_publicacion);
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
    setComentarioError(null);
  };

  // === LIKES ===
  const manejarLike = async (publicacion) => {
    // Aquí asumes que currentUserId está definido como tu id de usuario logueado
    const id_publicacion = publicacion.id_publicacion || publicacion._id;
    try {
      // Actualización local optimista
      setPublicacionesConAutor((prev) =>
        prev.map((item) => {
          if ((item.id_publicacion || item._id) === id_publicacion) {
            // ¿El usuario ya dio like?
            const yaDioLike = item.likes?.includes(currentUserId);
            let newLikes;
            if (yaDioLike) {
              // Quitar like
              newLikes = item.likes.filter((id) => id !== currentUserId);
            } else {
              // Dar like
              newLikes = [...(item.likes || []), currentUserId];
            }
            return { ...item, likes: newLikes };
          }
          return item;
        })
      );
      // Luego, sincronizas con el backend
      await toggleLike(id_publicacion);
      // (opcional) Si quieres volver a cargar desde el backend por si acaso:
      // await cargarPublicaciones();
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el like');
      // (opcional) podrías revertir el cambio local si falla
      await cargarPublicaciones();
    }
  };


  // === FORMATEO FECHA ===
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

  // === MODAL NUEVA PUBLICACIÓN ===
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

  // === COMENTARIOS: enviar, editar, eliminar ===
  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    if (!publicacionSeleccionada?.id_publicacion) {
      Alert.alert("Error", "No se puede comentar: falta id_publicacion");
      return;
    }
    setComentarioLoading(true);
    setComentarioError(null);

    try {
      const response = await crearComent(
        publicacionSeleccionada.id_publicacion,
        nuevoComentario.trim()
      );
      // Checa aquí si viene un error en el body
      if (response && response.error) {
        Alert.alert('Contenido inapropiado', response.error);
        return;
      }
      const listaActualizada = await cargarComentarios(publicacionSeleccionada.id_publicacion);
      setComentarios(listaActualizada || []);
      setNuevoComentario('');
      inputComentarioRef.current?.blur();
    } catch (err) {
      // Aquí sigue con el catch por si acaso hay un error de red
      if (
        (err.response && err.response.status === 400) ||
        (err.status === 400)
      ) {
        Alert.alert('Contenido inapropiado', 'El contenido de tu comentario ha sido marcado como inapropiado.');
      } else if (err.message) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'No se pudo enviar el comentario');
      }
    } finally {
      setComentarioLoading(false);
    }
  };





  // EDITAR comentario
  const handleEditarComentario = (comentario) => {
  Alert.prompt(
    "Editar comentario",
    "",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Guardar",
        onPress: async (nuevoTexto) => {
          if (!nuevoTexto || !nuevoTexto.trim()) return;
          try {
            const response = await editarComent(comentario.id_comentario, nuevoTexto.trim());
            if (response && response.error) {
              Alert.alert('Contenido inapropiado', response.error);
              return;
            }
            const listaActualizada = await cargarComentarios(publicacionSeleccionada.id_publicacion);
            setComentarios(listaActualizada || []);
            Toast.show({ type: 'success', text1: 'Comentario editado' });
          } catch (err) {
            if (
              (err.response && err.response.status === 400) ||
              (err.status === 400)
            ) {
              Alert.alert('Contenido inapropiado', 'El contenido de tu comentario ha sido marcado como inapropiado.');
            } else if (err.message) {
              Alert.alert("Error", err.message || "No se pudo editar");
            } else {
              Alert.alert("Error", "No se pudo editar");
            }
          }
        }
      }
    ],
    "plain-text",
    comentario.texto
  );
};



  // ELIMINAR comentario
  const handleEliminarComentario = (comentario) => {
    Alert.alert(
      "Eliminar comentario",
      "¿Estás seguro de eliminar este comentario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarComent(comentario.id_comentario);
              const listaActualizada = await cargarComentarios(publicacionSeleccionada.id_publicacion);
              setComentarios(listaActualizada || []);
              Toast.show({ type: 'success', text1: 'Comentario eliminado' });
            } catch (err) {
              Alert.alert("Error", err.message || "No se pudo eliminar");
            }
          }
        }
      ]
    );
  };

  // === RENDER ===
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.nombreComentario}>{item.autor?.nombre || 'Anonimo'}</Text>
                      <Text style={styles.textoComentario}>{item.texto}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                      {/* Botón editar */}
                      <TouchableOpacity onPress={() => handleEditarComentario(item)} style={{ padding: 6 }}>
                        <Ionicons name="create-outline" size={18} color="#666" />
                      </TouchableOpacity>
                      {/* Botón eliminar */}
                      <TouchableOpacity onPress={() => handleEliminarComentario(item)} style={{ padding: 6 }}>
                        <Ionicons name="trash-outline" size={18} color="#e53935" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
              style={styles.listaComentarios}
            />

            {comentarioError && (
              <Text style={{ color: "red", marginTop: 8, textAlign: "center" }}>{comentarioError}</Text>
            )}
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
                editable={!comentarioLoading}
              />
              <TouchableOpacity
                onPress={enviarComentario}
                disabled={nuevoComentario.trim().length === 0 || comentarioLoading}
                style={[
                  styles.botonEnviar,
                  (nuevoComentario.trim().length === 0 || comentarioLoading) && styles.botonEnviarDisabled,
                ]}
              >
                {comentarioLoading ? (
                  <Text style={{ color: "#fff" }}>...</Text>
                ) : (
                  <Ionicons name="send" size={24} color="#fff" />
                )}
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
