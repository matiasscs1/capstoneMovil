import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-0c858408d8us2s9oc.kongcloud.dev';

export const obtenerInscripcionesActivas = async () => {
  const token = await getAuthToken();

  const url = `${BASE_URL}/activas`;
  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await fetch(url, options);
  
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error ${response.status} al obtener inscripciones: ${text}`
    );
  }

  const data = JSON.parse(text);
  return data;
};

export const subirEvidencia = async (id_inscripcion, formData) => {
  
  const token = await getAuthToken();

  const url = `${BASE_URL}/evidencia/${id_inscripcion}`;
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  };

  const response = await fetch(url, options);
  
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error ${response.status} al subir evidencia: ${text}`
    );
  }

  const data = JSON.parse(text);
  return data;
};

export const verProgreso = async (id_inscripcion) => {
  if (!id_inscripcion) {
    throw new Error(
      'ID de inscripción no proporcionado para ver el progreso.'
    );
  }

  const token = await getAuthToken();

  const url = `${BASE_URL}/ver-progreso/${id_inscripcion}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(url, options);
  const text = await response.text();


  if (!response.ok) {
    let errJson = {};
    try {
      errJson = JSON.parse(text);
    } catch {}

    if (
      response.status === 400 &&
      errJson.message === "La evidencia aún no ha sido revisada."
    ) {
      return {
        status: 'pendiente',
        message: errJson.message,
      };
    }

    const msg = errJson.message || text || response.statusText;
    throw new Error(`Error al ver progreso: ${msg}`);
  }

  if (!text) {
    throw new Error(
      'Respuesta exitosa del servidor pero cuerpo vacío.'
    );
  }

  const data = JSON.parse(text);
  return { status: 'otorgado', ...data };
};

export const verMisiones = async () => {
  const token = await getAuthToken();

  const url = `${BASE_URL}/misiones`;
  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await fetch(url, options);
  
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Error al obtener misiones: ${text}`);
  }

  const data = JSON.parse(text);
  return data;
};

export const inscribirseAMision = async (id_mision) => {
  const token = await getAuthToken();

  const url = `${BASE_URL}/subir`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_mision }),
  };

  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error al inscribirse a la misión: ${text}`
    );
  }

  const data = JSON.parse(text);
  return data;
};