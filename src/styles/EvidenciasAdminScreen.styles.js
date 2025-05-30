import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    marginTop: 50,  
    overflow: 'hidden',
    elevation: 3,
    flexDirection: 'row',
    padding: 10,
    
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  email: { fontSize: 14, color: '#555', marginBottom: 8 },
  descripcion: { fontSize: 14, marginBottom: 4 },
  fecha: { fontSize: 12, color: '#888', marginBottom: 8 },
  approveButton: {
    backgroundColor: '#f57c00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  approvedText: {
    color: '#4caf50',
    fontWeight: 'bold',
    marginTop: 4,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
});
