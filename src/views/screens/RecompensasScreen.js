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


const { width: screenWidth } = Dimensions.get("window");
const scale = (size) => (screenWidth / 375) * size;

export default function RecompensasScreen({ navigation }) {
  const {
    loading,
    error,
    recompensas,
    canjes,
    cargarRecompensas,
    cargarCanjes,
    canjear,
  } = useRecompensaViewModel();

  const [filteredRecompensas, setFilteredRecompensas] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const loadAllData = async () => {
    try {
      await Promise.all([cargarCanjes(), cargarRecompensas()]);
      setPage(1);
    } catch (e) {
      console.error("Error al cargar datos en pull-to-refresh:", e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (recompensas.length) {
      const canjeadosIds = (canjes || []).map((c) =>
        String(c.recompensaId).trim()
      );

      const disponibles = recompensas.filter((r) => {
        const idRecompensa = String(r.id_recompensa).trim();
        return r.cantidadDisponible > 0 && !canjeadosIds.includes(idRecompensa);
      });

      setFilteredRecompensas(disponibles.slice(0, page * pageSize));
    } else {
      setFilteredRecompensas([]);
    }
  }, [recompensas, canjes, page, pageSize]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCanjear = async (idRecompensa) => {
    if (isRedeeming) {
      return;
    }

    setIsRedeeming(true);

    try {
      await canjear(idRecompensa);
      Alert.alert("Éxito", "Recompensa canjeada correctamente");
      await loadAllData();
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo canjear la recompensa");
    } finally {
      setIsRedeeming(false);
    }
  };

  const getCardWidth = () => {
    // Estas variables `screenWidth` y `scale` son las definidas localmente.
    // Si quisieras que el `scale` fuera el del archivo de estilos, tendrías que exportarlo también.
    const horizontalMarginAndPadding = scale(16) * 2;
    const idealWidth = screenWidth - horizontalMarginAndPadding;
    return idealWidth;
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
          <View style={styles.starBadge}>
            <Text style={styles.starIcon}>⭐</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{nombre}</Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tagIcon}>🎁</Text>
          <Text style={styles.tagText}>Recompensa</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.cardDescription}>{descripcion}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsValue}>
              {puntosRequeridos.toLocaleString("es-ES")}
            </Text>
            <Text style={styles.pointsLabel}>PUNTOS</Text>
          </View>
          <View style={styles.availableBox}>
            <Text style={styles.availableValue}>{cantidadDisponible}</Text>
            <Text style={styles.availableLabel}>DISPONIBLES</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            !activa && styles.buttonDisabled,
            isRedeeming && styles.buttonLoading,
          ]}
          onPress={() => handleCanjear(id_recompensa)}
          disabled={!activa || isRedeeming}
        >
          {isRedeeming ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Canjear Recompensa</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const cargarMas = () => {
    if (filteredRecompensas.length < recompensas.length && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recompensas</Text>
      </View>

      <SafeAreaView style={styles.contentSafeArea}>
        {loading && filteredRecompensas.length === 0 ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#f57c00" />
          </View>
        ) : error ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRecompensas}
            keyExtractor={(item) => item.id_recompensa}
            renderItem={renderRecompensa}
            contentContainerStyle={styles.listContent}
            onEndReached={cargarMas}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>
                  No hay recompensas disponibles.
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
            onRefresh={loadAllData}
            refreshing={loading}
          />
        )}
      </SafeAreaView>
    </View>
  );
}