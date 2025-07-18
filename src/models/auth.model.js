import { getAuthToken } from './tokenService';

BASE_URL = 'https://kong-0c858408d8us2s9oc.kongcloud.dev';

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

export const loginAdmin = async (codigo) => {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const recuperarCodigoAdmin = async (correo) => {
  const res = await fetch(`${BASE_URL}/solicitar-nuevo-codigo-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}


export const solicitarCambioContrasenia = async (correo) => {
  const res = await fetch(`${BASE_URL}/solicitar-cambio-contrasenia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const cambiarContrasenia = async (correo, codigo, contrasenia) => {
  const res = await fetch(`${BASE_URL}/cambiar-contrasenia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, codigo, contrasenia }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};