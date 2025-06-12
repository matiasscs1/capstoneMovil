
import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

// RECOMPENSAS
export const obtenerRecompensasUsuario = async () => {

  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/recompensas/usuario`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);
  return data;
};

export const canjearRecompensa = async (id_recompensa) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/cajerRecompensa`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_recompensa }),  // <>
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const verCanjesUsuarios = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/canjes`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
