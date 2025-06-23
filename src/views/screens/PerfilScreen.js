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
  ScrollView,             // ← IMPORTAR ScrollView
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
  } = usePerfilViewModel();
  const { user } = useAuth();

  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (user) {
      cargarMisPublicaciones();
      contarSeguimientos();
    }
  }, []);

  if (!user) {
    return (
      <View style={styles.commentsLoaderContainer}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  const LOGGED_IN_USER_ID = user.id_usuario;
  const profileAvatar = user.foto_perfil?.[0]?.url || mockProfile.avatar;

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
    if (!selectedPost) return;
    try {
      const updated = await darLike(selectedPost.id_publicacion);
      setSelectedPost((p) => ({
        ...p,
        cantidadLikes: updated.cantidadLikes,
        meGusta: updated.meGusta,
      }));
    } catch {
      Alert.alert("Error", "No se pudo procesar el like.");
    }
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;
    Alert.alert("Eliminar publicación", "¿Confirmar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await borrarPublicacion(selectedPost.id_publicacion);
            closePost();
          } catch {
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!selectedPost || !newCommentText.trim()) return;
    try {
      await comentar(selectedPost.id_publicacion, newCommentText);
      setNewCommentText("");
      await cargarComentarios(selectedPost.id_publicacion);
    } catch {
      Alert.alert("Error", "No se pudo agregar el comentario.");
    }
  };

  const handleSaveComment = async () => {
    if (!editingComment || !editedCommentText.trim()) return;
    setIsSavingComment(true);
    try {
      await actualizarComentario(
        editingComment.id_comentario,
        editedCommentText
      );
      await cargarComentarios(selectedPost.id_publicacion);
      closeEditModal();
    } catch {
      Alert.alert("Error", "No se pudo guardar el comentario.");
    } finally {
      setIsSavingComment(false);
    }
  };

  const handleDeleteComment = (c) => {
    Alert.alert("Eliminar comentario", "¿Confirmar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await borrarComentario(c.id_comentario);
            await cargarComentarios(selectedPost.id_publicacion);
          } catch {
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  };

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
    </View>
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
                <Icon name="user" size={24} color="#f57c00" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.postModalUsername}>
                    {selectedPost.autor?.nombre || "Autor"}
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
                  style={styles.actionButton}
                  onPress={handleLike}
                >
                  <Text style={styles.actionIcon}>
                    {selectedPost.meGusta ? "❤️" : "🤍"}{" "}
                    {selectedPost.cantidadLikes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={openComments}
                >
                  <Text style={styles.actionIcon}>💬</Text>
                </TouchableOpacity>
                {selectedPost.autorId === LOGGED_IN_USER_ID && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDeletePost}
                  >
                    <Icon name="trash-2" size={24} color="#e74c3c" />
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
                          >
                            <Icon
                              name="edit-2"
                              style={styles.commentActionIcon}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteComment(item)}
                          >
                            <Icon
                              name="trash-2"
                              style={[
                                styles.commentActionIcon,
                                { color: "#e74c3c" },
                              ]}
                            />
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
                style={styles.commentInput}
                placeholder="Agrega un comentario..."
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleAddComment}
              >
                <Icon name="send" style={styles.sendButtonIcon} />
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
            style={styles.editModalInput}
            value={editedCommentText}
            onChangeText={setEditedCommentText}
            multiline
            autoFocus
          />
          <View style={styles.editModalButtonContainer}>
            <TouchableOpacity
              style={[styles.editModalButton, styles.cancelButton]}
              onPress={closeEditModal}
              disabled={isSavingComment}
            >
              <Text style={styles.editModalButtonText}>Cancelar</Text>
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

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
        >
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
      {renderPostDetailModal()}
      {renderCommentsModal()}
      {renderEditCommentModal()}
    </View>
  );
}