import { getAuthToken } from "./tokenService";
const BASE_URL = "https://kong-0c858408d8us2s9oc.kongcloud.dev";

export const calcularProgresoInsignias = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/progreso`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerEstadisticasCanjes = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/canjes-estadisticas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerEstadisticasMisiones = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/misiones-estadisticas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerPuntosAcumulados = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/puntos-acumulados-estadisticas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerEstadisticasInsigniasReclamadas = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/insignias-reclamadas-estadisticas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerRankingUsuarios = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/ranking`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  // El backend devuelve { message, ranking }, devolvemos solo el array
  return data.ranking;
};


export const obtenerEstadisticasNotas = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/estadisticas-notas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const obtenerAtencionConcentracion = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/atencion-concentracion`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};