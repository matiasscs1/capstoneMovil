import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

// Obtener publicaciones del usuario
export const obtenerMisPublicaciones = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/mis-publicaciones`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener publicaciones');
  return data;
};

// Dar like o quitar like
export const toggleLikePublicacion = async (id_publicacion) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al dar like');
  return data;
};

// Eliminar publicación (solo autor o admin)
export const eliminarPublicacion = async (id_publicacion) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/publicaciones/${id_publicacion}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar publicación');
  return data;
};

// Crear comentario
export const crearComentario = async (publicacionId, texto) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/publicaciones/${publicacionId}/comentarios`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ publicacionId, texto })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Error al crear comentario');
  return data;
};

// Listar comentarios
export const listarComentarios = async (publicacionId) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/publicaciones/${publicacionId}/comentarios`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al listar comentarios');
  return data;
};

// Editar comentario
export const editarComentario = async (id_comentario, texto) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texto })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Error al editar comentario');
  return data;
};

// Eliminar comentario
export const eliminarComentario = async (id_comentario) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/comentarios/${id_comentario}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar comentario');
  return data;
};
// Obtener seguidores y seguidos
export const obtenerSeguidoresYSeguidos = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/seguimientos`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener seguimientos');
  return data;
};

// Contar seguidores y seguidos
export const contarSeguidoresYSeguidos = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/seguidores-contar`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al contar');
  return data;
};

// Crear seguimiento
export const crearSeguimiento = async (seguidoId) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/seguimientos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ seguidoId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al seguir usuario');
  return data;
};
