import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "../../styles/PerfilUsuariosScreen.js";
import { usePerfilUsuarioViewModel } from "../../viewmodels/perfilUsuariosViewModel.js";
import { useAuth } from "../../context/AuthContext";
const { width } = Dimensions.get('window');

const mockProfile = {
  avatar: "https://i.pravatar.cc/150?u=maria",
};

export default function PerfilUsuariosScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const { user } = useAuth();
  const LOGGED_IN_USER_ID = user?.id_usuario;

  // Estados del ViewModel
  const {
    loading,
    error,
    publicaciones,
    comentarios,
    datosUsuario,
    insignias,
    cargarDatosUsuario,
    cargarPublicacionesUsuario,
    cargarInsigniasUsuario,
    toggleLike,
    borrarPublicacion,
    cargarComentarios,
    agregarComentario,
    actualizarComentario,
    borrarComentario,
    cargarSeguimientosUsuario,
    seguirUsuario,
    limpiarEstados,
  } = usePerfilUsuarioViewModel();


  const [selectedInsignia, setSelectedInsignia] = useState(null);
  const [insigniaModalVisible, setInsigniaModalVisible] = useState(false);
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState(null);
  const [estadoSeguimiento, setEstadoSeguimiento] = useState({
    siguiendo: false,
    cargando: true, // Cambiado a true para mostrar loading desde el inicio
    seguidores: 0,
    seguidos: 0
  });

  // Estados para publicaciones y comentarios
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Estados de carga
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Función para cargar el estado de seguimiento inmediatamente
  const cargarEstadoSeguimiento = async (id) => {
    if (!id || !LOGGED_IN_USER_ID) {
      return;
    }

    try {
      const seguimientos = await cargarSeguimientosUsuario(id);
      const usuarioActualSigue = seguimientos.seguidores.some(
        seg => seg.id_usuario.toString() === LOGGED_IN_USER_ID.toString()
      );

      setEstadoSeguimiento({
        siguiendo: usuarioActualSigue,
        cargando: false,
        seguidores: seguimientos.seguidores.length,
        seguidos: seguimientos.seguidos.length
      });
    } catch (error) {
      console.error('Error cargando estado de seguimiento:', error); // Este sí es útil mantenerlo
      setEstadoSeguimiento(prev => ({ ...prev, cargando: false }));
    }
  };

  // Cargar datos del perfil (sin estado de seguimiento)
  const cargarPerfilUsuario = async (id) => {
    if (!id) {
      setErrorPerfil('No se especificó el usuario');
      return;
    }

    setLoadingPerfil(true);
    setErrorPerfil(null);

    try {
      // Cargar datos básicos del usuario
      const datosUsuario = await cargarDatosUsuario(id);
      if (!datosUsuario) throw new Error('No se encontraron datos del usuario');
      setPerfilUsuario(datosUsuario);

      // Cargar publicaciones
      await Promise.all([
        cargarPublicacionesUsuario(id),
        cargarInsigniasUsuario(id)
      ]);

    } catch (error) {
      console.error('Error cargando perfil:', error);
      setErrorPerfil('No se pudo cargar el perfil del usuario');
    } finally {
      setLoadingPerfil(false);
    }
  };

  const toggleSeguirUsuario = async () => {
    if (estadoSeguimiento.cargando) return;

    setEstadoSeguimiento(prev => ({ ...prev, cargando: true }));

    try {
      // Convertir userId a string para consistencia
      const resultado = await seguirUsuario(userId.toString(), LOGGED_IN_USER_ID.toString());

      setEstadoSeguimiento(prev => ({
        ...prev,
        siguiendo: resultado.siguiendo,
        cargando: false,
        seguidores: resultado.siguiendo ? prev.seguidores + 1 : prev.seguidores - 1
      }));

      Alert.alert(
        'Éxito',
        resultado.siguiendo ? 'Ahora sigues a este usuario' : 'Has dejado de seguir a este usuario'
      );

    } catch (error) {
      console.error('Error al cambiar estado de seguimiento:', error);
      Alert.alert('Error', error.message || 'No se pudo completar la acción');
      setEstadoSeguimiento(prev => ({ ...prev, cargando: false }));
    }
  };

  // Efectos
  useEffect(() => {
    if (userId) {
      // Cargar perfil y estado de seguimiento en paralelo
      cargarPerfilUsuario(userId);
      cargarEstadoSeguimiento(userId);
    } else {
      setErrorPerfil('No se especificó el usuario');
    }

    return () => limpiarEstados();
  }, [userId]);

  useEffect(() => {
    if (errorPerfil) {
      Alert.alert('Error', errorPerfil, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [errorPerfil, navigation]);

  const openInsigniaDetail = (insignia) => {
    setSelectedInsignia(insignia);
    setInsigniaModalVisible(true);
  };

  const closeInsigniaDetail = () => {
    setSelectedInsignia(null);
    setInsigniaModalVisible(false);
  };

  // Funciones para manejar publicaciones
  const openPost = (post) => {
    setSelectedPost(post);
    setPostDetailModalVisible(true);
  };

  const closePost = () => {
    setSelectedPost(null);
    setPostDetailModalVisible(false);
  };

  const handleLike = async () => {
    if (!selectedPost || isLiking) return;
    setIsLiking(true);
    try {
      const updated = await toggleLike(selectedPost.id_publicacion);
      setSelectedPost(prev => ({
        ...prev,
        cantidadLikes: updated.cantidadLikes,
        meGusta: updated.meGusta,
      }));
    } catch (error) {
      console.error('Error al dar like:', error);
      Alert.alert("Error", "No se pudo procesar el like.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = () => {
    if (!selectedPost || isDeletingPost) return;
    Alert.alert("Eliminar publicación", "¿Confirmar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setIsDeletingPost(true);
          try {
            await borrarPublicacion(selectedPost.id_publicacion);
            closePost();
            await cargarPublicacionesUsuario(userId);
          } catch (error) {
            console.error('Error eliminando publicación:', error);
            Alert.alert("Error", "No se pudo eliminar.");
          } finally {
            setIsDeletingPost(false);
          }
        },
      },
    ]);
  };

  // Funciones para manejar comentarios
  const openComments = async () => {
    if (!selectedPost) return;
    setCommentsModalVisible(true);
    setIsLoadingComments(true);
    try {
      await cargarComentarios(selectedPost.id_publicacion);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      Alert.alert("Error", "No se pudieron cargar los comentarios.");
      setCommentsModalVisible(false);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const closeComments = () => setCommentsModalVisible(false);

  const handleAddComment = async () => {
    if (!selectedPost || !newCommentText.trim() || isAddingComment) return;
    setIsAddingComment(true);
    try {
      await agregarComentario(selectedPost.id_publicacion, newCommentText);
      setNewCommentText("");
      await cargarComentarios(selectedPost.id_publicacion);
    } catch {
      Alert.alert("Error", "No se pudo agregar el comentario, revisa el contenido del comentario.");
    } finally {
      setIsAddingComment(false);
    }
  };

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setEditedCommentText(comment.texto);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditingComment(null);
    setEditedCommentText("");
    setEditModalVisible(false);
  };

  const handleSaveComment = async () => {
    if (!editingComment || !editedCommentText.trim() || isSavingComment) return;
    setIsSavingComment(true);
    try {
      await actualizarComentario(editingComment.id_comentario, editedCommentText);
      await cargarComentarios(selectedPost.id_publicacion);
      closeEditModal();
    } catch {
      Alert.alert("Error", "No se pudo guardar el comentario, revisa el contenido del comentario.");
    } finally {
      setIsSavingComment(false);
    }
  };

  const handleDeleteComment = (comment) => {
    if (isDeletingComment) return;
    Alert.alert("Eliminar comentario", "¿Confirmar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setIsDeletingComment(true);
          try {
            await borrarComentario(comment.id_comentario);
            await cargarComentarios(selectedPost.id_publicacion);
          } catch (error) {
            console.error('Error eliminando comentario:', error);
            Alert.alert("Error", "No se pudo eliminar.");
          } finally {
            setIsDeletingComment(false);
          }
        },
      },
    ]);
  };

  // Renderizado condicional
  if (!userId || errorPerfil) {
    return (
      <View style={styles.commentsLoaderContainer}>
        <Text style={{ textAlign: 'center', color: '#e74c3c' }}>
          {errorPerfil || 'Usuario no especificado'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ textAlign: 'center', color: '#007bff', marginTop: 10 }}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loadingPerfil) {
    return (
      <View style={styles.commentsLoaderContainer}>
        <ActivityIndicator size="large" color="#f57c00" />
        <Text style={{ marginTop: 10, textAlign: 'center' }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!perfilUsuario) {
    return (
      <View style={styles.commentsLoaderContainer}>
        <Text style={{ textAlign: 'center' }}>No se pudo cargar el perfil del usuario</Text>
        <TouchableOpacity onPress={() => cargarPerfilUsuario(userId)}>
          <Text style={{ textAlign: 'center', color: '#007bff', marginTop: 10 }}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Datos del perfil
  const profileAvatar = perfilUsuario?.foto_perfil?.[0]?.url || mockProfile.avatar;
  const tituloHeader = `${perfilUsuario?.nombre || 'Usuario'} ${perfilUsuario?.apellido || ''}`.trim();
  const esUsuarioDiferente = LOGGED_IN_USER_ID.toString() !== userId.toString();

  // Componentes de renderizado
  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileTopRow}>
        <Image source={{ uri: profileAvatar }} style={styles.avatar} />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{publicaciones.length}</Text>
            <Text style={styles.statLabel}>publicaciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{estadoSeguimiento.seguidores}</Text>
            <Text style={styles.statLabel}>seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{estadoSeguimiento.seguidos}</Text>
            <Text style={styles.statLabel}>seguidos</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{tituloHeader}</Text>
        {perfilUsuario?.correo && (
          <Text style={styles.profileEmail}>{perfilUsuario.correo}</Text>
        )}
      </View>

      {esUsuarioDiferente && (
        <TouchableOpacity
          style={[
            styles.followButton,
            estadoSeguimiento.siguiendo && styles.followingButton,
            estadoSeguimiento.cargando && styles.disabledButton
          ]}
          onPress={toggleSeguirUsuario}
          disabled={estadoSeguimiento.cargando}
        >
          {estadoSeguimiento.cargando ? (
            <ActivityIndicator size="small" color={estadoSeguimiento.siguiendo ? "#666" : "#fff"} />
          ) : (
            <Text style={estadoSeguimiento.siguiendo ? styles.followingText : styles.followText}>
              {estadoSeguimiento.siguiendo ? 'Siguiendo' : 'Seguir'}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* CARRUSEL DE INSIGNIAS - AGREGAR AQUÍ */}
      {renderInsigniasCarrusel()}
    </View>
  );

  // Agregar después del renderProfileHeader
  const renderInsigniasCarrusel = () => (
    <View style={styles.insigniasSection}>
      <Text style={styles.insigniasSectionTitle}>🏆 Insignias</Text>
      <FlatList
        data={insignias}
        renderItem={renderInsigniaCarruselItem}
        keyExtractor={(item) => item._id || item.id_insignia}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.insigniasCarruselContent}
        ListEmptyComponent={
          <View style={styles.emptyInsigniasContainer}>
            <Text style={styles.emptyInsigniasText}>Sin insignias aún</Text>
          </View>
        }
      />
    </View>
  );

  const renderInsigniaCarruselItem = ({ item }) => (
    <TouchableOpacity
      style={styles.insigniaCarruselCard}
      onPress={() => openInsigniaDetail(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: item.imagenes?.[0]?.url || "https://via.placeholder.com/80x80/FFD700/FFFFFF?text=🏆"
        }}
        style={styles.insigniaCarruselImage}
        resizeMode="cover"
      />
      <Text style={styles.insigniaCarruselName} numberOfLines={1}>
        {item.nombre || "Insignia"}
      </Text>
      <Text style={styles.insigniaCarruselPoints}>
        {item.puntosrequeridos} puntos
      </Text>
    </TouchableOpacity>
  );

  const renderPostGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => openPost(item)}>
      <Image
        source={{ uri: item.imagenes?.[0]?.url || "https://picsum.photos/400" }}
        style={styles.gridImage}
      />
    </TouchableOpacity>
  );
  // Renderizado de insignias
  const renderInsigniaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.insigniaCard}
      onPress={() => openInsigniaDetail(item)}
      activeOpacity={0.8}
    >
      <View style={styles.insigniaIconContainer}>
        <Image
          source={{
            uri: item.imagenes?.[0]?.url || "https://via.placeholder.com/60x60/FFD700/FFFFFF?text=🏆"
          }}
          style={styles.insigniaIcon}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.insigniaTitle} numberOfLines={2}>
        {item.nombre || "Insignia"}
      </Text>
      <Text style={styles.insigniaSubtitle} numberOfLines={1}>
        {item.puntosrequeridos} puntos
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (publicaciones.length === 0) {
      return (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            Este usuario no tiene publicaciones
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={publicaciones}
        renderItem={renderPostGridItem}
        keyExtractor={(item) => item.id_publicacion}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    );
  };
  const renderPostDetailModal = () => (
    <Modal
      visible={postDetailModalVisible}
      animationType="slide"
      onRequestClose={closePost}
    >
      <SafeAreaView style={styles.modalContainer}>
        {selectedPost && (
          <>
            <View style={styles.postModalHeader}>
              <View style={styles.postModalUserInfo}>
                <Image source={{ uri: profileAvatar }} style={styles.postModalUserAvatar} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.postModalUsername}>{tituloHeader}</Text>
                  <Text style={styles.postModalDate}>
                    {new Date(selectedPost.fechaPublicacion).toLocaleString("es-ES")}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={closePost}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Image
                source={{ uri: selectedPost.imagenes?.[0]?.url || "https://picsum.photos/400" }}
                style={styles.modalImage}
              />
              <Text style={styles.postCaption}>{selectedPost.descripcion || ""}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={[styles.actionButton, isLiking && styles.actionButtonDisabled]}
                  onPress={handleLike}
                  disabled={isLiking}
                >
                  {isLiking ? (
                    <ActivityIndicator size="small" color="#f57c00" />
                  ) : (
                    <Text style={styles.actionIcon}>
                      {selectedPost.meGusta ? "❤️" : "🤍"} {selectedPost.cantidadLikes}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={openComments}>
                  <Text style={styles.actionIcon}>💬</Text>
                </TouchableOpacity>
                {selectedPost.autorId === LOGGED_IN_USER_ID.toString() && (
                  <TouchableOpacity
                    style={[styles.actionButton, isDeletingPost && styles.actionButtonDisabled]}
                    onPress={handleDeletePost}
                    disabled={isDeletingPost}
                  >
                    {isDeletingPost ? (
                      <ActivityIndicator size="small" color="#e74c3c" />
                    ) : (
                      <Icon name="trash-2" size={24} color="#e74c3c" />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderCommentsModal = () => (
    <Modal
      visible={commentsModalVisible}
      animationType="slide"
      transparent
      onRequestClose={closeComments}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.commentsModalOverlay}>
          <TouchableOpacity
            style={styles.commentsModalBackdrop}
            onPress={closeComments}
          />
          <View style={styles.commentsModalContent}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comentarios</Text>
              <TouchableOpacity onPress={closeComments}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {isLoadingComments ? (
              <View style={styles.commentsLoaderContainer}>
                <ActivityIndicator size="large" color="#f57c00" />
              </View>
            ) : (
              <FlatList
                data={comentarios}
                keyExtractor={(item) => item.id_comentario}
                renderItem={({ item }) => {
                  const isAuthor = item.autorId === LOGGED_IN_USER_ID.toString();
                  return (
                    <View style={styles.commentItem}>
                      <View style={styles.commentTextContainer}>
                        <Text style={styles.commentUser}>
                          {item.autor?.nombre || "Usuario"}
                        </Text>
                        <Text style={styles.commentText}>{item.texto}</Text>
                      </View>
                      {isAuthor && (
                        <View style={styles.commentActions}>
                          <TouchableOpacity
                            onPress={() => openEditModal(item)}
                            disabled={isDeletingComment}
                          >
                            <Icon
                              name="edit-2"
                              style={[styles.commentActionIcon, isDeletingComment && { opacity: 0.5 }]}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteComment(item)}
                            disabled={isDeletingComment}
                          >
                            {isDeletingComment ? (
                              <ActivityIndicator size="small" color="#e74c3c" style={{ marginLeft: 8 }} />
                            ) : (
                              <Icon
                                name="trash-2"
                                style={[styles.commentActionIcon, { color: "#e74c3c" }]}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    No hay comentarios aún. ¡Sé el primero!
                  </Text>
                }
              />
            )}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={[styles.commentInput, isAddingComment && { opacity: 0.7 }]}
                placeholder="Agrega un comentario..."
                value={newCommentText}
                onChangeText={setNewCommentText}
                editable={!isAddingComment}
              />
              <TouchableOpacity
                style={[styles.sendButton, isAddingComment && styles.sendButtonDisabled]}
                onPress={handleAddComment}
                disabled={isAddingComment}
              >
                {isAddingComment ? (
                  <ActivityIndicator size="small" color="#f57c00" />
                ) : (
                  <Icon name="send" style={styles.sendButtonIcon} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderEditCommentModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="fade"
      transparent
      onRequestClose={closeEditModal}
    >
      <View style={styles.editModalOverlay}>
        <View style={styles.editModalContent}>
          <Text style={styles.editModalTitle}>Editar Comentario</Text>
          <TextInput
            style={[styles.editModalInput, isSavingComment && { opacity: 0.7 }]}
            value={editedCommentText}
            onChangeText={setEditedCommentText}
            multiline
            autoFocus
            editable={!isSavingComment}
          />
          <View style={styles.editModalButtonContainer}>
            <TouchableOpacity
              style={[styles.editModalButton, styles.cancelButton]}
              onPress={closeEditModal}
              disabled={isSavingComment}
            >
              <Text style={[styles.editModalButtonText, isSavingComment && { opacity: 0.5 }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.editModalButton,
                styles.saveButton,
                isSavingComment && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveComment}
              disabled={isSavingComment}
            >
              {isSavingComment ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={[styles.editModalButtonText, { color: "#fff" }]}>
                  Guardar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  // Modal de detalle de insignia
  const renderInsigniaDetailModal = () => (
    <Modal
      visible={insigniaModalVisible}
      animationType="fade"
      transparent
      onRequestClose={closeInsigniaDetail}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={closeInsigniaDetail}
        />
        <View style={styles.modalContent}>
          {selectedInsignia && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeInsigniaDetail}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <View style={styles.modalIconContainer}>
                <Image
                  source={{
                    uri: selectedInsignia.imagenes?.[0]?.url || "https://via.placeholder.com/120x120/FFD700/FFFFFF?text=🏆"
                  }}
                  style={styles.modalIcon}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.modalTitle}>
                {selectedInsignia.nombre}
              </Text>

              <Text style={styles.modalDescription}>
                {selectedInsignia.descripcion || "Sin descripción disponible"}
              </Text>

              <View style={styles.modalInfoContainer}>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Puntos requeridos:</Text>
                  <Text style={styles.modalInfoValue}>
                    {selectedInsignia.puntosrequeridos}
                  </Text>
                </View>

                {selectedInsignia.historialReclamos && selectedInsignia.historialReclamos.length > 0 && (
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Veces reclamada:</Text>
                    <Text style={styles.modalInfoValue}>
                      {selectedInsignia.historialReclamos.reduce((total, reclamo) =>
                        total + (reclamo.cantidadReclamada || 0), 0
                      )}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tituloHeader}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderContent()}
      </ScrollView>

      {renderPostDetailModal()}
      {renderCommentsModal()}
      {renderEditCommentModal()}
      {renderInsigniaDetailModal()}
    </View>
  );
}