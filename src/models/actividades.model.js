import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-0c858408d8us2s9oc.kongcloud.dev';

export const getActividades = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/actividades`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

