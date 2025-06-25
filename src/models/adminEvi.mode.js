import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-0c858408d8us2s9oc.kongcloud.dev';

// Obtener todas las evidencias
export const verEvidencias = async () => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/evidencias`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const modificarEvidencia = async (id_evidencia, evidencia) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/evidencia/${id_evidencia}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(evidencia),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

