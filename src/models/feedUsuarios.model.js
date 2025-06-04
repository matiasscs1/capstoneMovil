const BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

// Función genérica para obtener token, adapta según tu implementación
import { getAuthToken } from './tokenService';

// --- PUBLICACIONES ---

export const crearPublicacion = async (formData) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // NO debes poner 'Content-Type': multipart/form-data porque fetch lo asigna automáticamente
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Error al crear publicación');

  return data;
};

export const listarPublicaciones = async () => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();


  if (!res.ok) throw new Error(data.message || 'Error al listar publicaciones');
  return data;
};

export const misPublicaciones = async () => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/mis-publicaciones`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tus publicaciones');
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

export const darLike = async (id_publicacion) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al procesar like');
  return data;
};

export const actualizarDescripcion = async (id_publicacion, descripcion) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ descripcion }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar la descripción');
  return data;
};

export const eliminarPublicacion = async (id_publicacion) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar la publicación');
  return data;
};

// --- COMENTARIOS ---

export const crearComentario = async (publicacionId, texto) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones/${publicacionId}/comentarios`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      texto,
      publicacionId,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok && data.error) {
    // Lanza el mensaje del backend
    throw new Error(data.error);
  }

  if (!res.ok) {
    throw new Error(data.message || 'No se pudo crear el comentario');
  }

  return data;
};



export const listarComentarios = async (publicacionId) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/publicaciones/${publicacionId}/comentarios`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al listar comentarios');
  return data;
};

export const editarComentario = async (id_comentario, texto) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texto }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    // Da prioridad a data.error (backend personalizado), luego message, luego texto genérico
    throw new Error(data.error || data.message || 'Error al editar comentario');
  }

  return data;
};


export const eliminarComentario = async (id_comentario) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar comentario');
  return data;
};

// --- USUARIO ---

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

