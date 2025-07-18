import {
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar,
} from "react-native";

export const { width: screenWidth, height: screenHeight } =
    Dimensions.get("window");
export const scale = (size) => (screenWidth / 375) * size;

export const styles = StyleSheet.create({
    // --- Estilos existentes (sin cambios) ,---
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        height:
            (Platform.OS === "android" ? StatusBar.currentHeight : 0) + scale(50),
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: "#dbdbdb",
    },
    backButton: {
        position: "absolute",
        left: scale(16),
        top: (Platform.OS === "android" ? StatusBar.currentHeight : 0) + scale(12),
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
    profileHeader: {
        paddingHorizontal: scale(16),
        paddingVertical: scale(20),
    },
    profileTopRow: {
        flexDirection: "row",
        alignItems: "center",
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
    },
    editProfileButtonText: {
        color: "#ffffff",
        fontSize: scale(14),
        fontWeight: "bold",
    },
    gridRow: {},
    gridItem: {
        width: screenWidth / 3,
        height: screenWidth / 3,
        borderWidth: 1,
        borderColor: "#fff",
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
        borderBottomWidth: 1,
        borderBottomColor: "#dbdbdb",
    },
    postModalUserInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    pdfIconContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
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
        lineHeight: scale(20),
    },
    postActions: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(15),
        paddingBottom: scale(15),
    },
    actionButton: {
        marginRight: scale(20),
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
        height: screenHeight * 0.65,
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        paddingHorizontal: scale(15),
        paddingTop: scale(15),
        paddingBottom: Platform.OS === "ios" ? scale(30) : scale(15),
    },
    commentsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#dbdbdb",
        paddingBottom: scale(10),
        marginBottom: scale(10),
    },
    commentsTitle: {
        fontSize: scale(16),
        fontWeight: "bold",
    },
    commentsLoaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    commentItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    commentTextContainer: {
        flex: 1,
        marginRight: scale(10),
    },
    commentUser: {
        fontWeight: "bold",
        fontSize: scale(14),
        marginBottom: scale(2),
    },
    commentText: {
        fontSize: scale(14),
        color: "#333",
    },
    commentActions: {
        flexDirection: "row",
    },
    commentActionIcon: {
        fontSize: scale(18),
        marginLeft: scale(15),
        color: "#555",
    },
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#dbdbdb",
        paddingTop: scale(10),
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
    emptyListText: {
        textAlign: "center",
        color: "#999",
        marginTop: scale(20),
        fontSize: scale(14),
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
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "#efefef",
        marginRight: scale(10),
    },
    saveButton: {
        backgroundColor: "#f57c00",
    },
    saveButtonDisabled: {
        backgroundColor: "#f9a825",
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
        maxHeight: "80%",
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
        fontSize: scale(14),
        color: "#333333",
        marginBottom: scale(8),
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
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#dbdbdb",
        borderRadius: scale(8),
        backgroundColor: "#fafafa",
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
    },
    dateInputText: {
        fontSize: scale(14),
        color: "#333",
    },
    dateIcon: {
        fontSize: scale(18),
        color: "#8e8e8e",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: scale(20),
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
        borderColor: "#f57c00",
        marginRight: scale(10),
    },
    saveProfileButton: {
        backgroundColor: "#f57c00",
    },
    cancelProfileButtonText: {
        color: "#f57c00",
        fontWeight: "bold",
        fontSize: scale(14),
    },
    saveProfileButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: scale(14),
    },
    actionButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonDisabled: {
        opacity: 0.8,
    },
    postModalUserAvatar: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
    },

    // --- ESTILOS CORREGIDOS PARA EL PERFIL ---
    profileInfo: {
        marginTop: scale(12),
        paddingHorizontal: scale(16),
        alignItems: 'center',
    },
    profileName: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: scale(4),
        textAlign: 'center',
    },
    profileEmail: {
        fontSize: scale(14),
        color: '#666',
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(50),
    },

    // --- BOTÓN DE SEGUIR NARANJA (ÚNICO) ---
    followButtonContainer: {
        marginTop: scale(16),
        paddingHorizontal: scale(16),
    },
    followButton: {
        backgroundColor: '#F68537',
        paddingVertical: scale(8),
        paddingHorizontal: scale(30),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(20),
        marginBottom: scale(10),
        width: '80%',
        alignSelf: 'center',
    },
    followingButton: {
        backgroundColor: '#95A5A6', 
    },
    followButtonDisabled: {
        opacity: 0.6,
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: scale(16),
        fontWeight: '600',
    },
    followingButtonText: {
        color: '#ffffff',
    },
    followText: {
        color: '#ffffff', 
        fontSize: scale(14),
        fontWeight: '600',
    },
    followingText: {
        color: '#ffffff',   
        fontSize: scale(14),
        fontWeight: '600',
    },
    // --- ESTILOS PARA PESTAÑAS E INSIGNIAS ---
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginHorizontal: 0,
        marginBottom: scale(10),
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(15),
        paddingHorizontal: scale(10),
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#f57c00',
    },
    tabText: {
        marginLeft: scale(8),
        fontSize: scale(14),
        fontWeight: '500',
        color: '#666666',
    },
    activeTabText: {
        color: '#f57c00',
        fontWeight: '600',
    },

    // --- ESTILOS PARA INSIGNIAS ---
    insigniaCard: {
        width: (screenWidth - scale(60)) / 3,
        backgroundColor: '#ffffff',
        borderRadius: scale(12),
        padding: scale(15),
        marginBottom: scale(15),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    insigniaIconContainer: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(10),
        borderWidth: 2,
        borderColor: '#f57c00',
    },
    insigniaIcon: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
    },
    insigniaTitle: {
        fontSize: scale(12),
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
        marginBottom: scale(4),
        lineHeight: scale(16),
    },
    insigniaSubtitle: {
        fontSize: scale(10),
        color: '#f57c00',
        textAlign: 'center',
        fontWeight: '500',
    },

    // --- ESTILOS PARA ESTADOS VACÍOS ---
    emptyIcon: {
        fontSize: scale(60),
        marginBottom: scale(15),
    },
    emptyTitle: {
        fontSize: scale(18),
        fontWeight: '600',
        color: '#333333',
        marginBottom: scale(8),
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: scale(14),
        color: '#666666',
        textAlign: 'center',
        lineHeight: scale(20),
    },

    // --- ESTILOS PARA EL MODAL DE INSIGNIAS ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: scale(20),
        padding: scale(25),
        margin: scale(20),
        maxWidth: screenWidth - scale(40),
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: scale(15),
        right: scale(15),
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    modalIconContainer: {
        alignItems: 'center',
        marginTop: scale(20),
        marginBottom: scale(20),
    },
    modalIcon: {
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
        borderWidth: 3,
        borderColor: '#f57c00',
    },
    modalTitle: {
        fontSize: scale(24),
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: scale(15),
    },
    modalDescription: {
        fontSize: scale(16),
        color: '#666666',
        textAlign: 'center',
        lineHeight: scale(24),
        marginBottom: scale(25),
    },
    modalInfoContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: scale(12),
        padding: scale(20),
    },
    modalInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    modalInfoLabel: {
        fontSize: scale(14),
        color: '#666666',
        fontWeight: '500',
    },
    modalInfoValue: {
        fontSize: scale(16),
        color: '#f57c00',
        fontWeight: 'bold',
    },

    // Estilos para el carrusel de insignias
    insigniasSection: {
        marginTop: scale(20),
        paddingTop: scale(15),
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    insigniasSectionTitle: {
        fontSize: scale(16),
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: scale(10),
        paddingHorizontal: scale(16),
        paddingLeft: scale(2),
        textAlign: 'left',
    },
    insigniasCarruselContent: {
        paddingHorizontal: scale(8),
        paddingLeft: scale(1),
    },
    insigniaCarruselCard: {
        backgroundColor: '#ffffff',
        borderRadius: scale(12),
        padding: scale(12),
        marginRight: scale(12),
        alignItems: 'center',
        width: scale(100),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    insigniaCarruselImage: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        marginBottom: scale(8),
    },
    insigniaCarruselName: {
        fontSize: scale(12),
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
        marginBottom: scale(4),
    },
    insigniaCarruselPoints: {
        fontSize: scale(10),
        color: '#f57c00',
        textAlign: 'center',
        fontWeight: '500',
    },
    emptyInsigniasContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: scale(20),
    },
    emptyInsigniasText: {
        fontSize: scale(14),
        color: '#666666',
        textAlign: 'center',
    },


});