import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import { useAdminEviViewModel } from '../../viewmodels/AdminEviViewModel.js';
import { styles } from '../../styles/EvidenciasAdminScreen.styles.js';


const PAGE_SIZE = 10;

export default function EvidenciasAdminScreen() {
  const {
    evidencias,
    loading,
    error,
    fetchEvidencias,
    updateEvidencia,
    loadingId,
  } = useAdminEviViewModel();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUri, setModalImageUri] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  // Cargar evidencias solo al montar
  useEffect(() => {
    fetchEvidencias();
  }, []);

  const evidenciasNoRevisadas = React.useMemo(() => {
    return evidencias.filter(e => !e.revisado);
  }, [evidencias]);

  const dataPaged = React.useMemo(() => {
    return evidenciasNoRevisadas.slice(0, page * PAGE_SIZE);
  }, [evidenciasNoRevisadas, page]);

  const openImageModal = (uri) => {
    setModalImageUri(uri);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setModalImageUri(null);
  };

  const handleLoadMore = () => {
    if (page * PAGE_SIZE < evidenciasNoRevisadas.length) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1); // resetear página antes de cargar
    try {
      await fetchEvidencias();
    } catch {
      // evitar mostrar error molesto
    }
    setRefreshing(false);
  }, [fetchEvidencias]);

  const handleAprobarEvidencia = async (id_evidencia) => {
    try {
      await updateEvidencia(id_evidencia, { revisado: true });
      setPage(1);
      await fetchEvidencias();
    } catch (error) {
      console.error('Error al aprobar evidencia:', error);
      alert('Error al aprobar la evidencia');
    }
  };

  if (loading && dataPaged.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const usuario = item.usuario || {};
    const imagenUrl = item.imagenes?.[0]?.url;
    const isApproving = loadingId === item.id_evidencia;

    return (
      <TouchableOpacity style={styles.card} onPress={() => imagenUrl && openImageModal(imagenUrl)}>
        {imagenUrl && <Image source={{ uri: imagenUrl }} style={styles.image} />}
        <View style={styles.info}>
          <Text style={styles.name}>{usuario.nombre} {usuario.apellido}</Text>
          <Text style={styles.email}>{usuario.correo}</Text>
          <Text style={styles.descripcion}>{item.descripcion}</Text>
          <Text style={styles.fecha}>Subido: {new Date(item.fechaSubida).toLocaleDateString()}</Text>
          {!item.revisado && (
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleAprobarEvidencia(item.id_evidencia)}
              disabled={isApproving}
            >
              {isApproving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.approveButtonText}>Aprobar</Text>
              )}
            </TouchableOpacity>
          )}
          {item.revisado && (
            <Text style={styles.approvedText}>Aprobada</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataPaged}
        keyExtractor={(item) => item.id_evidencia}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { flexGrow: 1 }]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f57c00']}
            tintColor="#f57c00"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.center}>
            {loading ? (
              <ActivityIndicator size="large" color="#f57c00" />
            ) : error ? (
              <>
                <Text style={styles.errorText}>No se pudieron cargar las evidencias.</Text>
                <Text style={styles.pullDownText}>Desliza hacia abajo para intentar nuevamente.</Text>
              </>
            ) : (
              <>
                <Text style={styles.noDataText}>No hay evidencias disponibles 😔</Text>
                <Text style={styles.pullDownText}>Desliza hacia abajo para refrescar.</Text>
              </>
            )}
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalBackground}>
            <Image source={{ uri: modalImageUri }} style={styles.modalImage} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

