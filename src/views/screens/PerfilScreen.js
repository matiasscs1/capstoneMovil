// screens/PerfilScreen.js
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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "../../styles/PerfilScreen.styles.js";
import { usePerfilViewModel } from "../../viewmodels/PerfilViewModel.js";
import { useAuth } from "../../context/AuthContext";

const mockProfile = {
  avatar: "https://i.pravatar.cc/150?u=maria",
};

export default function PerfilScreen({ navigation }) {
  const {
    publicaciones,
    cargarMisPublicaciones,
    darLike,
    borrarPublicacion,
    comentarios,
    cargarComentarios,
    comentar,
    actualizarComentario,
    borrarComentario,
    conteoSeguidores,
    contarSeguimientos,
    cargarDatosUsuario,
    insignias,
    cargarInsigniasUsuario,
    actualizarPerfil, // Asume que tienes esta función en el ViewModel
  } = usePerfilViewModel();
  const { user, updateUser } = useAuth(); // Asume que tienes updateUser en el contexto

  const [selectedInsignia, setSelectedInsignia] = useState(null);
  const [insigniaModalVisible, setInsigniaModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [userData, setUserData] = useState(null);

  // Estados para el modal de editar perfil
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });
  const [editProfileErrors, setEditProfileErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Estados de carga
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  useEffect(() => {
    if (user) {
      cargarMisPublicaciones();
      contarSeguimientos();
      loadUserData();
      cargarInsigniasUsuario(user.id_usuario);
    }
  }, []);

  // Función para cargar datos del usuario
  const loadUserData = async () => {
    if (!user?.id_usuario) return;
    try {
      const datosUsuario = await cargarDatosUsuario(user.id_usuario);
      setUserData(datosUsuario);
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
    }
  };

  // Funciones para editar perfil
  const openEditProfile = () => {
    // Solo usar userData, NO usar user del token
    setEditProfileData({
      nombre: userData?.nombre || "",
      apellido: userData?.apellido || "",
      correo: userData?.correo || "",
    });
    setEditProfileErrors({});
    setEditProfileModalVisible(true);
  };

  const closeEditProfile = () => {
    setEditProfileModalVisible(false);
    setEditProfileData({ nombre: "", apellido: "", correo: "" }); // ✅ Ya está correcto
    setEditProfileErrors({});
  };


  const validateEditProfileForm = () => {
    const errors = {};

    // Validar nombre
    if (!editProfileData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(editProfileData.nombre.trim())) {
      errors.nombre = "El nombre solo puede contener letras";
    }

    // Validar apellido
    if (!editProfileData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(editProfileData.apellido.trim())) {
      errors.apellido = "El apellido solo puede contener letras";
    }

    // 🔴 CAMBIAR ESTAS LÍNEAS:
    // Validar correo
    if (!editProfileData.correo.trim()) {        // ← Cambiar de "email" a "correo"
      errors.correo = "El correo es obligatorio"; // ← Cambiar de "email" a "correo"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editProfileData.correo.trim())) { // ← Cambiar de "email" a "correo"
        errors.correo = "Ingresa un correo válido";          // ← Cambiar de "email" a "correo"
      }
    }

    setEditProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateEditProfileForm() || isUpdatingProfile) return;

    setIsUpdatingProfile(true);
    try {
      // Llamar a la función de actualizar perfil
      const updatedUser = await actualizarPerfil(user.id_usuario, {
        nombre: editProfileData.nombre.trim(),
        apellido: editProfileData.apellido.trim(),
        correo: editProfileData.correo.trim(),
      });

      // Actualizar el contexto de usuario
      if (updateUser) {
        updateUser(updatedUser);
      }

      // Recargar datos del usuario
      await loadUserData();

      Alert.alert("Éxito", "Perfil actualizado correctamente");
      closeEditProfile();
    } catch (error) {
      // ✅ No hacer console.error para evitar logs en terminal

      // Manejar errores específicos con mensajes amigables
      if (error.message === 'CORREO_DUPLICADO') {
        Alert.alert("Error", "Este correo ya está en uso por otro usuario.");
      } else {
        Alert.alert("Error", "No se pudo actualizar el perfil.");
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.commentsLoaderContainer}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  const LOGGED_IN_USER_ID = user.id_usuario;
  const profileAvatar = userData?.foto_perfil?.[0]?.url ||
    user.foto_perfil?.[0]?.url ||
    mockProfile.avatar;

  const handleBackPress = () => navigation.goBack();

  const openPost = (post) => {
    setSelectedPost(post);
    setPostDetailModalVisible(true);
  };
  const closePost = () => {
    setSelectedPost(null);
    setPostDetailModalVisible(false);
  };

  const openComments = async () => {
    if (!selectedPost) return;
    setCommentsModalVisible(true);
    setIsLoadingComments(true);
    try {
      await cargarComentarios(selectedPost.id_publicacion);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los comentarios.");
      setCommentsModalVisible(false);
    } finally {
      setIsLoadingComments(false);
    }
  };
  const closeComments = () => setCommentsModalVisible(false);

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

  const handleLike = async () => {
    if (!selectedPost || isLiking) return;
    setIsLiking(true);
    try {
      const updated = await darLike(selectedPost.id_publicacion);
      setSelectedPost((p) => ({
        ...p,
        cantidadLikes: updated.cantidadLikes,
        meGusta: updated.meGusta,
      }));
    } catch {
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
          } catch {
            Alert.alert("Error", "No se pudo eliminar.");
          } finally {
            setIsDeletingPost(false);
          }
        },
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!selectedPost || !newCommentText.trim() || isAddingComment) return;
    setIsAddingComment(true);
    try {
      await comentar(selectedPost.id_publicacion, newCommentText);
      setNewCommentText("");
      await cargarComentarios(selectedPost.id_publicacion);
    } catch {
      Alert.alert("Error", "No se pudo agregar el comentario, revisa el contenido del comentario.");
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleSaveComment = async () => {
    if (!editingComment || !editedCommentText.trim() || isSavingComment) return;
    setIsSavingComment(true);
    try {
      await actualizarComentario(
        editingComment.id_comentario,
        editedCommentText
      );
      await cargarComentarios(selectedPost.id_publicacion);
      closeEditModal();
    } catch {
      Alert.alert("Error", "No se pudo guardar el comentario, revisa el contenido del comentario.");
    } finally {
      setIsSavingComment(false);
    }
  };

  const handleDeleteComment = (c) => {
    if (isDeletingComment) return;
    Alert.alert("Eliminar comentario", "¿Confirmar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setIsDeletingComment(true);
          try {
            await borrarComentario(c.id_comentario);
            await cargarComentarios(selectedPost.id_publicacion);
          } catch {
            Alert.alert("Error", "No se pudo eliminar.");
          } finally {
            setIsDeletingComment(false);
          }
        },
      },
    ]);
  };

  const openInsigniaDetail = (insignia) => {
    setSelectedInsignia(insignia);
    setInsigniaModalVisible(true);
  };

  const closeInsigniaDetail = () => {
    setSelectedInsignia(null);
    setInsigniaModalVisible(false);
  };
  const renderProfileHeader = () => {
    // Solo usar userData para la foto, no usar user del token
    const profileAvatar = userData?.foto_perfil?.[0]?.url || mockProfile.avatar;

    return (
      <View style={styles.profileHeader}>
        <View style={styles.profileTopRow}>
          <Image source={{ uri: profileAvatar }} style={styles.avatar} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{publicaciones.length}</Text>
              <Text style={styles.statLabel}>publicaciones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {conteoSeguidores?.seguidoresCount || 0}
              </Text>
              <Text style={styles.statLabel}>seguidores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {conteoSeguidores?.seguidosCount || 0}
              </Text>
              <Text style={styles.statLabel}>seguidos</Text>
            </View>
          </View>
        </View>

        {/* Botón Editar Perfil */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={openEditProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        {/* Mostrar nombre del usuario desde userData */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>
            {userData?.nombre} {userData?.apellido}
          </Text>
          <Text style={styles.userEmail}>{userData?.correo}</Text>
        </View>

        {/* AGREGAR EL CARRUSEL DE INSIGNIAS */}
        {renderInsigniasCarrusel()}
      </View>
    );
  };

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
        source={{
          uri: item.imagenes?.[0]?.url || "https://picsum.photos/400",
        }}
        style={styles.gridImage}
      />
    </TouchableOpacity>
  );

  // Modal para editar perfil
  const renderEditProfileModal = () => (
    <Modal
      visible={editProfileModalVisible}
      animationType="slide"
      transparent
      onRequestClose={closeEditProfile}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.editProfileModalOverlay}>
          <View style={styles.editProfileModalContent}>
            <View style={styles.editProfileHeader}>
              <Text style={styles.editProfileTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={closeEditProfile}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Campo Nombre */}
              <View style={styles.editProfileFieldContainer}>
                <Text style={styles.editProfileLabel}>Nombre *</Text>
                <TextInput
                  style={[
                    styles.editProfileInput,
                    editProfileErrors.nombre && styles.editProfileInputError,
                    isUpdatingProfile && styles.editProfileInputDisabled,
                  ]}
                  value={editProfileData.nombre}
                  onChangeText={(text) => {
                    setEditProfileData(prev => ({ ...prev, nombre: text }));
                    if (editProfileErrors.nombre) {
                      setEditProfileErrors(prev => ({ ...prev, nombre: null }));
                    }
                  }}
                  placeholder="Ingresa tu nombre"
                  editable={!isUpdatingProfile}
                />
                {editProfileErrors.nombre && (
                  <Text style={styles.editProfileErrorText}>
                    {editProfileErrors.nombre}
                  </Text>
                )}
              </View>

              {/* Campo Apellido */}
              <View style={styles.editProfileFieldContainer}>
                <Text style={styles.editProfileLabel}>Apellido *</Text>
                <TextInput
                  style={[
                    styles.editProfileInput,
                    editProfileErrors.apellido && styles.editProfileInputError,
                    isUpdatingProfile && styles.editProfileInputDisabled,
                  ]}
                  value={editProfileData.apellido}
                  onChangeText={(text) => {
                    setEditProfileData(prev => ({ ...prev, apellido: text }));
                    if (editProfileErrors.apellido) {
                      setEditProfileErrors(prev => ({ ...prev, apellido: null }));
                    }
                  }}
                  placeholder="Ingresa tu apellido"
                  editable={!isUpdatingProfile}
                />
                {editProfileErrors.apellido && (
                  <Text style={styles.editProfileErrorText}>
                    {editProfileErrors.apellido}
                  </Text>
                )}
              </View>

              {/* Campo Email */}
              <View style={styles.editProfileFieldContainer}>
                <Text style={styles.editProfileLabel}>Correo Electrónico *</Text>
                <TextInput
                  style={[
                    styles.editProfileInput,
                    editProfileErrors.correo && styles.editProfileInputError,    // ← Cambiar de "email" a "correo"
                    isUpdatingProfile && styles.editProfileInputDisabled,
                  ]}
                  value={editProfileData.correo}    // ← Cambiar de "email" a "correo"
                  onChangeText={(text) => {
                    setEditProfileData(prev => ({ ...prev, correo: text }));    // ← Cambiar de "email" a "correo"
                    if (editProfileErrors.correo) {                             // ← Cambiar de "email" a "correo"
                      setEditProfileErrors(prev => ({ ...prev, correo: null })); // ← Cambiar de "email" a "correo"
                    }
                  }}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isUpdatingProfile}
                />
                {editProfileErrors.correo && (
                  <Text style={styles.editProfileErrorText}>
                    {editProfileErrors.correo}
                  </Text>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View style={styles.editProfileButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.editProfileCancelButton,
                  isUpdatingProfile && styles.editProfileButtonDisabled,
                ]}
                onPress={closeEditProfile}
                disabled={isUpdatingProfile}
              >
                <Text style={styles.editProfileCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editProfileSaveButton,
                  isUpdatingProfile && styles.editProfileButtonDisabled,
                ]}
                onPress={handleSaveProfile}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.editProfileSaveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderPostDetailModal = () => {
    // Solo usar userData para la foto, no user del token
    const profileAvatar = userData?.foto_perfil?.[0]?.url || mockProfile.avatar;

    return (
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
                  <Image
                    source={{ uri: profileAvatar }}
                    style={styles.postModalUserAvatar}
                  />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.postModalUsername}>
                      {userData?.nombre || "Usuario"}
                    </Text>
                    <Text style={styles.postModalDate}>
                      {new Date(
                        selectedPost.fechaPublicacion
                      ).toLocaleString("es-ES")}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={closePost}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <Image
                  source={{
                    uri:
                      selectedPost.imagenes?.[0]?.url ||
                      "https://picsum.photos/400",
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.postCaption}>
                  {selectedPost.descripcion || ""}
                </Text>
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isLiking && styles.actionButtonDisabled,
                    ]}
                    onPress={handleLike}
                    disabled={isLiking}
                  >
                    {isLiking ? (
                      <ActivityIndicator size="small" color="#f57c00" />
                    ) : (
                      <Text style={styles.actionIcon}>
                        {selectedPost.meGusta ? "❤️" : "🤍"}{" "}
                        {selectedPost.cantidadLikes}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={openComments}
                  >
                    <Text style={styles.actionIcon}>💬</Text>
                  </TouchableOpacity>
                  {selectedPost.autorId === LOGGED_IN_USER_ID && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        isDeletingPost && styles.actionButtonDisabled,
                      ]}
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
  };

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
                  const isAuthor = item.autorId === LOGGED_IN_USER_ID;
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
                              style={[
                                styles.commentActionIcon,
                                isDeletingComment && { opacity: 0.5 },
                              ]}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteComment(item)}
                            disabled={isDeletingComment}
                          >
                            {isDeletingComment ? (
                              <ActivityIndicator
                                size="small"
                                color="#e74c3c"
                                style={{ marginLeft: 8 }}
                              />
                            ) : (
                              <Icon
                                name="trash-2"
                                style={[
                                  styles.commentActionIcon,
                                  { color: "#e74c3c" },
                                ]}
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
                style={[
                  styles.commentInput,
                  isAddingComment && { opacity: 0.7 },
                ]}
                placeholder="Agrega un comentario..."
                value={newCommentText}
                onChangeText={setNewCommentText}
                editable={!isAddingComment}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  isAddingComment && styles.sendButtonDisabled,
                ]}
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
            style={[
              styles.editModalInput,
              isSavingComment && { opacity: 0.7 },
            ]}
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
              <Text
                style={[
                  styles.editModalButtonText,
                  isSavingComment && { opacity: 0.5 },
                ]}
              >
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
                <Text
                  style={[styles.editModalButtonText, { color: "#fff" }]}
                >
                  Guardar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <FlatList
        data={publicaciones}
        renderItem={renderPostGridItem}
        keyExtractor={(item) => item.id_publicacion}
        numColumns={3}
        ListHeaderComponent={renderProfileHeader}
        columnWrapperStyle={styles.gridRow}
      />
      {renderEditProfileModal()}
      {renderPostDetailModal()}
      {renderCommentsModal()}
      {renderEditCommentModal()}
      {renderInsigniaDetailModal()}
    </View>
  );
}