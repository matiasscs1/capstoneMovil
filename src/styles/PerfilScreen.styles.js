import {
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";

// --- CONSTANTES DE ESCALADO Y DIMENSIONES ---
// Se exportan para que el componente principal también pueda usarlas si es necesario.
export const { width: screenWidth } = Dimensions.get("window");
export const scale = (size) => (screenWidth / 375) * size;

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : scale(40),
    paddingBottom: scale(15),
    paddingHorizontal: scale(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dbdbdb",
  },
  backButton: {
    position: "absolute",
    left: scale(16),
    top:
      Platform.OS === "android"
        ? StatusBar.currentHeight + scale(12)
        : scale(52),
    zIndex: 1,
  },
  backButtonText: {
    fontSize: scale(24),
    fontWeight: "600",
    color: "#f57c00",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#262626",
  },
  listHeader: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  profileHeader: {
    width: "100%",
    paddingTop: scale(10),
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(15),
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: scale(2),
    borderColor: "#f57c00",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f57c00",
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scale(2),
    borderColor: "#ffffff",
  },
  editAvatarIcon: {
    color: "#ffffff",
    fontSize: scale(14),
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: scale(20),
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#262626",
  },
  statLabel: {
    fontSize: scale(14),
    color: "#8e8e8e",
  },
  editProfileButton: {
    backgroundColor: "#f57c00",
    borderRadius: scale(8),
    paddingVertical: scale(10),
    alignItems: "center",
    width: "100%",
    marginBottom: scale(20),
  },
  editProfileButtonText: {
    color: "#ffffff",
    fontSize: scale(14),
    fontWeight: "bold",
  },
  gridRow: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: (screenWidth - scale(2) * 2) / 3,
    height: (screenWidth - scale(2) * 2) / 3,
    marginBottom: scale(2),
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  postModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(15),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dbdbdb",
  },
  postModalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  pdfIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    backgroundColor: "#fbe9e7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  pdfIcon: {
    fontSize: scale(20),
  },
  postModalUsername: {
    fontWeight: "bold",
    fontSize: scale(14),
  },
  postModalDate: {
    fontSize: scale(12),
    color: "#8e8e8e",
  },
  closeButtonText: {
    fontSize: scale(24),
    fontWeight: "300",
    color: "#262626",
  },
  modalImage: {
    width: screenWidth,
    height: screenWidth,
  },
  postCaption: {
    padding: scale(15),
    fontSize: scale(14),
  },
  postActions: {
    flexDirection: "row",
    paddingHorizontal: scale(15),
    paddingBottom: scale(15),
  },
  actionButton: {
    marginRight: scale(15),
  },
  actionIcon: {
    fontSize: scale(24),
  },
  commentsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  commentsModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  commentsModalContent: {
    backgroundColor: "#ffffff",
    height: "60%",
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    padding: scale(15),
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dbdbdb",
    paddingBottom: scale(10),
    marginBottom: scale(10),
  },
  commentsTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
  },
  commentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(10),
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: scale(14),
  },
  commentText: {
    fontSize: scale(14),
  },
  commentActions: {
    flexDirection: "row",
  },
  commentActionIcon: {
    fontSize: scale(18),
    marginLeft: scale(15),
    color: "#8e8e8e",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#dbdbdb",
    paddingTop: scale(10),
    marginTop: "auto",
  },
  commentInput: {
    flex: 1,
    height: scale(40),
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: scale(20),
    paddingHorizontal: scale(15),
    backgroundColor: "#fafafa",
  },
  sendButton: {
    marginLeft: scale(10),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: "#f57c00",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonIcon: {
    color: "#ffffff",
    fontSize: scale(18),
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  editModalContent: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: scale(15),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: scale(15),
    textAlign: "center",
  },
  editModalInput: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: scale(8),
    padding: scale(10),
    minHeight: scale(80),
    textAlignVertical: "top",
    fontSize: scale(14),
    marginBottom: scale(20),
  },
  editModalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editModalButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#efefef",
    marginRight: scale(10),
  },
  saveButton: {
    backgroundColor: "#f57c00",
  },
  editModalButtonText: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#262626",
  },

  // --- NUEVOS ESTILOS PARA EL MODAL DE EDITAR PERFIL ---
  editProfileModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editProfileModalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: scale(12),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  editProfileModalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(20),
    position: "relative",
  },
  editProfileModalTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#262626",
  },
  editProfileModalCloseButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  editProfileModalCloseButtonText: {
    fontSize: scale(22),
    color: "#8e8e8e",
    fontWeight: "300",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(15),
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupRight: {
    marginLeft: scale(10),
  },
  inputGroupFull: {
    marginBottom: scale(15),
  },
  label: {
    fontSize: scale(12),
    color: "#262626",
    marginBottom: scale(5),
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: scale(14),
    backgroundColor: "#fafafa",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: scale(8),
    backgroundColor: "#fafafa",
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: scale(14),
    borderWidth: 0, // El borde ya está en el contenedor
  },
  dateIcon: {
    paddingHorizontal: scale(10),
    fontSize: scale(16),
    color: "#8e8e8e",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(10),
  },
  profileModalButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelProfileButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbdbdb",
    marginRight: scale(10),
  },
  saveProfileButton: {
    backgroundColor: "#f57c00",
  },
  cancelProfileButtonText: {
    color: "#262626",
    fontWeight: "bold",
    fontSize: scale(14),
  },
  saveProfileButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: scale(14),
  },
});