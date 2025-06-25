import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-0c858408d8us2s9oc.kongcloud.dev';

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

export const reclamarInsignia = async (id_insignia) => {

  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/reclamar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_insignia }),
  });
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerInsigniasReclamadas = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/reclamadas`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};