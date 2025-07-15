import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';

// Importa los nuevos estilos
import { styles, modalStyles } from '../../styles/AdminScreen.styles.js';

import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAdminConfViewModel } from '../../viewmodels/AdminConfViewModel';

const ListItemCard = ({ item, title, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  let mainText = '';
  let subText = '';
  // ✅ CORRECCIÓN: Agregar imagenUrl para recompensas
  let imageUrl = item.foto_perfil?.[0]?.url ||
    item.imagenUrl || // ← NUEVO: para recompensas
    item.imagen ||
    item.imagenes?.[0]?.url;

  switch (title) {
    case 'Usuarios':
      mainText = `${item.nombre} ${item.apellido}`;
      subText = item.rol;
      break;
    case 'Misiones':
      mainText = item.titulo;
      subText = `${item.puntos} puntos`;
      break;
    case 'Actividades':
      mainText = item.titulo;
      subText = `Finaliza: ${new Date(item.fechaFin).toLocaleDateString()}`;
      break;
    case 'Recompensas':
      mainText = item.nombre;
      subText = `${item.puntosRequeridos} puntos`;
      break;
    case 'Insignias':
      mainText = item.nombre;
      subText = `${item.puntosrequeridos} puntos`;
      break;
    default:
      mainText = item.nombre || item.titulo;
      subText = item.descripcion;
  }

  return (
    <View style={styles.listItemContainer}>
      <TouchableOpacity
        style={styles.listItemHeader}
        onPress={() => setExpanded(!expanded)}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{mainText}</Text>
          <Text style={styles.itemSubtitle}>{subText}</Text>
        </View>
        <Text style={styles.itemExpandIcon}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(item)}
          >
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(item)}
          >
            <Text style={styles.actionText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Section = ({
  title,
  data = [],
  searchPlaceholder,
  searchField,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [search, setSearch] = useState('');

  const safeData = Array.isArray(data) ? data : [];
  const filtered = safeData.filter((item) =>
    (item[searchField] || '').toString().toLowerCase().includes(search.toLowerCase()),
  );

  const confirmDelete = (item) => {
    const idToDelete =
      item.id_insignia ||
      item.id_usuario ||
      item.id_mision ||
      item.id_actividad ||
      item.id_recompensa ||
      item.id ||
      item._id;
    Alert.alert(
      `Eliminar ${title.slice(0, -1)}`,
      `¿Seguro que quieres eliminar "${item[searchField]}"?`,
      [
        { text: 'Cancelar' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(idToDelete),
        },
      ],
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setCollapsed(!collapsed)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.collapseIcon}>{collapsed ? '+' : '-'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.expandedContent}>
          <View style={styles.searchCreateRow}>
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.createButton} onPress={onCreate}>
              <Text style={styles.createButtonText}>Crear</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.resultsCount}>
            {filtered.length} {title.toLowerCase()} encontrados
          </Text>

          <FlatList
            scrollEnabled={false}
            data={filtered}
            keyExtractor={(item) =>
              (
                item.id_insignia ||
                item.id_usuario ||
                item.id_mision ||
                item.id_actividad ||
                item.id_recompensa ||
                item.id ||
                item._id
              )?.toString()
            }
            renderItem={({ item }) => (
              <ListItemCard
                item={item}
                title={title}
                onEdit={onEdit}
                onDelete={confirmDelete}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No hay {title.toLowerCase()}.</Text>
            }
          />
        </View>
      )}
    </View>
  );
};

// --- COMPONENTE MODALFORM ---
const ModalForm = ({
  visible,
  onClose,
  onSubmit,
  title,
  fields,
  formData,
  setFormData,
  loading,
  modalType,
  currentEditId,
}) => {
  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if ((modalType === 'insignia' || modalType === 'recompensa') && formData.nuevaImagen?.uri) {
      setImageUri(formData.nuevaImagen.uri);
    } else if (modalType === 'recompensa' && formData.imagenUrl) {
      setImageUri(formData.imagenUrl);
    } else if (modalType === 'insignia' && formData.imagenes?.[0]?.url) {
      setImageUri(formData.imagenes[0].url);
    } else if (modalType === 'usuario' && formData.foto_perfil) {
      setImageUri(formData.foto_perfil[0]?.url || null);
    } else {
      setImageUri(null);
    }
  }, [formData, modalType]);

  React.useEffect(() => {
    // Limpiar errores cuando se abre el modal
    if (visible) {
      setErrors({});
    }
  }, [visible]);
  // Validaciones
  const validateText = (text) => {

    // Permitir texto vacío
    if (text === '' || text === null || text === undefined) {
      return true;
    }

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const isValid = regex.test(text);
    return isValid;
  };

  const validateNumber = (number) => {

    // Permitir strings vacíos y números válidos >= 0
    if (number === '' || number === null || number === undefined) {
      return true; // Campo vacío es válido inicialmente
    }

    const numValue = parseFloat(number);
    const isValid = !isNaN(numValue) && numValue >= 0;
    return isValid;
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return (age - 1) >= 8;
    }
    return age >= 8;
  };

  const validateDate = (date, isEndDate = false, startDate = null, isUserBirthDate = false) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (isUserBirthDate && modalType === 'usuario') {
      if (selectedDate > today) {
        return false;
      }
      return validateAge(date);
    }

    if (!isEndDate) {
      return selectedDate >= today;
    } else {
      if (startDate) {
        const start = new Date(startDate);
        return selectedDate >= start;
      }
      return selectedDate >= today;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTextChange = (key, value) => {


    if (key === 'nombre' || key === 'apellido' || key === 'titulo') {
      if (value === '' || validateText(value)) {
        setFormData({ ...formData, [key]: value });
        setErrors({ ...errors, [key]: null });
      } else {
        setErrors({ ...errors, [key]: 'Solo se permiten letras' });
      }
    } else if (key === 'correo') {
      setFormData({ ...formData, [key]: value });
      if (value === '') {
        setErrors({ ...errors, [key]: null });
      } else if (!validateEmail(value)) {
        setErrors({ ...errors, [key]: 'Ingresa un correo válido (ejemplo@dominio.com)' });
      } else {
        setErrors({ ...errors, [key]: null });
      }
    } else {
      // Para descripcion y otros campos de texto libre
      setFormData({ ...formData, [key]: value });
      setErrors({ ...errors, [key]: null });
    }
  };

  const handleNumberChange = (key, value) => {

    if (value === '' || (validateNumber(parseFloat(value)) && parseFloat(value) >= 0)) {
      setFormData({ ...formData, [key]: value });
      setErrors({ ...errors, [key]: null });
    } else {
      setErrors({ ...errors, [key]: 'Solo números positivos' });
    }
  };

  const handleDateChange = (key, value, isEndDate = false) => {
    const startDateKey = key === 'fechaFin' ? 'fechaInicio' : null;
    const startDate = startDateKey ? formData[startDateKey] : null;
    const isUserBirthDate = key === 'fecha_nacimiento' && modalType === 'usuario';

    if (validateDate(value, isEndDate, startDate, isUserBirthDate)) {
      setFormData({ ...formData, [key]: value });
      setErrors({ ...errors, [key]: null });
    } else {
      let errorMsg = '';

      if (isUserBirthDate) {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
          errorMsg = 'La fecha de nacimiento no puede ser futura';
        } else {
          errorMsg = 'El usuario debe ser mayor de 8 años';
        }
      } else if (isEndDate) {
        errorMsg = 'La fecha de fin debe ser posterior a la fecha de inicio';
      } else {
        errorMsg = 'La fecha no puede ser anterior a hoy';
      }

      setErrors({ ...errors, [key]: errorMsg });
    }
  };

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
      const imageData = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || 'imagen.jpg',
        type: result.assets[0].mimeType || 'image/jpeg',
      };
      setFormData({
        ...formData,
        nuevaImagen: imageData,
      });
      setImageUri(result.assets[0].uri);
    }
  };

  const validateDates = () => {
    if (formData.fechaInicio && formData.fechaFin) {
      return validateDate(formData.fechaFin, true, formData.fechaInicio);
    }
    return true;
  };

  const handleSave = () => {


    if (modalType === 'usuario') {
      if (!formData.correo || formData.correo.trim() === '') {
        Alert.alert('Error', 'El correo electrónico es obligatorio');
        return;
      }

      if (!validateEmail(formData.correo)) {
        Alert.alert('Error', 'Ingresa un correo electrónico válido');
        return;
      }

      if (!formData.fecha_nacimiento) {
        Alert.alert('Error', 'La fecha de nacimiento es obligatoria');
        return;
      }

      if (!validateAge(formData.fecha_nacimiento)) {
        Alert.alert('Error', 'El usuario debe ser mayor de 8 años');
        return;
      }
    }

    // ✅ CORRECCIÓN: Solo validar errores relevantes para el tipo actual
    const camposRelevantes = {
      'usuario': ['nombre', 'apellido', 'correo', 'fecha_nacimiento'],
      'recompensa': ['nombre', 'descripcion', 'puntosRequeridos', 'cantidadDisponible'],
      'insignia': ['nombre', 'descripcion', 'puntosrequeridos'],
      'actividad': ['titulo', 'descripcion', 'fechaInicio', 'fechaFin'],
      'mision': ['titulo', 'descripcion', 'puntos', 'fechaInicio', 'fechaFin']
    };

    const camposDelTipo = camposRelevantes[modalType] || [];
    const erroresRelevantes = camposDelTipo.filter(campo =>
      errors[campo] !== null &&
      errors[campo] !== undefined &&
      errors[campo] !== ''
    );

    if (erroresRelevantes.length > 0) {
      // 🔍 DEBUG: Mostrar qué errores específicos están bloqueando
      const errorList = erroresRelevantes
        .map(campo => `${campo}: ${errors[campo]}`)
        .join('\n');

      Alert.alert('Error', `Errores encontrados:\n${errorList}`);
      return;
    }

    // Validar fechas solo para tipos que las usan
    if (['actividad', 'mision'].includes(modalType) && !validateDates()) {
      Alert.alert('Error', 'Las fechas no son válidas');
      return;
    }

    if ((modalType === 'insignia' || modalType === 'recompensa') && !formData.nuevaImagen && !currentEditId) {
      // Verificar si es recompensa y ya tiene imagenUrl (editando)
      if (modalType === 'recompensa' && formData.imagenUrl) {
        // Está editando y ya tiene imagen, no es necesario subir nueva
      } else {
        Alert.alert('Error', 'Debe seleccionar una imagen.');
        return;
      }
    }

    onSubmit();
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(null);
    if (event.type === 'dismissed') return;
    if (selectedDate) {
      const isEndDate = showDatePicker === 'fechaFin';
      handleDateChange(showDatePicker, selectedDate.toISOString(), isEndDate);
    }
  };

  // ... resto del código renderFields permanece igual ...
  const renderFields = () =>
    fields.map(({ label, key, type = 'text' }) => {


      if ((modalType === 'insignia' || modalType === 'recompensa') && key === 'imagen') {
        return (
          <View key="imagen" style={modalStyles.fieldContainer}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={modalStyles.imagePreview} />
            )}
            <TouchableOpacity
              style={modalStyles.imagePickerButton}
              onPress={pickImage}
            >
              <Text style={modalStyles.imagePickerText}>
                {currentEditId ? 'Cambiar Imagen' : 'Cargar Imagen'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      if (type === 'date') {
        const isUserBirthDate = key === 'fecha_nacimiento' && modalType === 'usuario';
        const maxDate = isUserBirthDate ? new Date() : undefined;
        const minDate = isUserBirthDate ? undefined : new Date();

        return (
          <View key={key} style={modalStyles.fieldContainer}>
            <Text style={modalStyles.fieldLabel}>
              {label} {isUserBirthDate && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(key)}
              style={[
                modalStyles.input,
                { justifyContent: 'center' },
                isUserBirthDate && errors[key] && { borderColor: 'red', borderWidth: 1 }
              ]}
            >
              <Text style={isUserBirthDate && !formData[key] ? { color: '#999' } : {}}>
                {formData[key]
                  ? new Date(formData[key]).toLocaleDateString()
                  : isUserBirthDate
                    ? 'Seleccionar fecha de nacimiento (Mayor de 8 años)'
                    : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
            {errors[key] && (
              <Text style={modalStyles.errorText}>{errors[key]}</Text>
            )}
            {showDatePicker === key && (
              <DateTimePicker
                value={formData[key] ? new Date(formData[key]) : new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            )}
          </View>
        );
      }

      return (
        <View key={key} style={modalStyles.fieldContainer}>
          <Text style={modalStyles.fieldLabel}>
            {label} {key === 'correo' && <Text style={{ color: 'red' }}>*</Text>}
          </Text>
          <TextInput
            style={[
              modalStyles.input,
              key === 'correo' && errors[key] && { borderColor: 'red', borderWidth: 1 }
            ]}
            value={String(formData[key] || '')}
            onChangeText={(text) => {
              if (type === 'number') {
                handleNumberChange(key, text);
              } else {
                handleTextChange(key, text);
              }
            }}
            placeholder={
              key === 'correo'
                ? 'ejemplo@dominio.com'
                : label
            }
            keyboardType={
              key === 'correo'
                ? 'email-address'
                : type === 'number'
                  ? 'numeric'
                  : 'default'
            }
            autoCapitalize={key === 'correo' ? 'none' : 'sentences'}
            autoCorrect={key === 'correo' ? false : true}
          />
          {errors[key] && (
            <Text style={modalStyles.errorText}>{errors[key]}</Text>
          )}
        </View>
      );
    });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={modalStyles.modalOverlay}
      >
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderFields()}
          </ScrollView>
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity
              style={modalStyles.submitButton}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={modalStyles.submitButtonText}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- COMPONENTE PRINCIPAL ---
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

  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllData();
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
      { label: 'Fecha de Nacimiento', key: 'fecha_nacimiento', type: 'date' },
    ],
    actividad: [
      { label: 'Título', key: 'titulo' },
      { label: 'Descripción', key: 'descripcion' },
      { label: 'Fecha Inicio', key: 'fechaInicio', type: 'date' },
      { label: 'Fecha Fin', key: 'fechaFin', type: 'date' },
    ],
    mision: [
      { label: 'Título', key: 'titulo' },
      { label: 'Descripción', key: 'descripcion' },
      { label: 'Puntos', key: 'puntos', type: 'number' },
      { label: 'Fecha Inicio', key: 'fechaInicio', type: 'date' },
      { label: 'Fecha Fin', key: 'fechaFin', type: 'date' },
    ],
    recompensa: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Descripción', key: 'descripcion' },
      { label: 'Puntos Requeridos', key: 'puntosRequeridos', type: 'number' },
      { label: 'Cantidad Disponible', key: 'cantidadDisponible', type: 'number' },
      { label: 'Imagen', key: 'imagen' },
    ],
    insignia: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Descripción', key: 'descripcion' },
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

    // Mapeo específico para cada tipo
    let mappedData = { ...item };

    if (type === 'usuario') {
      // Para usuarios, excluir explícitamente el rol
      const { rol, id_usuario, ...usuarioSinRol } = item;
      mappedData = usuarioSinRol;
    } else if (type === 'recompensa') {
      mappedData = {
        nombre: item.nombre || '',
        descripcion: item.descripcion || '',
        puntosRequeridos: item.puntosRequeridos || 0,
        cantidadDisponible: item.cantidadDisponible || 0,
        imagenUrl: item.imagenUrl || '',
        activa: item.activa !== undefined ? item.activa : true
      };
    }

    setFormData(mappedData);

    const id =
      item.id_insignia ||
      item.id_usuario ||
      item.id_mision ||
      item.id_actividad ||
      item.id_recompensa ||
      item.id ||
      item._id;
    setCurrentEditId(id);
    setModalVisible(true);
  };

  // ✅ CORRECCIÓN en handleSubmit para el FormData de recompensas
  const handleSubmit = async () => {
    if (loading) return;

    try {
      if (modalType === 'insignia' || modalType === 'recompensa') {
        const fd = new FormData();
        fd.append('nombre', formData.nombre || '');
        fd.append('descripcion', formData.descripcion || '');

        if (modalType === 'insignia') {
          fd.append('puntosrequeridos', formData.puntosrequeridos || 0);
        } else {
          fd.append('puntosRequeridos', formData.puntosRequeridos || 0);
          fd.append('cantidadDisponible', formData.cantidadDisponible || 0);
          // ✅ NUEVO: Agregar campo activa para recompensas
          fd.append('activa', formData.activa !== undefined ? formData.activa : true);
        }

        if (formData.nuevaImagen) {
          // ✅ CORRECCIÓN: Usar 'imagen' como clave para ambos casos (según tu backend)
          fd.append('imagen', {
            uri: formData.nuevaImagen.uri,
            name: formData.nuevaImagen.name || 'imagen.jpg',
            type: formData.nuevaImagen.type || 'image/jpeg',
          });
        }

        if (currentEditId) {
          if (modalType === 'insignia') {
            await editarInsigniaPorId(currentEditId, fd);
          } else {
            await editarRecompensaPorId(currentEditId, fd);
          }
        } else {
          if (modalType === 'insignia') {
            await crearNuevaInsignia(fd);
          } else {
            await crearNuevaRecompensa(fd);
          }
        }
      } else {
        if (currentEditId) {
          switch (modalType) {
            case 'usuario': {
              // ENVIAR SOLO LOS CAMPOS EDITABLES
              const datosUsuario = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                fecha_nacimiento: formData.fecha_nacimiento
              };


              await editarUsuario(currentEditId, datosUsuario);
              break;
            }
            case 'actividad':
              await modificarActividad(currentEditId, formData);
              break;
            case 'mision':
              await editarMisionPorId(currentEditId, formData);
              break;
          }
        } else {
          switch (modalType) {
            case 'usuario':
              await crearAdminUsuario(formData);
              break;
            case 'actividad':
              await agregarActividad(formData);
              break;
            case 'mision':
              await crearNuevaMision(formData);
              break;
          }
        }
      }

      setModalVisible(false);
      loadAllData();
    } catch (error) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  const onDelete = async (id, type) => {
    try {
      switch (type) {
        case 'usuario':
          await eliminarUsuarioPorId(id);
          break;
        case 'actividad':
          await borrarActividad(id);
          break;
        case 'mision':
          await eliminarMisionPorId(id);
          break;
        case 'recompensa':
          await eliminarRecompensaPorId(id);
          break;
        case 'insignia':
          await eliminarInsigniaPorId(id);
          break;
      }
      await loadAllData();
      Alert.alert('Éxito', `${type.charAt(0).toUpperCase() + type.slice(1)} eliminado.`);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F97B22" />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F97B22']}
            tintColor="#F97B22"
          />
        }
      >
        <Section
          title="Usuarios"
          data={usuarios}
          searchPlaceholder="Buscar por nombre..."
          searchField="nombre"
          onCreate={() => handleOpenCreateModal('usuario')}
          onEdit={(item) => handleOpenEditModal('usuario', item)}
          onDelete={(id) => onDelete(id, 'usuario')}
        />

        <Section
          title="Misiones"
          data={misiones}
          searchPlaceholder="Buscar por título..."
          searchField="titulo"
          onCreate={() => handleOpenCreateModal('mision')}
          onEdit={(item) => handleOpenEditModal('mision', item)}
          onDelete={(id) => onDelete(id, 'mision')}
        />

        <Section
          title="Actividades"
          data={actividades}
          searchPlaceholder="Buscar por título..."
          searchField="titulo"
          onCreate={() => handleOpenCreateModal('actividad')}
          onEdit={(item) => handleOpenEditModal('actividad', item)}
          onDelete={(id) => onDelete(id, 'actividad')}
        />

        <Section
          title="Recompensas"
          data={recompensas}
          searchPlaceholder="Buscar por nombre..."
          searchField="nombre"
          onCreate={() => handleOpenCreateModal('recompensa')}
          onEdit={(item) => handleOpenEditModal('recompensa', item)}
          onDelete={(id) => onDelete(id, 'recompensa')}
        />

        <Section
          title="Insignias"
          data={insignias}
          searchPlaceholder="Buscar por nombre..."
          searchField="nombre"
          onCreate={() => handleOpenCreateModal('insignia')}
          onEdit={(item) => handleOpenEditModal('insignia', item)}
          onDelete={(id) => onDelete(id, 'insignia')}
        />
      </ScrollView>

      <ModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        title={
          modalType
            ? currentEditId
              ? `Editar ${modalType}`
              : `Crear ${modalType}`
            : ''
        }
        fields={modalType ? formFields[modalType] : []}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        modalType={modalType}
        currentEditId={currentEditId}
      />
    </View>
  );
}