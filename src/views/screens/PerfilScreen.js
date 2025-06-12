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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "../../styles/PerfilScreen.styles.js";
import { usePerfilViewModel } from "../../viewmodels/PerfilViewModel.js";

const mockProfile = {
  username: "maria.gonzalez",
  avatar: "https://i.pravatar.cc/150?u=maria",
  stats: {
    followers: 2543,
    following: 312,
  },
};

export default function PerfilScreen({ navigation }) {
  // --- ViewModel ---
  const { publicaciones, cargarMisPublicaciones } = usePerfilViewModel();

  // --- Estados locales ---
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  // --- Cargar publicaciones al montar ---
  useEffect(() => {
    cargarMisPublicaciones();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const openPost = (post) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
    setCommentsModalVisible(false);
  };

  const openComments = () => {
    setCommentsModalVisible(true);
  };

  const closeComments = () => {
    setCommentsModalVisible(false);
  };

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setEditedCommentText(comment.text);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingComment(null);
    setEditedCommentText("");
  };

  const handleSaveComment = () => {
    // lógica pendiente
    closeEditModal();
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileTopRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: mockProfile.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarIcon}>✎</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{publicaciones.length}</Text>
            <Text style={styles.statLabel}>publicaciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mockProfile.stats.followers.toLocaleString("es-ES")}
            </Text>
            <Text style={styles.statLabel}>seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockProfile.stats.following}</Text>
            <Text style={styles.statLabel}>seguidos</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.editProfileButton}>
        <Text style={styles.editProfileButtonText}>Editar perfil</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPostGridItem = ({ item }) => {
    const imageUrl = item.imagenes?.[0]?.url || "https://picsum.photos/400";
    return (
      <TouchableOpacity style={styles.gridItem} onPress={() => openPost(item)}>
        <Image source={{ uri: imageUrl }} style={styles.gridImage} />
      </TouchableOpacity>
    );
  };

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

      {/* MODAL DE PUBLICACIÓN */}
      <Modal visible={!!selectedPost} animationType="slide" onRequestClose={closePost}>
        <SafeAreaView style={styles.modalContainer}>
          {selectedPost && (
            <>
              <View style={styles.postModalHeader}>
                <View style={styles.postModalUserInfo}>
                  <View style={styles.pdfIconContainer}>
                    <Text style={styles.pdfIcon}>📄</Text>
                  </View>
                  <View>
                    <Text style={styles.postModalUsername}>
                      {selectedPost.autor?.nombre || "Autor"}
                    </Text>
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
                  source={{
                    uri: selectedPost.imagenes?.[0]?.url || "https://picsum.photos/400",
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.postCaption}>
                  {selectedPost.descripcion || ""}
                </Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>
                      ❤️ {selectedPost.cantidadLikes}
                      {selectedPost.meGusta ? " (Te gusta)" : ""}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={openComments}>
                    <Text style={styles.actionIcon}>💬</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>

      {/* MODAL DE COMENTARIOS */}
      <Modal
        visible={commentsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeComments}
      >
        <View style={styles.commentsModalOverlay}>
          <TouchableOpacity style={styles.commentsModalBackdrop} onPress={closeComments} />
          <View style={styles.commentsModalContent}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comentarios</Text>
              <TouchableOpacity onPress={closeComments}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ padding: 10, color: "#999" }}>
              Aquí se mostrarán los comentarios de la publicación seleccionada.
            </Text>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA EDITAR COMENTARIO */}
      <Modal
        visible={editModalVisible}
        animationType="fade"
        transparent={true}
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
            />
            <View style={styles.editModalButtonContainer}>
              <TouchableOpacity
                style={[styles.editModalButton, styles.cancelButton]}
                onPress={closeEditModal}
              >
                <Text style={styles.editModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editModalButton, styles.saveButton]}
                onPress={handleSaveComment}
              >
                <Text style={[styles.editModalButtonText, { color: "#fff" }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
