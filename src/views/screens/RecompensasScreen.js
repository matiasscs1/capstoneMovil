import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useRecompensaViewModel } from "../../viewmodels/RecompensaViewModel.js";
import { styles } from "../../styles/RecompensaScreen.styles.js";
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get("window");
const scale = (size) => (screenWidth / 375) * size;

export default function RecompensasScreen({ navigation, route }) {
  // Obtener usuarioId desde route params o contexto de autenticación
  const { user } = useAuth();
  const usuarioId = user?.id_usuario;
const {
    loading,
    error,
    recompensas,
    canjesUsuario, // Cambiado de canjes a canjesUsuario
    cargarRecompensas,
    cargarCanjesPorUsuario, // Nueva función
    canjear,
  } = useRecompensaViewModel();

  // Estado para la lista filtrada y la paginación
  const [filteredRecompensas, setFilteredRecompensas] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Carga inicial y pull-to-refresh
  const loadAllData = async () => {
    try {
      // 1) Intentar cargar canjes del usuario específico
      try {
        await cargarCanjesPorUsuario(usuarioId);
      } catch (canjesError) {
        // Si el error es porque no hay canjes (404), no es un error real
        if (canjesError.message && canjesError.message.includes("No se encontraron canjes para el usuario")) {
          // No hacer nada, canjesUsuario quedará vacío y se mostrarán todas las recompensas
        } else {
          // Si es otro tipo de error, sí es problemático
          throw canjesError;
        }
      }
      
      // 2) Cargar todas las recompensas
      await cargarRecompensas();
      // Reiniciar página
      setPage(1);
    } catch (e) {
      console.error("Error al cargar datos:", e);
      Alert.alert("Error", "No se pudieron recargar los datos.");
    }
  };

  useEffect(() => {
    loadAllData();
  }, [usuarioId]);

  // Efecto de filtrado: filtrar recompensas que NO están en canjesUsuario
  useEffect(() => {
    // Si no hay recompensas
    if (!recompensas || recompensas.length === 0) {
      setFilteredRecompensas([]);
      return;
    }

    // Si no hay canjes del usuario, mostrar todas las recompensas
    if (!canjesUsuario || !canjesUsuario.id_recompensa || canjesUsuario.id_recompensa.length === 0) {
      setFilteredRecompensas(recompensas.slice(0, page * pageSize));
      return;
    }

    // Obtener los IDs de recompensas ya canjeadas por el usuario
    const recompensasCanjeadas = canjesUsuario.id_recompensa.map(id => String(id).trim());
    

    // Filtrar recompensas: mostrar solo las que NO están en la lista de canjeadas
    const recompensasDisponibles = recompensas.filter((recompensa) => {
      const idRecompensa = String(recompensa.id_recompensa).trim();
      const noEstaCanjeada = !recompensasCanjeadas.includes(idRecompensa);
      const estaActiva = recompensa.activa;
      const hayDisponibles = recompensa.cantidadDisponible > 0;
      
      return noEstaCanjeada && estaActiva && hayDisponibles;
    });


    // Aplicar paginación
    setFilteredRecompensas(recompensasDisponibles.slice(0, page * pageSize));
  }, [
    recompensas,
    canjesUsuario,
    page,
    pageSize,
  ]);

  const handleBackPress = () => navigation.goBack();

  const handleCanjear = async (idRecompensa) => {
    if (isRedeeming) return;
    setIsRedeeming(true);
    try {
      await canjear(idRecompensa);
      Alert.alert("Éxito", "Recompensa canjeada correctamente");
      // Solo recargar datos si el canje fue exitoso
      await loadAllData();
    } catch (e) {
      // Manejar diferentes tipos de errores
      const errorMessage = e.message || "No se pudo canjear la recompensa";
      
      // Verificar si es un error de puntos insuficientes
      const esPuntosInsuficientes = errorMessage.toLowerCase().includes("no tienes suficientes puntos") ||
                                  errorMessage.toLowerCase().includes("puntos insuficientes") ||
                                  errorMessage.toLowerCase().includes("insufficient points");
      
      // Mostrar el alert con el mensaje de error
      Alert.alert("Error", errorMessage);
      
      // Si NO es un error de puntos insuficientes, podría ser un error más serio
      // que requiera recargar los datos (ej: recompensa ya no disponible)
      if (!esPuntosInsuficientes) {
        // Solo recargar en casos de errores que no sean falta de puntos
        try {
          await loadAllData();
        } catch (reloadError) {
          console.error("Error al recargar datos después de error de canje:", reloadError);
        }
      } 
    } finally {
      setIsRedeeming(false);
    }
  };

  const cargarMas = () => {
    if (!recompensas || recompensas.length === 0) return;
    
    // Calcular cuántas recompensas disponibles hay en total
    const recompensasCanjeadas = canjesUsuario?.id_recompensa || [];
    const totalDisponibles = recompensas.filter((recompensa) => {
      const idRecompensa = String(recompensa.id_recompensa).trim();
      const noEstaCanjeada = !recompensasCanjeadas.includes(idRecompensa);
      const estaActiva = recompensa.activa;
      const hayDisponibles = recompensa.cantidadDisponible > 0;
      
      return noEstaCanjeada && estaActiva && hayDisponibles;
    }).length;

    if (filteredRecompensas.length < totalDisponibles && !loading) {
      setPage((p) => p + 1);
    }
  };

  const getCardWidth = () => {
    const horizontalMarginAndPadding = scale(16) * 2;
    return screenWidth - horizontalMarginAndPadding;
  };

  const renderRecompensa = ({ item }) => {
    const {
      id_recompensa,
      nombre,
      descripcion,
      puntosRequeridos,
      cantidadDisponible,
      activa,
      imagenUrl,
    } = item;
    const cardWidth = getCardWidth();

    return (
      <View style={[styles.card, { width: cardWidth }]}>
        <View style={styles.imageOuterContainer}>
          <View style={styles.imageBorder}>
            {imagenUrl ? (
              <Image
                source={{ uri: imagenUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>🖼️</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.cardTitle}>{nombre}</Text>
        <Text style={styles.cardDescription}>{descripcion}</Text>

        <View style={styles.infoRow}>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsValue}>
              {puntosRequeridos.toLocaleString("es-ES")}
            </Text>
            <Text style={styles.pointsLabel}>PUNTOS</Text>
          </View>
          <View style={styles.availableBox}>
            <Text style={styles.availableValue}>
              {cantidadDisponible}
            </Text>
            <Text style={styles.availableLabel}>DISPONIBLES</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!activa || isRedeeming) && styles.buttonDisabled,
          ]}
          disabled={!activa || isRedeeming}
          onPress={() => handleCanjear(id_recompensa)}
        >
          {isRedeeming ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              Canjear Recompensa
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recompensas</Text>
      </View>

      <SafeAreaView style={styles.contentSafeArea}>
        {loading && filteredRecompensas.length === 0 ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#f57c00" />
          </View>
        ) : error && filteredRecompensas.length === 0 ? (
          // Solo mostrar error general si no hay recompensas disponibles
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRecompensas}
            keyExtractor={(item) =>
              item.id_recompensa.toString()
            }
            renderItem={renderRecompensa}
            contentContainerStyle={styles.listContent}
            onEndReached={cargarMas}
            onEndReachedThreshold={0.5}
            onRefresh={loadAllData}
            refreshing={loading}
            ListEmptyComponent={() => (
              <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>
                  No hay recompensas disponibles para canjear.
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            scrollIndicatorTintColor={
              Platform.OS === "ios" ? "#f57c00" : undefined
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}