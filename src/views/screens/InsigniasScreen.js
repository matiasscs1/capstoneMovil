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
import { styles, screenWidth, scale } from "../../styles/InsigniasScreen.styles.js";

export default function InsigniasScreen({ navigation }) {
  const {
    loading,
    insignias = [],
    insigniasReclamadas = [],
    cargarInsignias,
    cargarInsigniasReclamadas,
    reclamar,
  } = useInsigniasViewModel();

  const [insigniasDisponibles, setInsigniasDisponibles] = useState([]);
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [loadError, setLoadError] = useState(""); // solo para errores de carga

  const loadAllData = async () => {
    setLoadError("");
    try {
      await cargarInsignias();
    } catch (e) {
      setLoadError(e.message || "Error al cargar insignias");
    }
    try {
      await cargarInsigniasReclamadas();
    } catch {
      // puede no tener reclamadas, lo ignoramos
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    // Filtrar según las 3 condiciones
    let disponibles = [];
    if (insigniasReclamadas.length === 0) {
      // 1) si no ha reclamado nada muestro todas activas
      disponibles = insignias.filter((ins) => ins.activa === true);
    } else {
      // 2) y 3) activo=true y no reclamadas aún
      const reclamadasIds = new Set(
        insigniasReclamadas.map((ins) => ins.id_insignia)
      );
      disponibles = insignias.filter(
        (ins) => ins.activa === true && !reclamadasIds.has(ins.id_insignia)
      );
    }
    setInsigniasDisponibles(disponibles);
  }, [insignias, insigniasReclamadas]);

  const handleBackPress = () => navigation.goBack();

  const handleReclamar = async (id_insignia) => {
    if (isReclaiming) return;
    setIsReclaiming(true);
    try {
      await reclamar(id_insignia);
      Alert.alert("Éxito", "Insignia reclamada correctamente");
      // recargamos lista de reclamadas para filtrar bien
      await cargarInsigniasReclamadas();
      // no tocamos loadError para no perder la lista
    } catch (e) {
      // solo alerta, no tocamos loadError ni ocultamos la lista
      if (e.message?.includes("No tienes suficientes puntos")) {
        Alert.alert("Puntos insuficientes", e.message);
      } else {
        Alert.alert("Error", e.message || "No se pudo reclamar la insignia");
      }
    } finally {
      setIsReclaiming(false);
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
    const cardWidth = screenWidth - scale(16) * 2;

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
          <Text style={styles.pointsLabel}>
            PUNTOS NECESARIOS PARA RECLAMAR
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            (!activa || isReclaiming) && styles.buttonDisabled,
            isReclaiming && styles.buttonLoading,
          ]}
          onPress={() => handleReclamar(id_insignia)}
          disabled={!activa || isReclaiming}
        >
          {isReclaiming ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Reclamar Insignia</Text>
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
        <Text style={styles.headerTitle}>Insignias</Text>
      </View>
      <SafeAreaView style={styles.contentSafeArea}>
        {loading && insigniasDisponibles.length === 0 && !loadError ? (
          <ActivityIndicator
            style={styles.centered}
            size="large"
            color="#f57c00"
          />
        ) : loadError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{loadError}</Text>
            <TouchableOpacity onPress={loadAllData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={insigniasDisponibles}
            renderItem={renderInsignia}
            keyExtractor={(item) => item.id_insignia.toString()}
            contentContainerStyle={styles.listContent}
            onRefresh={loadAllData}
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No hay insignias nuevas para reclamar.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator
            scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
            scrollIndicatorTintColor={
              Platform.OS === "ios" ? "#f57c00" : undefined
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}