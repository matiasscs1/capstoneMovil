import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

// ACTIVIDADES
export const crearActividad = async (actividadData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/actividad`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(actividadData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerActividades = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/actividades`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const actualizarActividad = async (id, actividadData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/actividad/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(actividadData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const eliminarActividad = async (id) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/actividad/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  return { message: 'Actividad eliminada correctamente' };
};

// MISIONES
export const crearMision = async (misionData) => {
  console.log('Datos de la misión:', misionData); // Para depuración
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/mision`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(misionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const verMisiones = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/misiones/admin`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.misiones || data; // Ajusta según tu API
};

export const editarMision = async (id, misionData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/mision/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(misionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const eliminarMision = async (id) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/mision/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  return { message: 'Misión eliminada correctamente' };
};

// USUARIOS (sin foto)
export const obtenerUsuarios = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const crearUsuarioAdministrador = async (usuarioData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/crear-admin`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const actualizarUsuarioAdmin = async (id, usuarioData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/usuarios/admin/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const eliminarUsuario = async (id) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/usuario/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  return { message: 'Usuario eliminado correctamente' };
};

// RECOMPENSAS
export const verRecompensas = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/recompensas/admin`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.recompensas || data;
};

export const crearRecompensa = async (recompensaData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/recompensa`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(recompensaData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const actualizarRecompensa = async (id, recompensaData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/recompensa/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(recompensaData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const eliminarRecompensa = async (id) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/recompensa/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  return { message: 'Recompensa eliminada correctamente' };
};

// INSIGNIAS (con FormData)
export const obtenerInsignias = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/insignias`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const crearInsignia = async (formData) => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/insignia`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};


export const actualizarInsignia = async (id, formData) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/insignia/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // FormData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const eliminarInsignia = async (id_insignia) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/insignia/${id_insignia}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  return { message: 'Insignia eliminada correctamente' };
};
