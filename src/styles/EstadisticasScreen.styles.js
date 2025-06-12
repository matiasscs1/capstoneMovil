
  import { StyleSheet } from "react-native"; 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // <-- MODIFICADO: Fondo blanco puro
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // <-- MODIFICADO: Fondo blanco puro
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D75000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#F97B22",
    textAlign: "center",
    marginBottom: 24,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F97B22",
  },
  cardLabel: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D75000",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});