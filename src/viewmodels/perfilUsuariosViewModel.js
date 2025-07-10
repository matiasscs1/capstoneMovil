// perfilUsuariosViewModel.js

import { useState } from "react";
import {
  obtenerDatosUsuario,
  publicacionesPorUsuario,
  toggleLikePublicacion,
  eliminarPublicacion,
  listarComentarios,
  crearComentario,
  editarComentario,
  eliminarComentario,
  obtenerSeguimientosUsuario,
  crearSeguimiento,
  eliminarSeguimiento,
  obtenerInsigniasReclamadasUsuario,
} from "../models/perfilUsuarios.model.js";
import { getAuthToken } from "../models/tokenService";

export const usePerfilUsuarioViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [insignias, setInsignias] = useState([]);

  const [seguimientos, setSeguimientos] = useState({
    seguidores: [],
    seguidos: [],
  });
  const limpiarEstados = () => {
    setPublicaciones([]);
    setComentarios([]);
    setDatosUsuario(null);
    setSeguimientos({ seguidores: [], seguidos: [] });
    setInsignias([]);
    setError(null);
  };

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

  const cargarDatosUsuario = async (id_usuario) => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerDatosUsuario(id_usuario);
      setDatosUsuario(datos);
      return datos;
    } catch (err) {
      console.error("Error cargando datos del usuario:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cargarPublicacionesUsuario = async (autorId) => {
    try {
      setLoading(true);
      setError(null);
      const pubs = await publicacionesPorUsuario(autorId);
      const formateadas = pubs.map((p) => ({
        id_publicacion: p.id_publicacion,
        descripcion: p.descripcion,
        fechaPublicacion: p.fechaPublicacion,
        cantidadLikes: p.cantidadLikes || 0,
        meGusta: p.meGusta || false,
        imagenes: p.imagenes || [],
        autorId: p.autorId,
      }));
      setPublicaciones(formateadas);
      return formateadas;
    } catch (err) {
      console.error("Error cargando publicaciones:", err);
      setError(err.message);
      setPublicaciones([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id_publicacion) => {
    try {
      const token = await getAuthToken();
      const res = await toggleLikePublicacion(token, id_publicacion);
      setPublicaciones((prev) =>
        prev.map((pub) =>
          pub.id_publicacion === id_publicacion
            ? {
              ...pub,
              cantidadLikes: res.cantidadLikes,
              meGusta: res.meGusta,
            }
            : pub
        )
      );
      return res;
    } catch (err) {
      console.error("Error en toggle like:", err);
      setError(err.message);
      throw err;
    }
  };

  const borrarPublicacion = async (id_publicacion) => {
    try {
      const token = await getAuthToken();
      await eliminarPublicacion(token, id_publicacion);
      setPublicaciones((prev) =>
        prev.filter((pub) => pub.id_publicacion !== id_publicacion)
      );
      return true;
    } catch (err) {
      console.error("Error eliminando publicación:", err);
      setError(err.message);
      throw err;
    }
  };

  const cargarComentarios = async (publicacionId) => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      const data = await listarComentarios(token, publicacionId);
      // enriquecer autor
      const enriched = await Promise.all(
        data.map(async (c) => {
          try {
            const autor = await obtenerDatosUsuario(c.autorId);
            return { ...c, autor };
          } catch {
            return { ...c, autor: { nombre: "Usuario", apellido: "" } };
          }
        })
      );
      setComentarios(enriched);
      return enriched;
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setError(err.message);
      setComentarios([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const agregarComentario = async (publicacionId, texto) => {
    try {
      const token = await getAuthToken();
      const com = await crearComentario(token, publicacionId, texto);
      await cargarComentarios(publicacionId);
      return com;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const actualizarComentario = async (id_comentario, texto) => {
    try {
      const token = await getAuthToken();
      const upd = await editarComentario(token, id_comentario, texto);
      setComentarios((prev) =>
        prev.map((c) =>
          c.id_comentario === id_comentario ? { ...c, texto } : c
        )
      );
      return upd;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const borrarComentario = async (id_comentario) => {
    try {
      const token = await getAuthToken();
      await eliminarComentario(token, id_comentario);
      setComentarios((prev) =>
        prev.filter((c) => c.id_comentario !== id_comentario)
      );
      return true;
    } catch (err) {
      console.error("Error eliminando comentario:", err);
      setError(err.message);
      throw err;
    }
  };

  const cargarSeguimientosUsuario = async (idPerfil) => {
    try {
      const token = await getAuthToken();
      const segs = await obtenerSeguimientosUsuario(token, idPerfil);
      setSeguimientos(segs);
      return segs;
    } catch (err) {
      console.error("Error cargando seguimientos:", err);
      setSeguimientos({ seguidores: [], seguidos: [] });
      throw err;
    }
  };

  const seguirUsuario = async (seguidoId, usuarioActualId) => {
    try {
      const token = await getAuthToken();

      if (!usuarioActualId) {
        throw new Error("No se pudo identificar al usuario actual");
      }

      // 1. Verificar estado actual
      const seguimientosActuales = await obtenerSeguimientosUsuario(token, seguidoId);
      const yaSigue = seguimientosActuales.seguidores.some(seg => seg.id_usuario === usuarioActualId);


      // 2. Ejecutar acción contraria
      if (yaSigue) {
        // Dejar de seguir
        await eliminarSeguimiento(token, seguidoId);
        return {
          siguiendo: false,
          nuevosSeguidores: seguimientosActuales.seguidores.length - 1
        };
      } else {
        // Empezar a seguir
        await crearSeguimiento(token, seguidoId);
        return {
          siguiendo: true,
          nuevosSeguidores: seguimientosActuales.seguidores.length + 1
        };
      }
    } catch (error) {
      console.error("Error en seguimiento:", error);
      throw new Error(error.message || "Error al cambiar estado de seguimiento");
    }
  };

  return {
    loading,
    error,
    publicaciones,
    comentarios,
    datosUsuario,
    seguimientos,
    insignias,
    cargarDatosUsuario,
    cargarPublicacionesUsuario,
    cargarInsigniasUsuario,
    toggleLike,
    borrarPublicacion,
    cargarComentarios,
    agregarComentario,
    actualizarComentario,
    borrarComentario,
    cargarSeguimientosUsuario,
    seguirUsuario,
    limpiarEstados,
  };
};