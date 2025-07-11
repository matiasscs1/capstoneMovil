import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- Importar el hook de autenticación
import {
  obtenerMisPublicaciones,
  toggleLikePublicacion,
  eliminarPublicacion,
  crearComentario,
  listarComentarios,
  editarComentario,
  eliminarComentario,
  publicacionesPorUsuario,
  obtenerSeguidoresYSeguidos,
  contarSeguidoresYSeguidos,
  crearSeguimiento,
  actualizarUsuario,
  obtenerDatosUsuario,
  obtenerInsigniasReclamadasUsuario,
} from '../models/perfil.model.js';

export const usePerfilViewModel = () => {
  const { token } = useAuth(); // <-- Obtener el token del contexto

  const [insignias, setInsignias] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [seguidoresYSeguidos, setSeguimientos] = useState(null);
  const [conteoSeguidores, setConteoSeguidores] = useState(null);

  // TODAS las funciones ahora pasan el 'token' a la capa del modelo.

  const cargarInsigniasUsuario = async (id_usuario) => {
    if (!id_usuario) {
      setError('ID de usuario requerido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await obtenerInsigniasReclamadasUsuario(id_usuario);
      setInsignias(data || []);
      return data;
    } catch (err) {
      console.error('Error cargando insignias:', err);
      setError(err.message);
      setInsignias([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cargarMisPublicaciones = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerMisPublicaciones(token);
      setPublicaciones(data || []);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const darLike = async (id_publicacion) => {
    if (!token) return;
    try {
      const data = await toggleLikePublicacion(token, id_publicacion);
      await cargarMisPublicaciones();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const borrarPublicacion = async (id_publicacion) => {
    if (!token) return;
    try {
      const data = await eliminarPublicacion(token, id_publicacion);
      await cargarMisPublicaciones();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const comentar = async (publicacionId, texto) => {
    if (!token) return;
    try {
      const nuevo = await crearComentario(token, publicacionId, texto);
      await cargarComentarios(publicacionId);
      return nuevo;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const cargarComentarios = async (publicacionId) => {
    if (!token) return;
    try {
      const data = await listarComentarios(token, publicacionId);
      setComentarios(data || []);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const actualizarComentario = async (id_comentario, texto) => {
    if (!token) return;
    try {
      const actualizado = await editarComentario(token, id_comentario, texto);
      return actualizado;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const borrarComentario = async (id_comentario) => {
    if (!token) return;
    try {
      const eliminado = await eliminarComentario(token, id_comentario);
      return eliminado;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const contarSeguimientos = async () => {
    if (!token) return;
    try {
      const data = await contarSeguidoresYSeguidos(token);
      setConteoSeguidores(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };
  const cargarDatosUsuario = async (id_usuario) => {
    setLoading(true);
    setError(null);
    try {
      const usuario = await obtenerDatosUsuario(id_usuario);
      return usuario;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cargarPublicacionesporUsuario = async (id_usuario) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await publicacionesPorUsuario(token, id_usuario);
      setPublicaciones(data || []);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  const actualizarPerfil = async (id_usuario, datosActualizar) => {
    if (!token) {
      throw new Error('Token no disponible');
    }

    setLoading(true);
    setError(null);

    try {
      const usuarioActualizado = await actualizarUsuario(id_usuario, datosActualizar);
      return usuarioActualizado;
    } catch (err) {
      // ✅ No hacer console.error para evitar logs
      // Solo establecer un mensaje genérico
      setError('Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    publicaciones,
    comentarios,
    seguidoresYSeguidos,
    conteoSeguidores,
    insignias,
    cargarMisPublicaciones,
    cargarInsigniasUsuario,
    darLike,
    borrarPublicacion,
    cargarComentarios,
    comentar,
    actualizarComentario,
    borrarComentario,
    contarSeguimientos,
    cargarDatosUsuario,
    cargarPublicacionesporUsuario,
    actualizarPerfil
  };
};