import { useState } from 'react';
import {
  obtenerMisPublicaciones,
  toggleLikePublicacion,
  eliminarPublicacion,
  crearComentario,
  listarComentarios,
  editarComentario,
  eliminarComentario,
  obtenerSeguidoresYSeguidos,
  contarSeguidoresYSeguidos,
  crearSeguimiento
} from '../models/perfil.model.js';

export const usePerfilViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [seguidoresYSeguidos, setSeguimientos] = useState(null);
  const [conteoSeguidores, setConteoSeguidores] = useState(null);

  // Obtener publicaciones del usuario
  const cargarMisPublicaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerMisPublicaciones();
      setPublicaciones(data || []);
      console.log(data)
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Like/Dislike
  const darLike = async (id_publicacion) => {
    try {
      const data = await toggleLikePublicacion(id_publicacion);
      await cargarMisPublicaciones(); // refresca lista
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Eliminar publicación
  const borrarPublicacion = async (id_publicacion) => {
    try {
      const data = await eliminarPublicacion(id_publicacion);
      await cargarMisPublicaciones();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Crear comentario
  const comentar = async (publicacionId, texto) => {
    try {
      const nuevo = await crearComentario(publicacionId, texto);
      await cargarComentarios(publicacionId);
      return nuevo;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Cargar comentarios
  const cargarComentarios = async (publicacionId) => {
    try {
      const data = await listarComentarios(publicacionId);
      setComentarios(data || []);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Editar comentario
  const actualizarComentario = async (id_comentario, texto) => {
    try {
      const actualizado = await editarComentario(id_comentario, texto);
      return actualizado;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Eliminar comentario
  const borrarComentario = async (id_comentario) => {
    try {
      const eliminado = await eliminarComentario(id_comentario);
      return eliminado;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Seguidores y seguidos
  const cargarSeguimientos = async () => {
    try {
      const data = await obtenerSeguidoresYSeguidos();
      setSeguimientos(data?.seguimientos || []);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const contarSeguimientos = async () => {
    try {
      const data = await contarSeguidoresYSeguidos();
      setConteoSeguidores(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const seguirUsuario = async (seguidoId) => {
    try {
      const data = await crearSeguimiento(seguidoId);
      await cargarSeguimientos();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  return {
    loading,
    error,
    publicaciones,
    comentarios,
    seguidoresYSeguidos,
    conteoSeguidores,
    // Publicaciones
    cargarMisPublicaciones,
    darLike,
    borrarPublicacion,
    // Comentarios
    cargarComentarios,
    comentar,
    actualizarComentario,
    borrarComentario,
    // Seguimiento
    cargarSeguimientos,
    contarSeguimientos,
    seguirUsuario
  };
};
