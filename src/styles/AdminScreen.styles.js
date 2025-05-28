import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 12, paddingTop: 70 },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapseIcon: { fontSize: 28, color: '#d2691e', fontWeight: 'bold' },
  sectionTitle: { fontWeight: 'bold', fontSize: 20, color: '#d2691e' },
  searchCreateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  createButton: {
    backgroundColor: '#002366',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  createButtonText: { color: 'white', fontWeight: 'bold' },

  tableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite wrap de texto
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'flex-start', // Alinea items al tope de la fila
    minHeight: 50, // Altura mínima para evitar filas muy pequeñas
  },
  tableHeader: { backgroundColor: '#002366' },
  tableHeaderCell: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 6,
    minWidth: 60,
  },

  cell: {
    flex: 1,
    minWidth: 60,
    paddingHorizontal: 6,
    color: '#000',
    flexShrink: 1,
  },

  actionButton: {
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: { backgroundColor: '#e08b22' },
  deleteButton: { backgroundColor: '#f05050' },
  actionText: { color: 'white', fontWeight: 'bold' },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 14,
    alignItems: 'center',
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  disabledButton: { backgroundColor: '#ccc' },
  pageNumber: { fontWeight: 'bold', fontSize: 16 },

  loadingOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000050',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    paddingHorizontal: 20,
    paddingTop: 60, // baja el modal desde arriba
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#002366',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#002366',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  imagePickerButton: {
    backgroundColor: '#002366',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});