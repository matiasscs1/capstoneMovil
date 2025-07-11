// No necesitamos importar nada para obtener el token aquí.

const BASE_URL = "https://kong-0c858408d8us2s9oc.kongcloud.dev";
import { getAuthToken } from './tokenService';

// TODAS las funciones ahora reciben 'token' como primer argumento.

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

export const obtenerMisPublicaciones = async (token) => {
  const res = await fetch(`${BASE_URL}/mis-publicaciones`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener publicaciones");
  return data;
};

export const toggleLikePublicacion = async (token, id_publicacion) => {
  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al dar like");
  return data;
};

export const eliminarPublicacion = async (token, id_publicacion) => {
  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar publicación");
  return data;
};

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

export const eliminarComentario = async (token, id_comentario) => {
  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar comentario");
  return data;
};

export const obtenerSeguidoresYSeguidos = async (token) => {
  const res = await fetch(`${BASE_URL}/seguimientos`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener seguimientos");
  return data;
};

export const contarSeguidoresYSeguidos = async (token) => {
  const res = await fetch(`${BASE_URL}/seguidores-contar`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al contar");
  return data;
};

export const crearSeguimiento = async (token, seguidoId) => {
  const res = await fetch(`${BASE_URL}/seguimientos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seguidoId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al seguir usuario");
  return data;
};

export const obtenerDatosUsuario = async (id_usuario) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/usuario/${id_usuario}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener datos del usuario');
  return data;
};

export const publicacionesPorUsuario = async (autorId) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones/usuario/${autorId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener publicaciones del usuario');
  return data;
};

// Agregar esta función a tu perfil.model.js

export const actualizarUsuario = async (id_usuario, datosActualizar) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const res = await fetch(`${BASE_URL}/usuario/${id_usuario}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosActualizar),
    });

    const data = await res.json();

    if (!res.ok) {
      // ✅ Detectar errores específicos sin mostrar detalles
      if (res.status === 409 || (data.error && JSON.stringify(data.error).includes('duplicate key'))) {
        throw new Error('CORREO_DUPLICADO');
      }
      
      // ✅ Error genérico para otros casos
      throw new Error('ERROR_ACTUALIZACION');
    }

    return data.usuario; 
  } catch (error) {
    // ✅ No hacer console.error para evitar logs en terminal
    // Solo re-lanzar el error procesado
    if (error.message === 'CORREO_DUPLICADO' || error.message === 'ERROR_ACTUALIZACION') {
      throw error;
    }
    // Para otros errores, lanzar error genérico
    throw new Error('ERROR_ACTUALIZACION');
  }
};