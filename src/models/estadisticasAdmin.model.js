import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

// Obtener usuarios
export const obtenerUsuarios = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Obtener publicaciones
export const obtenerPublicaciones = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/publicaciones`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Obtener recompensas
export const obtenerRecompensas = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/recompensas/admin`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.recompensas || [];
};

// Obtener ranking
export const obtenerRanking = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/ranking`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.ranking;
};

// Obtener canjes
export const obtenerCanjes = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/canjes`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/usuario/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};