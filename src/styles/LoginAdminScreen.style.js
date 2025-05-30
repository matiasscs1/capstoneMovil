import { StyleSheet, Dimensions } from 'react-native';

// Obtener ancho de pantalla
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 60,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 10,
  },
  link: {
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    fontSize: width > 400 ? 18 : 16, // Aquí sí funciona
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f57c00',
    paddingVertical: width > 400 ? 16 : 12, // Aquí sí funciona
    borderRadius: 25,
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width > 400 ? 20 : 18, // Aquí sí funciona
    textAlign: 'center',
  },
});
