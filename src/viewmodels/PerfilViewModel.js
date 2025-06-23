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
  obtenerSeguidoresYSeguidos,
  contarSeguidoresYSeguidos,
  crearSeguimiento,
  actualizarUsuario,
} from '../models/perfil.model.js';

export const usePerfilViewModel = () => {
  const { token } = useAuth(); // <-- Obtener el token del contexto

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [seguidoresYSeguidos, setSeguimientos] = useState(null);
  const [conteoSeguidores, setConteoSeguidores] = useState(null);

  // TODAS las funciones ahora pasan el 'token' a la capa del modelo.

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


  return {
    loading,
    error,
    publicaciones,
    comentarios,
    seguidoresYSeguidos,
    conteoSeguidores,
    cargarMisPublicaciones,
    darLike,
    borrarPublicacion,
    cargarComentarios,
    comentar,
    actualizarComentario,
    borrarComentario,
    contarSeguimientos,
    
  };
};