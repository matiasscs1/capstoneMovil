import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor principal de cada publicación
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },

  // Header de la publicación (autor, fecha)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },

  // Contenedor del autor (foto + info)
  autorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Foto de perfil del autor
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },

  // Contenedor del texto del header
  headerTextContainer: {
    flex: 1,
  },

  // Nombre del autor
  nombreAutor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // Estilo para nombres clickeables
  nombreClickeable: {
    color: '#007AFF',
  },

  // Fecha en el header
  fechaHeader: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Imagen principal de la publicación
  imagenPublicacion: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },

  // Descripción de la publicación
  descripcion: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },

  // Fila de interacciones (likes, comentarios)
  interaccionesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 8,
  },

  // Contenedor para mostrar likes (sin interacción)
  likeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Icono del corazón
  iconoCorazon: {
    fontSize: 18,
    marginRight: 6,
  },

  // Contador de likes
  likesCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Sección de comentarios
  comentariosSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  // Título de la sección comentarios
  comentariosTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  // Cada comentario individual
  comentarioItem: {
    marginBottom: 10,
    paddingLeft: 4,
  },

  // Nombre del autor del comentario
  nombreComentario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  // Texto del comentario
  textoComentario: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  // Contenedor cuando no hay comentarios
  noComentariosContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    paddingVertical: 8,
  },

  // Texto cuando no hay comentarios
  noComentariosText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },

  // Estilos adicionales que podrías necesitar
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Para el loader
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },

  // Para cuando no hay publicaciones
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Para el pull to refresh
  refreshControl: {
    backgroundColor: '#f8f9fa',
  },
});