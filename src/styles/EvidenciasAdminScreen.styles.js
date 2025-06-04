import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
// Ajusta CARD_WIDTH si es necesario para el nuevo diseño.
// Podrías usar un porcentaje mayor o un valor fijo si prefieres.
const CARD_WIDTH = windowWidth * 0.9; // Un poco más ancho
const IMG_SIDE_HORIZONTAL = 160; // Para el diseño horizontal original (si aún lo necesitas en otro lado)

export const styles = StyleSheet.create({
  // --- ESTILOS GENERALES Y DE LISTA ---
  list: {
    paddingTop: 70, 
    paddingBottom: 24,
    alignItems: 'center', 
    backgroundColor: '#f8f8fb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  pullDownText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // --- ESTILOS PARA EL NUEVO DISEÑO DE TARJETA (VERTICAL) ---
  newCard_card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
  },
  newCard_orangeTopBar: {
    height: 10,
    backgroundColor: '#f57c00',
  },
  newCard_imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Para la etiqueta de estado
  },
  newCard_evidenceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  newCard_placeholderIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCard_filePreviewIcon: { // Para iconos de PDF/Video en la tarjeta
    // El tamaño se pasa directamente al componente Icono
  },
  newCard_filePreviewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#757575',
  },
  newCard_statusBadge: {
    position: 'absolute',
    top: 12, // Ajustado
    right: 12, // Ajustado
    backgroundColor: '#fff3e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  newCard_statusBadgeText: {
    color: '#e65100',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newCard_contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16, // Ajustado
  },
  newCard_evidenceDescription: {
    fontSize: 15,
    color: '#333',
    marginBottom: 16, // Ajustado
    lineHeight: 21, // Ajustado
  },
  newCard_detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Ajustado
  },
  newCard_detailIcon: {
    marginRight: 10, // Ajustado
  },
  newCard_detailText: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1, // Para que el texto se ajuste si es muy largo
  },
  newCard_detailValue: {
    fontWeight: '600',
    color: '#333',
  },
  newCard_approveButton: {
    backgroundColor: '#f57c00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  newCard_approveButtonIcon: {
    marginRight: 8,
  },
  newCard_approveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  newCard_approvedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
    textAlign: 'center',
    paddingVertical: 12, // Para que tenga una altura similar al botón
  },

  // --- ESTILOS DEL MODAL (SE MANTIENEN TUS ESTILOS ORIGINALES) ---
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.93)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // Considera si este padding es necesario o si el contenido se centra bien
  },
  modalImage: {
    width: windowWidth, // O windowWidth * 0.9 para márgenes
    height: windowWidth * 1.15, // O ajustar según el aspect ratio deseado
    resizeMode: 'contain',
    // borderRadius: 10, // Opcional para imágenes en el modal
    // backgroundColor: '#fff', // Opcional si la imagen no tiene transparencia
  },
  modalPdfIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  modalPdfLabel: {
    fontSize: 17,
    color: '#f57c00',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  modalVideoIcon: { // Para el modal
    width: 120,
    height: 120,
    borderRadius: 26,
    backgroundColor: '#222', // O un color más claro si el fondo es oscuro
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playText: { // Para el modal de video
    color: '#fff',
    fontSize: 50, // Más grande para el modal
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute', // Para superponerlo si es necesario
    bottom: 70, // Ajustar posición
  },
  paginationDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#f57c00',
    width: 12,
    height: 12,
  },
  // --- ESTILOS DEL DISEÑO HORIZONTAL ORIGINAL (SI LOS NECESITAS PARA OTRA COSA) ---
  // Puedes mantenerlos aquí si los usas en otro lugar o eliminarlos si ya no.
  cardHorizontal: {
    width: CARD_WIDTH, // Usa el CARD_WIDTH ajustado
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#fff',
    marginVertical: 10,
    shadowColor: '#111',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center',
    padding: 10,
  },
  leftPreviewBox: {
    width: IMG_SIDE_HORIZONTAL,
    height: IMG_SIDE_HORIZONTAL,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    marginRight: 20,
  },
  leftThumbnail: {
    width: IMG_SIDE_HORIZONTAL,
    height: IMG_SIDE_HORIZONTAL,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  leftPdfIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 2,
    marginTop: 2,
    alignSelf: 'center',
  },
  leftPdfLabel: {
    fontSize: 11,
    color: '#f57c00',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 1,
  },
  leftVideoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 2,
    marginTop: 2,
  },
  leftPlayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  infoRight: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 1,
    paddingVertical: 3,
    paddingRight: 3,
  },
  nameRight: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  emailRight: { fontSize: 12, color: '#999', marginBottom: 2 },
  descripcionRight: { fontSize: 13, marginBottom: 1, color: '#444' },
  fechaRight: { fontSize: 11, color: '#bbb', marginBottom: 5 },
  approveButtonRight: {
    backgroundColor: '#f57c00',
    paddingVertical: 6,
    paddingHorizontal: 23,
    borderRadius: 16,
    marginTop: 6,
    alignSelf: 'flex-start',
    shadowColor: '#f57c00',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
  },
  // approveButtonText se puede reutilizar o definir uno específico si es diferente
  // approvedTextRight se puede reutilizar o definir uno específico
});