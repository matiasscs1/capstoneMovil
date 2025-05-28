import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 25,
  },
  plus: {
    fontSize: 36,
    color: '#1e3a8a',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    marginBottom: 14,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#f57c00',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loginLink: {
    color: '#1e3a8a',
    fontSize: 14,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#f57c00',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  modalRolContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
  },
  rolOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rolOptionText: {
    fontSize: 16,
  },
});