import {
  StyleSheet,
  Dimensions, // <-- ¡Importar Dimensions aquí!
  Platform,   // <-- ¡Importar Platform aquí!
  StatusBar,  // <-- ¡Importar StatusBar aquí!
} from "react-native";

// Estas variables son necesarias para los cálculos de escalado en este archivo.
// Se exportan para que si el componente necesita usarlas también, las pueda importar.
export const { width: screenWidth } = Dimensions.get("window");
export const scale = (size) => (screenWidth / 375) * size; // Base screen width 375 (iPhone 6/7/8)

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Fondo general de la pantalla
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", // Fondo blanco del header
    // Padding superior dinámico para que el contenido no quede bajo la barra de estado
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : scale(40),
    paddingBottom: scale(15),
    paddingHorizontal: scale(16),
    // Sombra sutil para un efecto de profundidad ligero
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(1) }, // Sombra más sutil
    shadowOpacity: 0.1, // Opacidad sutil
    shadowRadius: scale(1), // Radio de difuminado sutil
    elevation: scale(2), // Elevación para Android (sutil)
    // Borde inferior sólido para una delimitación clara
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: "#e0e0e0",
  },
  contentSafeArea: {
    flex: 1, // Asegura que esta SafeAreaView ocupe el resto del espacio
    backgroundColor: "#f8f9fa", // Color de fondo del contenido
  },
  backButton: {
    marginRight: scale(16),
    padding: scale(4),
  },
  backButtonText: {
    fontSize: scale(28),
    fontWeight: "bold",
    color: "#f57c00",
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#333333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: scale(16),
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    paddingBottom: scale(20),
  },
  emptyContainer: {
    padding: scale(20),
    alignItems: "center",
    marginTop: scale(50),
  },
  emptyText: {
    fontSize: scale(16),
    color: "#666",
  },
  // --- Estilos de la Tarjeta de Insignia ---
  card: {
    backgroundColor: "#fff",
    borderRadius: scale(24),
    padding: scale(20),
    alignItems: "center",
    marginBottom: scale(25),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: scale(10),
    elevation: scale(8),
    // Si tu card NO tiene width fijo y necesitas un width dinámico,
    // puedes añadir algo como `width: screenWidth - (scale(16) * 2),` aquí
    // o calcularlo en el componente y pasarlo al estilo.
    width: screenWidth - (scale(16) * 2), // Ejemplo: Ancho completo menos padding horizontal
  },
  imageOuterContainer: {
    position: "relative",
    marginBottom: scale(20),
  },
  imageBorder: {
    width: scale(180),
    height: scale(180),
    borderRadius: scale(30),
    borderWidth: scale(6),
    borderColor: "#f57c00",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: scale(8),
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: scale(22),
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: scale(22),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderIcon: {
    fontSize: scale(50),
    color: "#cccccc",
  },
  trophyBadge: {
    position: "absolute",
    bottom: scale(-10),
    right: scale(-10),
    backgroundColor: "#f57c00",
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22), // Puedes usar scale(22) para un círculo perfecto
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scale(3),
    borderColor: "#fff",
  },
  trophyIcon: {
    fontSize: scale(22),
    color: "#fff",
  },
  cardTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#1c1c1c",
    textAlign: "center",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5e6",
    borderRadius: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    marginTop: scale(10),
  },
  tagIcon: {
    marginRight: scale(6),
    fontSize: scale(14),
  },
  tagText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#d97706",
  },
  descriptionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: scale(16),
    padding: scale(16),
    marginTop: scale(20),
    width: "100%",
  },
  cardDescription: {
    fontSize: scale(15),
    color: "#666",
    textAlign: "center",
    lineHeight: scale(22),
  },
  pointsContainer: {
    backgroundColor: "#fff8e1",
    borderRadius: scale(20),
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    marginTop: scale(20),
    alignItems: "center",
    width: "100%",
  },
  pointsValue: {
    fontSize: scale(32),
    fontWeight: "bold",
    color: "#f57c00",
  },
  pointsLabel: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#b45309",
    marginTop: scale(4),
    letterSpacing: scale(0.5),
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f57c00",
    borderRadius: scale(25),
    paddingVertical: scale(16),
    alignItems: "center",
    marginTop: scale(20),
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonLoading: {
    backgroundColor: "#d97706", // Tono ligeramente diferente para indicar carga
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "bold",
  },
});