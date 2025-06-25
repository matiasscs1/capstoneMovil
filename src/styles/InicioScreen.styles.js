
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  emptyTextRed: {
    fontSize: 16,
    color: '#dc2626', // Rojo
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  orangeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: '#f97316'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
    marginBottom: 2
  },
  descripcion: {
    fontSize: 15,
    color: '#4b5563',
    textTransform: 'capitalize',
    lineHeight: 20
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#fed7aa'
  },
  puntosContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  puntosBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fef3c7'
  },
  puntosValor: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginHorizontal: 8
  },
  puntosTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563'
  },
  fechaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12
  },
  fechaLabel: {
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
    fontSize: 14
  },
  fechaValor: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14
  },
  diasRestantesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 18,
    gap: 4
  },
  diasRestantesValor: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827'
  },
  diasRestantesTexto: {
    fontSize: 15,
    color: '#6b7280'
  },
  tiempoLimitado: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    backgroundColor: '#fee2e2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'center'
  },
  button: {
    marginTop: 18,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.8
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600'
  },
  infoExtra: {
    marginTop: 14,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginTop: 2
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6'
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top'
  },
  documentsContainer: {
    marginBottom: 20
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: 12
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginTop: 10,
    textAlign: 'center'
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center'
  },
  archivosContainer: {
    marginTop: 8,
    maxHeight: 120
  },
  archivoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8
  },
  archivoNombre: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginRight: 10
  },
  eliminarBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  submitButton: {
    flex: 1.5,
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#fdba74',
    opacity: 0.7
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});