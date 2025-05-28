import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, Modal, KeyboardAvoidingView,
  Platform, Image, RefreshControl,
} from 'react-native';

import { styles, modalStyles } from '../../styles/AdminScreen.styles.js';

import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAdminConfViewModel } from '../../viewmodels/AdminConfViewModel';

const PAGE_SIZE = 5;

function insertLineBreaks(text, wordsPerLine = 4) {
  if (!text) return '';
  const words = text.split(' ');
  let result = '';
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    if ((i + 1) % wordsPerLine === 0 && i !== words.length - 1) {
      result += '\n';
    } else {
      result += ' ';
    }
  }
  return result.trim();
}

const Section = ({
  title, data = [], searchPlaceholder, searchField,
  onCreate, onEdit, onDelete,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const safeData = Array.isArray(data) ? data : [];
  const filtered = safeData.filter(item =>
    (item[searchField] || '').toString().toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmDelete = (item) => {
    let idToDelete = null;
    switch (title) {
      case 'Insignias':
        idToDelete = item.id_insignia;
        break;
      case 'Usuarios':
        idToDelete = item.id_usuario || item.id || item._id;
        break;
      case 'Misiones':
        idToDelete = item.id_mision || item.id || item._id;
        break;
      case 'Actividades':
        idToDelete = item.id_actividad || item.id || item._id;
        break;
      case 'Recompensas':
        idToDelete = item.id_recompensa || item.id || item._id;
        break;
      default:
        idToDelete = item.id || item._id;
        break;
    }
    Alert.alert(
      `Eliminar ${title}`,
      `¿Seguro que quieres eliminar "${item[searchField]}"?`,
      [
        { text: 'Cancelar' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(idToDelete),
        },
      ]
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapsed(!collapsed)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.collapseIcon}>{collapsed ? '+' : '-'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <>
          <View style={styles.searchCreateRow}>
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={search}
              onChangeText={setSearch}
              clearButtonMode="while-editing"
            />
            <TouchableOpacity style={styles.createButton} onPress={onCreate}>
              <Text style={styles.createButtonText}>Crear {title}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>No.</Text>

              {title === 'Insignias' ? (
                <>
                  <Text style={[styles.tableHeaderCell, { minWidth: 120 }]}>Nombre</Text>
                  <Text style={[styles.tableHeaderCell, { minWidth: 220 }]}>Descripción</Text>
                  <Text style={[styles.tableHeaderCell, { minWidth: 100 }]}>Puntos Requeridos</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.tableHeaderCell, { minWidth: 120 }]}>Nombre</Text>
                  {title === 'Usuarios' && <Text style={[styles.tableHeaderCell, { minWidth: 120 }]}>Apellido</Text>}
                  {title === 'Usuarios' && <Text style={[styles.tableHeaderCell, { minWidth: 220 }]}>Correo</Text>}
                  {(title === 'Actividades' || title === 'Misiones') && (
                    <>
                      <Text style={[styles.tableHeaderCell, { minWidth: 220 }]}>Descripción</Text>
                      <Text style={[styles.tableHeaderCell, { minWidth: 120 }]}>Fecha Inicio</Text>
                      <Text style={[styles.tableHeaderCell, { minWidth: 120 }]}>Fecha Fin</Text>
                    </>
                  )}
                  {title === 'Usuarios' && <Text style={[styles.tableHeaderCell, { minWidth: 120 }]}>Rol</Text>}
                  {title === 'Misiones' && <Text style={[styles.tableHeaderCell, { minWidth: 80 }]}>Puntos</Text>}
                  {title === 'Recompensas' && (
                    <>
                      <Text style={[styles.tableHeaderCell, { minWidth: 80 }]}>Puntos</Text>
                      <Text style={[styles.tableHeaderCell, { minWidth: 80 }]}>Disponible</Text>
                    </>
                  )}
                </>
              )}
              <Text style={[styles.tableHeaderCell, { flex: 1, minWidth: 140 }]}>Acciones</Text>
            </View>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator>
            <FlatList
              data={pageData}
              keyExtractor={(item, idx) => {
                switch (title) {
                  case 'Insignias':
                    return item.id_insignia?.toString() || idx.toString();
                  case 'Usuarios':
                    return (item.id_usuario || item.id || item._id)?.toString() || idx.toString();
                  case 'Misiones':
                    return (item.id_mision || item.id || item._id)?.toString() || idx.toString();
                  case 'Actividades':
                    return (item.id_actividad || item.id || item._id)?.toString() || idx.toString();
                  case 'Recompensas':
                    return (item.id_recompensa || item.id || item._id)?.toString() || idx.toString();
                  default:
                    return (item.id || item._id)?.toString() || idx.toString();
                }
              }}
              renderItem={({ item, index }) => (
                <View style={styles.tableRow}>
                  <View style={[styles.cell, { flex: 0.5, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>{(page - 1) * PAGE_SIZE + index + 1}</Text>
                  </View>

                  {title === 'Insignias' ? (
                    <>
                      <View style={[styles.cell, { minWidth: 120 }]}>
                        <Text style={{ flexWrap: 'wrap' }}>{item.nombre}</Text>
                      </View>
                      <View style={[styles.cell, { minWidth: 220 }]}>
                        <Text style={{ flexWrap: 'wrap' }}>{item.descripcion}</Text>
                      </View>
                      <View style={[styles.cell, { minWidth: 100, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text>{item.puntosrequeridos}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={[styles.cell, { minWidth: 120 }]}>
                        <Text style={{ flexWrap: 'wrap' }}>{insertLineBreaks(item.nombre || item.titulo || '', 2)}</Text>
                      </View>
                      {title === 'Usuarios' && (
                        <>
                          <View style={[styles.cell, { minWidth: 120 }]}>
                            <Text style={{ flexWrap: 'wrap' }}>{insertLineBreaks(item.apellido || '', 4)}</Text>
                          </View>
                          <View style={[styles.cell, { minWidth: 220 }]}>
                            <Text style={{ flexWrap: 'wrap' }}>{insertLineBreaks(item.correo || '', 4)}</Text>
                          </View>
                          <View style={[styles.cell, { minWidth: 120, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>{item.rol}</Text>
                          </View>
                        </>
                      )}
                      {(title === 'Actividades' || title === 'Misiones') && (
                        <>
                          <View style={[styles.cell, { minWidth: 220 }]}>
                            <Text style={{ flexWrap: 'wrap' }}>{insertLineBreaks(item.descripcion || '', 4)}</Text>
                          </View>
                          <View style={[styles.cell, { minWidth: 120, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>{item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString() : ''}</Text>
                          </View>
                          <View style={[styles.cell, { minWidth: 120, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>{item.fechaFin ? new Date(item.fechaFin).toLocaleDateString() : ''}</Text>
                          </View>
                        </>
                      )}
                      {title === 'Misiones' && (
                        <View style={[styles.cell, { minWidth: 80, justifyContent: 'center', alignItems: 'center' }]}>
                          <Text>{item.puntos}</Text>
                        </View>
                      )}
                      {title === 'Recompensas' && (
                        <>
                          <View style={[styles.cell, { minWidth: 80, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>{item.puntosRequeridos}</Text>
                          </View>
                          <View style={[styles.cell, { minWidth: 80, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>{item.cantidadDisponible}</Text>
                          </View>
                        </>
                      )}
                    </>
                  )}

                  <View
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        minWidth: 140,
                        flexDirection: 'row',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => onEdit(item)}
                    >
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => confirmDelete(item)}
                    >
                      <Text style={styles.actionText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={{ padding: 10, textAlign: 'center' }}>No hay {title.toLowerCase()}.</Text>}
            />
          </ScrollView>

          <View style={styles.pagination}>
            <TouchableOpacity style={[styles.pageButton, page === 1 && styles.disabledButton]} disabled={page === 1} onPress={() => setPage(page - 1)}>
              <Text>Anterior</Text>
            </TouchableOpacity>
            <Text style={styles.pageNumber}>{page}</Text>
            <TouchableOpacity style={[styles.pageButton, page === totalPages && styles.disabledButton]} disabled={page === totalPages} onPress={() => setPage(page + 1)}>
              <Text>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const ModalForm = ({ visible, onClose, onSubmit, title, fields, formData, setFormData, loading, modalType }) => {
  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(null);

  React.useEffect(() => {
    if (modalType === 'insignia' && formData.nuevaImagen?.uri) {
      setImageUri(formData.nuevaImagen.uri);
    } else if (modalType === 'usuario' && formData.foto_perfil) {
      setImageUri(formData.foto_perfil[0]?.url || null);
    } else {
      setImageUri(null);
    }
  }, [formData, modalType]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData({
        ...formData,
        nuevaImagen: {
          uri: result.assets[0].uri,
          name: 'imagen.jpg',
          type: 'image/jpeg',
        },
      });
      setImageUri(result.assets[0].uri);
    }
  };

  const minUserBirthDate = new Date();
  minUserBirthDate.setFullYear(minUserBirthDate.getFullYear() - 8);

  const validateDates = () => {
    if (modalType === 'usuario') {
      if (!formData.correo) {
        Alert.alert('Error', 'Debe ingresar un correo electrónico');
        return false;
      }
      if (!formData.correo.includes('@') || !formData.correo.includes('.')) {
        Alert.alert('Error', 'Correo electrónico inválido');
        return false;
      }
      if (!formData.fecha_nacimiento) {
        Alert.alert('Error', 'Debe ingresar la fecha de nacimiento');
        return false;
      }
      const birthDate = new Date(formData.fecha_nacimiento);
      const minUserBirthDate = new Date();
      minUserBirthDate.setFullYear(minUserBirthDate.getFullYear() - 8);
      if (birthDate > minUserBirthDate) {
        Alert.alert('Error', 'La fecha de nacimiento debe ser al menos 8 años atrás');
        return false;
      }
    }
    if (modalType === 'mision' || modalType === 'actividad') {
      if (formData.fechaInicio && formData.fechaFin) {
        const inicio = new Date(formData.fechaInicio);
        const fin = new Date(formData.fechaFin);
        if (fin < inicio) {
          Alert.alert('Error', 'La fecha de fin no puede ser anterior a la fecha de inicio');
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateDates()) return;

    if (modalType === 'insignia' && !formData.nuevaImagen && !currentEditId) {
      Alert.alert('Error', 'Debe enviar una imagen para la insignia');
      return;
    }

    onSubmit();
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(null);
    if (event.type === 'dismissed') return;
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        [showDatePicker]: selectedDate.toISOString(),
      }));
    }
  };

  const renderFields = () => fields.map(({ label, key, type = 'text' }) => {
    if (modalType === 'usuario' && key === 'rol') {
      return (
        <View key={key} style={modalStyles.fieldContainer}>
          <Text style={modalStyles.fieldLabel}>{label}</Text>
          <TextInput style={[modalStyles.input, { backgroundColor: '#eee' }]} value={formData[key]} editable={false} />
        </View>
      );
    }

    if (modalType === 'insignia' && key === 'imagen') {
      return (
        <View key="imagen" style={modalStyles.fieldContainer}>
          {imageUri && <Image source={{ uri: imageUri }} style={modalStyles.imagePreview} />}
          <TouchableOpacity style={modalStyles.imagePickerButton} onPress={pickImage}>
            <Text style={modalStyles.imagePickerText}>Cambiar Imagen</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (type === 'date') {
      return (
        <View key={key} style={modalStyles.fieldContainer}>
          <Text style={modalStyles.fieldLabel}>{label}</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(key)} style={[modalStyles.input, { justifyContent: 'center' }]}>
            <Text>{formData[key] ? new Date(formData[key]).toLocaleDateString() : 'Seleccionar fecha'}</Text>
          </TouchableOpacity>
          {showDatePicker === key && (
            <DateTimePicker
              value={formData[key] ? new Date(formData[key]) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={modalType === 'usuario' ? minUserBirthDate : undefined}
            />
          )}
        </View>
      );
    }

    return (
      <View key={key} style={modalStyles.fieldContainer}>
        <Text style={modalStyles.fieldLabel}>{label}</Text>
        <TextInput
          style={modalStyles.input}
          value={formData[key]}
          onChangeText={text => setFormData({ ...formData, [key]: text })}
          placeholder={label}
          keyboardType={type === 'number' ? 'numeric' : 'default'}
        />
      </View>
    );
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={modalStyles.modalOverlay}
      >
        <ScrollView
          contentContainerStyle={modalStyles.modalContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <Text style={modalStyles.modalTitle}>{title}</Text>
          {renderFields()}
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.submitButton} onPress={handleSave} disabled={loading}>
              <Text style={modalStyles.submitButtonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose} disabled={loading}>
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function AdminScreen() {
  const {
    loading,
    error,
    actividades,
    misiones,
    usuarios,
    recompensas,
    insignias,

    cargarActividades,
    agregarActividad,
    modificarActividad,
    borrarActividad,

    cargarMisiones,
    crearNuevaMision,
    editarMisionPorId,
    eliminarMisionPorId,

    cargarUsuarios,
    crearAdminUsuario,
    editarUsuario,
    eliminarUsuarioPorId,

    cargarRecompensas,
    crearNuevaRecompensa,
    editarRecompensaPorId,
    eliminarRecompensaPorId,

    cargarInsignias,
    crearNuevaInsignia,
    editarInsigniaPorId,
    eliminarInsigniaPorId,
  } = useAdminConfViewModel();

  // Pull to refresh
  const [refreshing, setRefreshing] = useState(false);

  // Función para recargar datos (usada en pull to refresh)
  const loadAllData = async () => {
    try {
      await Promise.all([
        cargarActividades(),
        cargarMisiones(),
        cargarUsuarios(),
        cargarRecompensas(),
        cargarInsignias(),
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Pull to refresh (swipe down)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      try {
        await loadAllData();
      } catch { }
    })();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentEditId, setCurrentEditId] = useState(null);

  const formFields = {
    usuario: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Apellido', key: 'apellido' },
      { label: 'Correo', key: 'correo' },
      { label: 'Rol', key: 'rol' },
      { label: 'Fecha de Nacimiento', key: 'fecha_nacimiento', type: 'date' },
    ],
    actividad: [
      { label: 'Título', key: 'titulo' },
      { label: 'Descripción', key: 'descripcion', type: 'textarea' },
      { label: 'Fecha Inicio', key: 'fechaInicio', type: 'date' },
      { label: 'Fecha Fin', key: 'fechaFin', type: 'date' },
    ],
    mision: [
      { label: 'Título', key: 'titulo' },
      { label: 'Descripción', key: 'descripcion', type: 'textarea' },
      { label: 'Puntos', key: 'puntos', type: 'number' },
      { label: 'Fecha Inicio', key: 'fechaInicio', type: 'date' },
      { label: 'Fecha Fin', key: 'fechaFin', type: 'date' },
    ],
    recompensa: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Descripción', key: 'descripcion', type: 'textarea' },
      { label: 'Puntos Requeridos', key: 'puntosRequeridos', type: 'number' },
      { label: 'Cantidad Disponible', key: 'cantidadDisponible', type: 'number' },
    ],
    insignia: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Descripción', key: 'descripcion', type: 'textarea' },
      { label: 'Puntos Requeridos', key: 'puntosrequeridos', type: 'number' },
      { label: 'Imagen', key: 'imagen' },
    ],
  };

  const handleOpenCreateModal = (type) => {
    setModalType(type);
    setFormData({});
    setCurrentEditId(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (type, item) => {
    setModalType(type);
    setFormData(item);

    let id = null;

    if (type === 'usuario') {
      id = item.id_usuario;
    } else if (type === 'misiones' || type === 'mision') {
      id = item.id_mision;
    } else if (type === 'actividades' || type === 'actividad') {
      id = item.id_actividad;
    } else if (type === 'recompensas' || type === 'recompensa') {
      id = item.id_recompensa;
    } else if (type === 'insignias' || type === 'insignia') {
      id = item.id_insignia;
    } else {
      id = item.id || item._id;
    }

    setCurrentEditId(id);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      if (modalType === 'insignia') {
        const fd = new FormData();
        fd.append('nombre', formData.nombre || '');
        fd.append('descripcion', formData.descripcion || '');
        fd.append('puntosrequeridos', formData.puntosrequeridos || 0);

        if (formData.nuevaImagen) {
          fd.append('insignia', {
            uri: formData.nuevaImagen.uri,
            name: formData.nuevaImagen.name || 'imagen.jpg',
            type: formData.nuevaImagen.type || 'image/jpeg',
          });
        } else if (!currentEditId) {
          Alert.alert('Error', 'Debe enviar una imagen para la insignia');
          return;
        }

        if (currentEditId) {
          await editarInsigniaPorId(currentEditId, fd);
        } else {
          await crearNuevaInsignia(fd);
        }
      } else {
        if (currentEditId) {
          switch (modalType) {
            case 'usuario': {
              const { rol, ...formDataWithoutRol } = formData;
              await editarUsuario(currentEditId, formDataWithoutRol);
              break;
            }
            case 'actividad':
              await modificarActividad(currentEditId, formData);
              break;
            case 'mision':
              await editarMisionPorId(currentEditId, formData);
              break;
            case 'recompensa': {
              const payload = {
                nombre: formData.nombre || '',
                descripcion: formData.descripcion || '',
                puntosRequeridos: Number(formData.puntosRequeridos) || 0,
                cantidadDisponible: Number(formData.cantidadDisponible) || 0,
              };
              await editarRecompensaPorId(currentEditId, payload);
              break;
            }
          }
        } else {
          switch (modalType) {
            case 'usuario':
              const minDate = new Date();
              minDate.setFullYear(minDate.getFullYear() - 8);
              if (!formData.fecha_nacimiento) {
                Alert.alert('Error', 'Debe ingresar la fecha de nacimiento');
                return;
              }
              if (new Date(formData.fecha_nacimiento) > minDate) {
                Alert.alert('Error', 'La fecha de nacimiento debe ser al menos 8 años atrás');
                return;
              }
              await crearAdminUsuario(formData);
              break;
            case 'actividad':
              await agregarActividad(formData);
              break;
            case 'mision':
              await crearNuevaMision(formData);
              break;
            case 'recompensa': {
              const payload = {
                nombre: formData.nombre || '',
                descripcion: formData.descripcion || '',
                puntosRequeridos: Number(formData.puntosRequeridos) || 0,
                cantidadDisponible: Number(formData.cantidadDisponible) || 0,
              };
              await crearNuevaRecompensa(payload);
              break;
            }
          }
        }
      }

      setModalVisible(false);

      switch (modalType) {
        case 'usuario': await cargarUsuarios(); break;
        case 'actividad': await cargarActividades(); break;
        case 'mision': await cargarMisiones(); break;
        case 'recompensa': await cargarRecompensas(); break;
        case 'insignia': await cargarInsignias(); break;
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar: ' + error.message);
    }
  };

  const onDeleteUsuario = async (id) => {
    Alert.alert('Eliminar usuario', '¿Confirmar?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await eliminarUsuarioPorId(id);
            await cargarUsuarios();
            Alert.alert('Éxito', 'Usuario eliminado');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const onDeleteActividad = async (id) => {
    Alert.alert('Eliminar actividad', '¿Confirmar?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await borrarActividad(id);
            await cargarActividades();
            Alert.alert('Éxito', 'Actividad eliminada');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const onDeleteMision = async (id) => {
    Alert.alert('Eliminar misión', '¿Confirmar?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await eliminarMisionPorId(id);
            await cargarMisiones();
            Alert.alert('Éxito', 'Misión eliminada');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const onDeleteRecompensa = async (id) => {
    Alert.alert('Eliminar recompensa', '¿Confirmar?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await eliminarRecompensaPorId(id);
            await cargarRecompensas();
            Alert.alert('Éxito', 'Recompensa eliminada');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const onDeleteInsignia = async (id_insignia) => {
    Alert.alert('Eliminar insignia', '¿Confirmar?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarInsigniaPorId(id_insignia);
            await cargarInsignias();
            Alert.alert('Éxito', 'Insignia eliminada');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f57c00']}
            tintColor="#f57c00"
          />
        }
      >
        <Section
          title="Usuarios"
          data={usuarios}
          searchPlaceholder="Buscar por nombre"
          searchField="nombre"
          onCreate={() => handleOpenCreateModal('usuario')}
          onEdit={(item) => handleOpenEditModal('usuario', item)}
          onDelete={onDeleteUsuario}
        />

        <Section
          title="Misiones"
          data={misiones}
          searchPlaceholder="Buscar por título"
          searchField="titulo"
          onCreate={() => handleOpenCreateModal('mision')}
          onEdit={(item) => handleOpenEditModal('mision', item)}
          onDelete={onDeleteMision}
        />

        <Section
          title="Actividades"
          data={actividades}
          searchPlaceholder="Buscar por título"
          searchField="titulo"
          onCreate={() => handleOpenCreateModal('actividad')}
          onEdit={(item) => handleOpenEditModal('actividad', item)}
          onDelete={onDeleteActividad}
        />

        <Section
          title="Recompensas"
          data={recompensas}
          searchPlaceholder="Buscar por nombre"
          searchField="nombre"
          onCreate={() => handleOpenCreateModal('recompensa')}
          onEdit={(item) => handleOpenEditModal('recompensa', item)}
          onDelete={onDeleteRecompensa}
        />

        <Section
          title="Insignias"
          data={insignias}
          searchPlaceholder="Buscar por nombre"
          searchField="nombre"
          onCreate={() => handleOpenCreateModal('insignia')}
          onEdit={(item) => handleOpenEditModal('insignia', item)}
          onDelete={onDeleteInsignia}
        />

      </ScrollView>

      <ModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        title={modalType ? (currentEditId ? `Editar ${modalType}` : `Crear ${modalType}`) : ''}
        fields={modalType ? formFields[modalType] : []}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        modalType={modalType}
      />
    </View>
  );
}
