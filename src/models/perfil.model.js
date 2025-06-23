// No necesitamos importar nada para obtener el token aquí.

const BASE_URL = "https://kong-7df170cea7usbksss.kongcloud.dev";

// TODAS las funciones ahora reciben 'token' como primer argumento.

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

