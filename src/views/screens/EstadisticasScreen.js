// EstadisticasScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { useEstadisticasViewModel } from "../../viewmodels/EstadisticasViewModel.js";
import { styles } from "../../styles/EstadisticasScreen.styles.js"; 

const screenWidth = Dimensions.get("window").width;

const KpiCard = ({ value, label, recommendations = [] }) => (
  <View style={styles.card}>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
    {recommendations.length > 0 && (
      <View style={styles.recommendationsContainer}>
        {recommendations.slice(0, 2).map((rec, index) => (
          <Text key={index} style={styles.recommendationText}>
            {rec}
          </Text>
        ))}
      </View>
    )}
  </View>
);

export default function EstadisticasScreen() {
  const {
    loading,
    error,
    puntos,
    estadisticasMisiones,
    estadisticasInsignias,
    ranking,
    estadisticasNotas,
    atencionConcentracion,
    cargarTodasLasEstadisticas,
  } = useEstadisticasViewModel();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    cargarTodasLasEstadisticas();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await cargarTodasLasEstadisticas();
    setIsRefreshing(false);
  };

  if (loading && !isRefreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F97B22" />
        <Text>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const misionesData = estadisticasMisiones
    ? [
        {
          name: "Completadas",
          population: estadisticasMisiones.misionesCompletadas,
          color: "#F97B22",
          legendFontColor: "#333",
          legendFontSize: 14,
        },
        {
          name: "Pendientes",
          population: estadisticasMisiones.misionesPendientes,
          color: "#FEE8B0",
          legendFontColor: "#333",
          legendFontSize: 14,
        },
      ]
    : [];

  const rankingData = {
    labels: ranking.slice(0, 5).map((u) => u.nombre.split(" ")[0]),
    datasets: [{ data: ranking.slice(0, 5).map((u) => u.puntosAcumulados) }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(249, 123, 34, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={["#F97B22"]}
          tintColor={"#F97B22"}
        />
      }
    >
      <Text style={styles.mainTitle}>Dashboard de Progreso</Text>
      <Text style={styles.subtitle}>Resumen de tus métricas principales</Text>

      {/* ========== SECCIÓN DE NOTAS Y CONCENTRACIÓN ========== */}
      <View style={styles.cardContainer}>
        <KpiCard
          value={estadisticasNotas?.notaEngagement ? `${estadisticasNotas.notaEngagement}/10` : "0/10"}
          label="📚 Nota General"
          recommendations={estadisticasNotas?.recomendaciones || []}
        />
        <KpiCard
          value={atencionConcentracion?.notaAtencionConcentracion ? `${atencionConcentracion.notaAtencionConcentracion}/10` : "0/10"}
          label="🧠 Atención y Concentración"
          recommendations={atencionConcentracion?.recomendaciones || []}
        />
      </View>

      {/* ========== SECCIÓN ORIGINAL ========== */}
      <View style={styles.cardContainer}>
        <KpiCard
          value={puntos?.puntosAcumulados || 0}
          label="Mis Puntos"
        />
        <KpiCard
          value={`${Math.round(
            estadisticasInsignias?.porcentajeReclamado || 0,
          )}%`}
          label="Insignias Obtenidas"
        />
      </View>

      {estadisticasMisiones && misionesData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Avance en mis Misiones</Text>
          <PieChart
            data={misionesData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>
      )}

      {ranking && ranking.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Top 5 Usuarios - Ranking</Text>
          <BarChart
            data={rankingData}
            width={screenWidth - 32}
            height={250}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            verticalLabelRotation={-25}
            fromZero
          />
        </View>
      )}
    </ScrollView>
  );
}