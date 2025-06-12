import { StyleSheet } from 'react-native';
const COLOR_SHADOW = '#FFD2B3';
const COLOR_NARANJA = '#FF7F32';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }, // FONDO BLANCO
  animCalendar: {
    marginTop: 30,
    marginBottom: 0,
  },
  calendar: {
    marginHorizontal: 18,
    marginTop: 0,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLOR_SHADOW,
    shadowOpacity: 0.11,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  detalleContainer: { flex: 1, padding: 18, backgroundColor: '#fff' }, // BLANCO
  eventoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: COLOR_SHADOW,
    shadowOpacity: 0.11,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  eventoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR_NARANJA,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  eventoDescripcion: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  eventoSubinfo: {
    fontSize: 13,
    color: COLOR_NARANJA,
    marginRight: 18,
    marginTop: 4,
  },
  noEventos: {
    fontSize: 16,
    color: '#ffae5c',
    marginTop: 38,
    textAlign: 'center',
    fontWeight: '600',
  },
  error: { color: '#d93a3a', textAlign: 'center', marginTop: 14 },
});
