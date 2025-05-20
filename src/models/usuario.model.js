import { getAuthToken } from './tokenService';

BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

export const loginUser = async (correo, contrasenia) => {

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasenia }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const verify2FACode = async (correo, codigo) => {

  const res = await fetch(`${BASE_URL}/2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, codigo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};





export const getPerfil = async () => {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const registerTemp = async (formData) => {
  const res = await fetch(`${BASE_URL}/register-temp`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};


export const verificarCorreo = async (correo, codigo) => {
  const res = await fetch(`${BASE_URL}/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, codigo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
