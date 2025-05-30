import { useState } from 'react';
import {
  crearPublicacion,
  listarPublicaciones,
  misPublicaciones,
  publicacionesPorUsuario,
  darLike,
  actualizarDescripcion,
  eliminarPublicacion,
  crearComentario,
  listarComentarios,
  editarComentario,
  eliminarComentario,
  obtenerDatosUsuario,
} from '../models/feedUsuarios.model.js';

export const usePublicacionesViewModel = () => {
  // Estados para inputs, listas, loading, etc.
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState([]); // archivos tipo File[]
  const [publicaciones, setPublicaciones] = useState([]);
  const [misPosts, setMisPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crear publicación
const crear = async (descripcionParam, archivosParam) => {
  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();

    formData.append('descripcion', descripcionParam);

    archivosParam.forEach((archivo, i) => {
      formData.append('archivos', {
        uri: archivo.uri,
        name: archivo.name || `archivo_${i}.jpg`,
        type: archivo.type || 'image/jpeg',
      });
    });

    const nuevaPub = await crearPublicacion(formData);

    return nuevaPub;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};




  // Listar todas las publicaciones (feed general)
  const cargarPublicaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const lista = await listarPublicaciones();
      setPublicaciones(lista);
      return lista;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listar mis publicaciones
  const cargarMisPublicaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const lista = await misPublicaciones();
      setMisPosts(lista);
      return lista;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Dar like / quitar like
  const toggleLike = async (id_publicacion) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await darLike(id_publicacion);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar descripción publicación
  const editarDescripcion = async (id_publicacion, nuevaDescripcion) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await actualizarDescripcion(id_publicacion, nuevaDescripcion);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar publicación
  const eliminar = async (id_publicacion) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await eliminarPublicacion(id_publicacion);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear comentario
  const crearComent = async (publicacionId, texto) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await crearComentario(publicacionId, texto);
      return nuevo;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listar comentarios de publicación
  const cargarComentarios = async (publicacionId) => {
    setLoading(true);
    setError(null);
    try {
      const lista = await listarComentarios(publicacionId);
      setComentarios(lista);
      return lista;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Editar comentario
  const editarComent = async (id_comentario, texto) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await editarComentario(id_comentario, texto);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar comentario
  const eliminarComent = async (id_comentario) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await eliminarComentario(id_comentario);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos de usuario
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

  return {
    descripcion,
    setDescripcion,
    archivos,
    setArchivos,
    publicaciones,
    misPosts,
    comentarios,
    loading,
    error,
    crear,
    cargarPublicaciones,
    cargarMisPublicaciones,
    toggleLike,
    editarDescripcion,
    eliminar,
    crearComent,
    cargarComentarios,
    editarComent,
    eliminarComent,
    cargarDatosUsuario,
  };
};
