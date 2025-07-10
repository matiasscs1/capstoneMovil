// perfilUsuariosModel.js

const BASE_URL = "https://kong-0c858408d8us2s9oc.kongcloud.dev";
import { getAuthToken } from "./tokenService";

// like / unlike
export const toggleLikePublicacion = async (token, id_publicacion) => {
  const res = await fetch(
    `${BASE_URL}/publicaciones/${id_publicacion}/like`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al dar like");
  return data;
};

// eliminar publicación
export const eliminarPublicacion = async (token, id_publicacion) => {
  const res = await fetch(
    `${BASE_URL}/publicaciones/${id_publicacion}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Error al eliminar publicación");
  return data;
};

// crear comentario
export const crearComentario = async (token, publicacionId, texto) => {
  const res = await fetch(
    `${BASE_URL}/publicaciones/${publicacionId}/comentarios`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicacionId, texto }),
    }
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || data.error || "Error al crear comentario");
  return data;
};

// listar comentarios
export const listarComentarios = async (token, publicacionId) => {
  const res = await fetch(
    `${BASE_URL}/publicaciones/${publicacionId}/comentarios`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al listar comentarios");
  return data;
};

// editar comentario
export const editarComentario = async (token, id_comentario, texto) => {
  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texto }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || data.error || "Error al editar comentario");
  return data;
};

// eliminar comentario
export const eliminarComentario = async (token, id_comentario) => {
  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar comentario");
  return data;
};

// obtener datos de un usuario
export const obtenerDatosUsuario = async (id_usuario) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/usuario/${id_usuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener usuario");
  return data;
};

// publicaciones de un usuario
export const publicacionesPorUsuario = async (autorId) => {
  const token = await getAuthToken();
  const res = await fetch(
    `${BASE_URL}/publicaciones/usuario/${autorId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Error al obtener publicaciones");
  return data;
};

// obtener seguidores y seguidos de un perfil
export const obtenerSeguimientosUsuario = async (token, idPerfil) => {
  try {
    const res = await fetch(
      `${BASE_URL}/seguimientos/${idPerfil}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();

    if (!res.ok) {
      console.error('Error en obtenerSeguimientosUsuario:', data);
      throw new Error(data.message || "Error al obtener seguimientos");
    }

    return data; // { seguidores: [...], seguidos: [...] }
  } catch (error) {
    console.error('Error en obtenerSeguimientosUsuario:', error);
    throw error;
  }
};

// crear seguimiento
export const crearSeguimiento = async (token, seguidoId) => {
  try {
    const res = await fetch(`${BASE_URL}/seguimiento`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seguidoId: seguidoId }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Error al crear seguimiento:', data);
      throw new Error(data.message || "Error al seguir usuario");
    }

    return data;
  } catch (error) {
    console.error('Error en crearSeguimiento:', error);
    throw error;
  }
};

// eliminar seguimiento
export const eliminarSeguimiento = async (token, seguidoId) => {
  try {
    const res = await fetch(`${BASE_URL}/seguimiento`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seguidoId: seguidoId }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Error al eliminar seguimiento:', data);
      throw new Error(data.message || "Error al dejar de seguir usuario");
    }

    return data;
  } catch (error) {
    console.error('Error en eliminarSeguimiento:', error);
    throw error;
  }
};


// obtener insignias reclamadas por un usuario
export const obtenerInsigniasReclamadasUsuario = async (id_usuario) => {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/reclamadas/${id_usuario}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Error en obtenerInsigniasReclamadasUsuario:', data);
      throw new Error(data.message || "Error al obtener insignias reclamadas");
    }

    return data;
  } catch (error) {
    console.error('Error en obtenerInsigniasReclamadasUsuario:', error);
    throw error;
  }
};