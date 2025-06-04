import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Linking,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useAdminEviViewModel } from '../../viewmodels/AdminEviViewModel.js';
import { styles } from '../../styles/EvidenciasAdminScreen.styles.js';
import {
  User,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  Video,
  X as CloseIcon, // Para el botón de cerrar modal
} from 'lucide-react-native';

const windowWidth = Dimensions.get('window').width;

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
  const [modalArchivos, setModalArchivos] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [currentModalIndex, setCurrentModalIndex] = useState(0); // Para la paginación del modal
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvidencias(page); // Carga inicial con la página 1
  }, []); // Solo en el montaje inicial

  // Filtra las evidencias que no han sido revisadas
  const evidenciasNoRevisadas = React.useMemo(() => {
    return evidencias.filter(e => !e.revisado && e.id_evidencia); // Asegurar que id_evidencia exista
  }, [evidencias]);

  // Aplica paginación a las evidencias no revisadas
  // Esta lógica de paginación en el cliente podría ser diferente si tu API ya pagina
  const dataPaged = React.useMemo(() => {
    // Si tu fetchEvidencias ya maneja la paginación y solo trae los items de la página actual,
    // entonces dataPaged podría ser simplemente evidenciasNoRevisadas.
    // Si fetchEvidencias trae todas y aquí paginas, esta bien.
    return evidenciasNoRevisadas.slice(0, page * 10);
  }, [evidenciasNoRevisadas, page]);

  const handleLoadMore = () => {
    // Solo incrementa la página si hay más elementos de los que se muestran actualmente
    // y no estamos ya cargando más.
    if (!loading && page * 10 < evidenciasNoRevisadas.length) {
      setPage(prevPage => prevPage + 1);
      // Opcionalmente, si tu API soporta paginación:
      // fetchEvidencias(page + 1, true); // true para indicar que es una carga adicional
    }
  };

  const handleOpenModal = (archivos, idx) => {
    setModalArchivos(archivos || []);
    setModalIndex(idx);
    setCurrentModalIndex(idx); // Sincronizar el índice actual del modal
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalArchivos([]);
    setModalIndex(0);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1); // Reinicia la página al refrescar
    try {
      await fetchEvidencias(1); // Llama con la página 1
    } catch (err) {
      console.error("Error en onRefresh:", err)
      // Manejar error si es necesario
    }
    setRefreshing(false);
  }, [fetchEvidencias]);

  const handleAprobarEvidencia = async (id_evidencia) => {
    try {
      await updateEvidencia(id_evidencia, { revisado: true, tipo: true }); // Asegúrate de enviar tipo: true también
      // No es necesario setPage(1) aquí si fetchEvidencias actualiza la lista completa
      // y el filtro de evidenciasNoRevisadas se re-ejecuta.
      // Si fetchEvidencias solo añade, entonces sí necesitarías recargar desde la página 1.
      await fetchEvidencias(1); // Recargar desde la página 1 para ver los cambios
    } catch (err) {
      console.error('Error al aprobar evidencia:', err);
      alert('Error al aprobar la evidencia. Por favor, inténtalo de nuevo.');
    }
  };

  // La función renderPreview ya no se usa directamente en renderItem para el nuevo diseño
  // pero la mantenemos por si la necesitas para el modal o alguna otra parte.

  const renderItem = ({ item }) => {
    const usuario = item.usuario || { nombre: 'Usuario', apellido: 'Desconocido' };
    const archivos = item.archivos || item.imagenes || [];
    const primerArchivo = archivos.length > 0 ? archivos[0] : null;
    const isApproving = loadingId === item.id_evidencia;

    const fechaSubida = item.fechaSubida ? new Date(item.fechaSubida) : new Date();
    const fechaFormateada = fechaSubida.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // O true si prefieres AM/PM
    }).replace(',', ''); // Quitar la coma después del año si la hay

    // Usar los estilos con el prefijo newCard_
    const s = styles; // Asumiendo que todos los estilos están en el objeto 'styles'

    return (
      <View style={s.newCard_card}>
        <View style={s.newCard_orangeTopBar} />

        <TouchableOpacity
          style={s.newCard_imageContainer}
          onPress={() => archivos.length > 0 && handleOpenModal(archivos, 0)}
          activeOpacity={0.8} // Para feedback visual
        >
          {primerArchivo && primerArchivo.tipo === 'imagen' && primerArchivo.url ? (
            <Image source={{ uri: primerArchivo.url }} style={s.newCard_evidenceImage} />
          ) : primerArchivo && primerArchivo.tipo === 'pdf' ? (
            <View style={s.newCard_placeholderIconContainer}>
              <FileText size={60} color="#bdbdbd" style={s.newCard_filePreviewIcon} />
              <Text style={s.newCard_filePreviewText}>Ver PDF</Text>
            </View>
          ) : primerArchivo && primerArchivo.tipo === 'video' ? (
            <View style={s.newCard_placeholderIconContainer}>
              <Video size={60} color="#bdbdbd" style={s.newCard_filePreviewIcon} />
              <Text style={s.newCard_filePreviewText}>Ver Video</Text>
            </View>
          ) : (
            <View style={s.newCard_placeholderIconContainer}>
              <ImageIcon size={60} color="#bdbdbd" />
              <Text style={s.newCard_filePreviewText}>Sin Vista Previa</Text>
            </View>
          )}
          {!item.revisado && (
            <View style={s.newCard_statusBadge}>
              <Text style={s.newCard_statusBadgeText}>Pendiente</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={s.newCard_contentContainer}>
          <Text style={s.newCard_evidenceDescription} numberOfLines={3}>
            {item.descripcion || 'El usuario no proporcionó una descripción.'}
          </Text>

          <View style={s.newCard_detailRow}>
            <User size={18} color="#757575" style={s.newCard_detailIcon} />
            <Text style={s.newCard_detailText} numberOfLines={1}>
              Enviado por: <Text style={s.newCard_detailValue}>{usuario.nombre} {usuario.apellido}</Text>
            </Text>
          </View>

          <View style={s.newCard_detailRow}>
            <CalendarDays size={18} color="#757575" style={s.newCard_detailIcon} />
            <Text style={s.newCard_detailText}>
              Fecha: <Text style={s.newCard_detailValue}>{fechaFormateada}</Text>
            </Text>
          </View>

          {!item.revisado ? (
            <TouchableOpacity
              style={s.newCard_approveButton}
              onPress={() => handleAprobarEvidencia(item.id_evidencia)}
              disabled={isApproving || loading} // Deshabilitar si está cargando globalmente también
            >
              {isApproving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <CheckCircle2 size={20} color="#fff" style={s.newCard_approveButtonIcon} />
                  <Text style={s.newCard_approveButtonText}>Aprobar</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={s.newCard_approvedText}>Evidencia Aprobada</Text>
          )}
        </View>
      </View>
    );
  };

  const renderModalItem = ({ item: archivoModal }) => { // Renombrado para claridad
    // Usar los estilos del modal directamente de 'styles'
    if (archivoModal.tipo === 'imagen' && archivoModal.url) {
      return <Image source={{ uri: archivoModal.url }} style={styles.modalImage} />;
    }
    if (archivoModal.tipo === 'pdf' && archivoModal.url) {
      return (
        <TouchableOpacity
          onPress={() => Linking.openURL(archivoModal.url)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth }}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../../assets/pdfNuevo.png')} // Asegúrate que esta ruta es correcta
            style={styles.modalPdfIcon}
          />
          <Text style={styles.modalPdfLabel}>Abrir PDF</Text>
        </TouchableOpacity>
      );
    }
    if (archivoModal.tipo === 'video' && archivoModal.url) {
      return (
        <TouchableOpacity
          onPress={() => Linking.openURL(archivoModal.url)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth }}
          activeOpacity={0.8}
        >
          <View style={styles.modalVideoIcon}>
            <Text style={styles.playText}>▶</Text>
          </View>
          <Text style={styles.modalPdfLabel}>Ver Video</Text>
        </TouchableOpacity>
      );
    }
    return ( // Fallback por si el tipo no es reconocido o falta la URL
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth }}>
            <Text style={{color: 'white', fontSize: 16}}>No se puede mostrar el archivo.</Text>
        </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: styles.list.backgroundColor }}>
      <FlatList
        data={dataPaged} // Usar los datos paginados
        keyExtractor={(item, index) => item.id_evidencia || `evidencia-${index}`}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, dataPaged.length === 0 && { flex: 1 }]} // Para centrar ListEmptyComponent
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Qué tan cerca del final para llamar a onEndReached
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f57c00']}
            tintColor="#f57c00"
          />
        }
        ListFooterComponent={loading && page > 1 ? <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#f57c00" /> : null}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            {loading && page === 1 ? ( // Mostrar loader principal solo en la carga inicial de la página 1
              <ActivityIndicator size="large" color="#f57c00" />
            ) : error ? (
              <>
                <Text style={styles.errorText}>No se pudieron cargar las evidencias.</Text>
                <Text style={styles.pullDownText}>Desliza hacia abajo para intentar nuevamente.</Text>
              </>
            ) : (
              <>
                <Text style={styles.noDataText}>No hay evidencias pendientes de revisión.</Text>
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
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={handleCloseModal} style={{ position: 'absolute', top: 40, right: 20, zIndex: 1, padding: 10 }}>
            <CloseIcon size={30} color="#fff" />
          </TouchableOpacity>
          <FlatList
            data={modalArchivos}
            keyExtractor={(_archivo, idx) => `modal-archivo-${idx}`}
            horizontal
            pagingEnabled
            initialScrollIndex={modalIndex} // Usar modalIndex que se setea en handleOpenModal
            onMomentumScrollEnd={e => {
              const newCurrentIndex = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
              setCurrentModalIndex(newCurrentIndex);
            }}
            getItemLayout={(_data, index) => (
              { length: windowWidth, offset: windowWidth * index, index }
            )}
            renderItem={renderModalItem}
            style={{ flexGrow: 0 }} // Para que no intente ocupar todo el espacio verticalmente
            showsHorizontalScrollIndicator={false}
          />
          {modalArchivos.length > 1 && (
            <View style={styles.paginationContainer}>
              {modalArchivos.map((_, idx) => (
                <View
                  key={`dot-${idx}`}
                  style={[
                    styles.paginationDot,
                    currentModalIndex === idx ? styles.paginationDotActive : {},
                  ]}
                />
              ))}
            </View>
          )}
          {/* El botón de cerrar ya está arriba */}
        </View>
      </Modal>
    </View>
  );
}