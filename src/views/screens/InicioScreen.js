import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import {
  Trophy, Calendar, Clock, ArrowRight, Target, X, Upload
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useMisionViewModel } from '../../viewmodels/ParticiparViewModels.js';

export default function InicioScreen() {
  const {
    misiones,
    inscripciones,
    cargarMisiones,
    cargarInscripciones,
    enviarEvidencia,
    participarMision,
    cargarProgreso,
  } = useMisionViewModel();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMision, setModalMision] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [misionesConEstado, setMisionesConEstado] = useState([]);
  const [isLoadingMisionesUI, setIsLoadingMisionesUI] = useState(true);
  const [errorAlCargarMisiones, setErrorAlCargarMisiones] = useState(null);

  const navigation = useNavigation();

  const procesarYActualizarMisionesVisibles = useCallback(() => {
    if (!misiones || misiones.length === 0) {
      setMisionesConEstado([]);
      setIsLoadingMisionesUI(false);
      return;
    }

    const hoy = new Date();
    const misionesActualizadas = misiones
      .filter(mision => new Date(mision.fechaFin) >= hoy)
      .map((mision) => {
        const inscripcion = inscripciones?.find(insc => insc.id_mision === mision.id_mision);
        if (!inscripcion) {
          return { ...mision, estado: 'Inscribirse', disableButton: false };
        }
        if (inscripcion.estado) {
          return { ...mision, estado: 'Puntos otorgados', disableButton: true };
        }
        if (inscripcion.estadoEvidencia) {
          return { ...mision, estado: 'Ver progreso', disableButton: false };
        }
        return { ...mision, estado: 'Subir evidencia', disableButton: false };
      });

    setMisionesConEstado(misionesActualizadas);
    setIsLoadingMisionesUI(false);
  }, [misiones, inscripciones]);

  const cargarDatosCompletos = useCallback(async (esRefresh = false) => {
    if (!esRefresh) {
      setIsLoadingMisionesUI(true);
    }
    setErrorAlCargarMisiones(null);

    try {
      await cargarMisiones();
    } catch (e) {
      setErrorAlCargarMisiones(e.message || 'Error al cargar misiones');
    }

    try {
      await cargarInscripciones();
    } catch (e) {
      console.warn('Advertencia al cargar inscripciones:', e);
    }
  }, [cargarMisiones, cargarInscripciones]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarDatosCompletos();
    });

    if (misionesConEstado.length === 0) {
      cargarDatosCompletos();
    }

    return unsubscribe;
  }, [navigation, cargarDatosCompletos, misionesConEstado.length]);

  useEffect(() => {
    procesarYActualizarMisionesVisibles();
  }, [procesarYActualizarMisionesVisibles]);

  const onRefreshLocal = useCallback(async () => {
    setRefreshing(true);
    await cargarDatosCompletos(true);
    setRefreshing(false);
  }, [cargarDatosCompletos]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const calcularDiasRestantes = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diff = fin.getTime() - hoy.getTime();
    const dias = Math.ceil(diff / (1000 * 3600 * 24));
    return dias > 0 ? dias : 0;
  };

  const handleInscribirse = async (id_mision) => {
    try {
      await participarMision(id_mision);
      Alert.alert('Éxito', 'Inscripción exitosa!');
      await cargarDatosCompletos();
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo inscribir a la misión');
    }
  };

  const handleVerProgreso = async (mision) => {
    try {
      const inscripcion = inscripciones?.find(insc => insc.id_mision === mision.id_mision);
      if (!inscripcion) {
        Alert.alert('Error', 'No se pudo verificar tu inscripción');
        return;
      }
      const progresoData = await cargarProgreso(inscripcion.id_inscripcion);
      if (progresoData.status === 'otorgado') {
        Alert.alert('Información', `${progresoData.message} Has ganado ${progresoData.puntos} puntos.`);
        await cargarDatosCompletos();
      } else if (progresoData.status === 'pendiente') {
        Alert.alert('Progreso de Revisión', progresoData.message);
      } else {
        Alert.alert('Información', 'Se recibió una respuesta inesperada');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo verificar el progreso');
    }
  };

  const abrirModalEvidencia = (mision) => {
    setModalMision(mision);
    setDescripcion('');
    setArchivos([]);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setDescripcion('');
    setArchivos([]);
    setModalMision(null);
  };

  const procesarArchivosSeleccionados = (nuevosAssets, tipoFuente) => {
    const espaciosDisponibles = 5 - archivos.length;
    if (espaciosDisponibles <= 0) {
      Alert.alert('Límite alcanzado', 'Máximo 5 archivos');
      return;
    }

    const archivosAAnadir = nuevosAssets.slice(0, espaciosDisponibles).map(asset => {
      let name, mimeType;
      if (tipoFuente === 'document') {
        name = asset.name;
        mimeType = asset.mimeType;
      } else {
        name = asset.fileName || `gallery_${Date.now()}.${asset.uri.split('.').pop()}`;
        mimeType = asset.mimeType || (asset.type ? `${asset.type}/${asset.uri.split('.').pop()}` : 'application/octet-stream');
      }
      return { uri: asset.uri, name, mimeType, size: asset.size || asset.fileSize };
    });

    setArchivos(prev => [...prev, ...archivosAAnadir]);
    if (archivosAAnadir.length < nuevosAssets.length) {
      Alert.alert('Información', `Solo se agregaron ${archivosAAnadir.length} de ${nuevosAssets.length} archivos`);
    }
  };

  const seleccionarArchivosHandler = async () => {
    if (archivos.length >= 5) {
      Alert.alert('Límite alcanzado', 'Solo puedes subir hasta 5 archivos');
      return;
    }

    Alert.alert(
      "Seleccionar Archivos",
      "Elige la fuente de tus archivos:",
      [
        {
          text: "Documentos (PDF, Imágenes)",
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                multiple: true,
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true
              });
              if (!result.canceled && result.assets) {
                procesarArchivosSeleccionados(result.assets, 'document');
              }
            } catch (err) {
              Alert.alert('Error', 'No se pudo seleccionar documentos');
            }
          }
        },
        {
          text: "Galería de Imágenes/Videos",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permiso denegado', 'Se necesita acceso a la galería');
              return;
            }
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5 - archivos.length
              });
              if (!result.canceled && result.assets) {
                procesarArchivosSeleccionados(result.assets, 'gallery');
              }
            } catch (err) {
              Alert.alert('Error', 'No se pudo seleccionar de la galería');
            }
          }
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const eliminarArchivo = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubirEvidencia = async () => {
    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía');
      return;
    }
    if (archivos.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', descripcion.trim());

    archivos.forEach((archivo) => {
      formData.append('evidencia', {
        uri: Platform.OS === 'ios' ? archivo.uri.replace('file://', '') : archivo.uri,
        name: archivo.name,
        type: archivo.mimeType
      });
    });

    setSubiendo(true);
    try {
      const inscripcion = inscripciones.find(insc => insc.id_mision === modalMision.id_mision);
      if (!inscripcion) throw new Error('Inscripción no encontrada');
      await enviarEvidencia(inscripcion.id_inscripcion, formData);
      Alert.alert('Éxito', 'Evidencia subida correctamente');
      await cargarDatosCompletos();
      cerrarModal();
    } catch (e) {
      Alert.alert('Error', e.message || 'Error al subir la evidencia');
    } finally {
      setSubiendo(false);
    }
  };

  const handleButtonPress = (item) => {
    if (item.estado === 'Inscribirse') {
      handleInscribirse(item.id_mision);
    } else if (item.estado === 'Subir evidencia') {
      abrirModalEvidencia(item);
    } else if (item.estado === 'Ver progreso') {
      handleVerProgreso(item);
    }
  };

  const renderItem = ({ item }) => {
    const diasRestantes = calcularDiasRestantes(item.fechaFin);
    return (
      <View style={styles.card}>
        <View style={styles.orangeBar} />
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
          </View>
          <View style={styles.iconCircle}>
            <Target size={22} color="#f97316" />
          </View>
        </View>
        <View style={styles.puntosContainer}>
          <View style={styles.puntosBox}>
            <Trophy size={20} color="#ca8a04" />
            <Text style={styles.puntosValor}>{item.puntos}</Text>
            <Text style={styles.puntosTexto}>puntos</Text>
          </View>
        </View>
        <View>
          <View style={styles.fechaRow}>
            <Calendar size={16} color="#15803d" />
            <Text style={styles.fechaLabel}>Inicio:</Text>
            <Text style={styles.fechaValor}>{formatearFecha(item.fechaInicio)}</Text>
          </View>
          <View style={styles.fechaRow}>
            <Clock size={16} color="#b91c1c" />
            <Text style={styles.fechaLabel}>Finaliza:</Text>
            <Text style={styles.fechaValor}>{formatearFecha(item.fechaFin)}</Text>
          </View>
        </View>
        <View style={styles.diasRestantesContainer}>
          <Text style={styles.diasRestantesValor}>{diasRestantes}</Text>
          <Text style={styles.diasRestantesTexto}>días restantes</Text>
        </View>
        {diasRestantes <= 7 && diasRestantes > 0 && (
          <Text style={styles.tiempoLimitado}>¡Tiempo limitado!</Text>
        )}
        <TouchableOpacity
          style={[styles.button, item.disableButton && styles.buttonDisabled]}
          disabled={item.disableButton}
          onPress={() => handleButtonPress(item)}
        >
          <Text style={styles.buttonText}>{item.estado}</Text>
          {item.estado !== 'Puntos otorgados' && <ArrowRight size={18} color="white" />}
        </TouchableOpacity>
        <Text style={styles.infoExtra}>🎯 Completa la misión y gana puntos</Text>
      </View>
    );
  };

  if (isLoadingMisionesUI && misionesConEstado.length === 0 && !errorAlCargarMisiones) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={misionesConEstado}
        keyExtractor={(item) => item._id || item.id_mision?.toString() || `mision-${Math.random()}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefreshLocal}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {isLoadingMisionesUI ? (
              <Text style={styles.emptyText}>Cargando misiones...</Text>
            ) : (
              <Text style={styles.emptyText}>No hay misiones disponibles en este momento.</Text>
            )}
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Subir Inscripción</Text>
                <Text style={styles.modalSubtitle}>
                  Completa tu inscripción y adjunta los documentos necesarios
                </Text>
              </View>
              <TouchableOpacity
                onPress={cerrarModal}
                style={styles.closeButton}
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Descripción de la Inscripción</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe tu inscripción aquí..."
                  placeholderTextColor="#9ca3af"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.documentsContainer}>
                <Text style={styles.documentsTitle}>Documentos (Imágenes o PDFs)</Text>
                <TouchableOpacity
                  style={styles.uploadArea}
                  onPress={seleccionarArchivosHandler}
                  disabled={subiendo || archivos.length >= 5}
                >
                  <Upload
                    size={48}
                    color={archivos.length >= 5 ? "#d1d5db" : "#9ca3af"}
                  />
                  <Text
                    style={[styles.uploadText, archivos.length >= 5 && { color: "#d1d5db" }]}
                  >
                    {archivos.length >= 5
                      ? "Límite de 5 archivos alcanzado"
                      : "Haz clic para seleccionar archivos"}
                  </Text>
                  {archivos.length < 5 && (
                    <Text style={styles.uploadSubtext}>
                      Imágenes (JPG, PNG) o PDFs
                    </Text>
                  )}
                </TouchableOpacity>
                {archivos.length > 0 && (
                  <View style={styles.archivosContainer}>
                    {archivos.map((archivo, index) => (
                      <View key={index} style={styles.archivoItem}>
                        <Text
                          style={styles.archivoNombre}
                          numberOfLines={1}
                        >
                          {archivo.name || `Archivo ${index + 1}`}
                        </Text>
                        <TouchableOpacity
                          style={styles.eliminarBtn}
                          onPress={() => eliminarArchivo(index)}
                          disabled={subiendo}
                        >
                          <X size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cerrarModal}
                disabled={subiendo}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (subiendo || archivos.length === 0 || !descripcion.trim()) &&
                    styles.submitButtonDisabled
                ]}
                onPress={handleSubirEvidencia}
                disabled={subiendo || archivos.length === 0 || !descripcion.trim()}
              >
                {subiendo ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Subir Inscripción</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  orangeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: '#f97316'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
    marginBottom: 2
  },
  descripcion: {
    fontSize: 15,
    color: '#4b5563',
    textTransform: 'capitalize',
    lineHeight: 20
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#fed7aa'
  },
  puntosContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  puntosBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fef3c7'
  },
  puntosValor: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginHorizontal: 8
  },
  puntosTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563'
  },
  fechaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12
  },
  fechaLabel: {
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
    fontSize: 14
  },
  fechaValor: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14
  },
  diasRestantesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 18,
    gap: 4
  },
  diasRestantesValor: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827'
  },
  diasRestantesTexto: {
    fontSize: 15,
    color: '#6b7280'
  },
  tiempoLimitado: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    backgroundColor: '#fee2e2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'center'
  },
  button: {
    marginTop: 18,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.8
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600'
  },
  infoExtra: {
    marginTop: 14,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginTop: 2
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6'
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top'
  },
  documentsContainer: {
    marginBottom: 20
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: 12
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginTop: 10,
    textAlign: 'center'
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center'
  },
  archivosContainer: {
    marginTop: 8,
    maxHeight: 120
  },
  archivoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8
  },
  archivoNombre: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginRight: 10
  },
  eliminarBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  submitButton: {
    flex: 1.5,
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#fdba74',
    opacity: 0.7
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});