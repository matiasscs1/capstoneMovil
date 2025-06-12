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
  Platform,
} from "react-native";
import { useInsigniasViewModel } from "../../viewmodels/InsigniasViewModel.js";
// <--- ¡IMPORTACIÓN CORREGIDA Y EXPORTACIONES ADICIONALES! --->
import { styles, screenWidth, scale } from "../../styles/InsigniasScreen.styles.js";

// Ya no necesitas definir screenWidth y scale aquí si los importas del archivo de estilos.
// const { width: screenWidth } = Dimensions.get("window");
// const scale = (size) => (screenWidth / 375) * size;


export default function InsigniasScreen({ navigation }) {
  const {
    loading,
    error,
    insignias = [],
    insigniasReclamadas = [],
    cargarInsignias,
    cargarInsigniasReclamadas,
    reclamar,
  } = useInsigniasViewModel();

  const [insigniasDisponibles, setInsigniasDisponibles] = useState([]);
  // Estado para controlar la carga del botón de reclamar
  const [isReclaiming, setIsReclaiming] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([cargarInsignias(), cargarInsigniasReclamadas()]);
      } catch (e) {
        console.error("Error al cargar datos iniciales:", e);
      }
    };
    loadAllData();
  }, []);

  useEffect(() => {
    if (!insigniasReclamadas || insigniasReclamadas.length === 0) {
      setInsigniasDisponibles(insignias);
      return;
    }

    const reclamadasIds = new Set(
      insigniasReclamadas.map((ins) => ins.id_insignia)
    );

    const disponibles = insignias.filter(
      (ins) => !reclamadasIds.has(ins.id_insignia)
    );

    setInsigniasDisponibles(disponibles);
  }, [insignias, insigniasReclamadas]);

  const handleBackPress = () => navigation.goBack();

  const handleReclamar = async (id_insignia) => {
    if (isReclaiming) {
      return; // Evitar múltiples clics
    }

    setIsReclaiming(true); // Activar estado de carga del botón

    try {
      await reclamar(id_insignia);
      Alert.alert("Éxito", "Insignia reclamada correctamente");
      // Recargar ambas listas para que la UI se actualice correctamente
      await Promise.all([cargarInsignias(), cargarInsigniasReclamadas()]);
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo reclamar la insignia");
    } finally {
      setIsReclaiming(false); // Desactivar estado de carga del botón siempre
    }
  };

  const renderInsignia = ({ item }) => {
    const {
      id_insignia,
      nombre = "Insignia Desconocida",
      descripcion = "Sin descripción disponible.",
      imagenes = [],
      puntosrequeridos = 0,
      activa = true,
    } = item;
    const imagenUrl = imagenes[0]?.url;

    // Calculamos el ancho de la tarjeta aquí, usando screenWidth y scale importados
    const horizontalMarginAndPadding = scale(16) * 2; // (paddingHorizontal de listContent) * 2
    const cardWidth = screenWidth - horizontalMarginAndPadding;

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
          <View style={styles.trophyBadge}>
            <Text style={styles.trophyIcon}>🏆</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{nombre}</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tagIcon}>🎗️</Text>
          <Text style={styles.tagText}>Insignia</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.cardDescription}>{descripcion}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>
            {puntosrequeridos.toLocaleString("es-ES")}
          </Text>
          <Text style={styles.pointsLabel}>PUNTOS NECESARIO PARA RECLAMAR</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            !activa && styles.buttonDisabled,
            isReclaiming && styles.buttonLoading, // Aplica estilo de carga
          ]}
          onPress={() => handleReclamar(id_insignia)}
          disabled={!activa || isReclaiming} // Deshabilita si no está activa o si está cargando
        >
          {isReclaiming ? (
            <ActivityIndicator color="#fff" size="small" /> // Muestra spinner
          ) : (
            <Text style={styles.buttonText}>Reclamar Insignia</Text> // Muestra texto normal
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insignia</Text>
      </View>

      <SafeAreaView style={styles.contentSafeArea}>
        {loading && insigniasDisponibles.length === 0 ? (
          <ActivityIndicator
            style={styles.centered}
            size="large"
            color="#f57c00"
          />
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={insigniasDisponibles}
            renderItem={renderInsignia}
            keyExtractor={(item) => item.id_insignia.toString()}
            contentContainerStyle={styles.listContent}
            onRefresh={() =>
              Promise.all([cargarInsignias(), cargarInsigniasReclamadas()])
            }
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No hay insignias nuevas para reclamar.
                </Text>
              </View>
            }
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