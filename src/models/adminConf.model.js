import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-0c858408d8us2s9oc.kongcloud.dev';

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

// Agrega estos logs en tu adminConf.model.js

export const crearRecompensa = async (recompensaData) => {
  
  try {
    const token = await getAuthToken();
    
    const res = await fetch(`${BASE_URL}/recompensa`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: recompensaData, // FormData
    });
    
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const actualizarRecompensa = async (id, recompensaData) => {
  
  
  try {
    const token = await getAuthToken();
    
    const url = `${BASE_URL}/recompensa/${id}`;
  
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: recompensaData, // FormData
    });
    

    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('❌ ERROR Model - actualizarRecompensa:', error);
    console.error('❌ ERROR Model - message:', error.message);
    throw error;
  }
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
 

  
  try {
    const token = await getAuthToken();

    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // ❌ NO agregar Content-Type para FormData, React Native lo maneja automáticamente
      },
      body: formData,
    };
    
  

    const res = await fetch(`${BASE_URL}/insignia`, requestOptions);
 
    
    // ✅ MEJORAR: Obtener texto de respuesta primero para debug
    const responseText = await res.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ DEBUG Model - Error parsing JSON:', parseError);
      console.error('❌ DEBUG Model - Response text that failed to parse:', responseText);
      
      // Si la respuesta contiene HTML, es probable que sea un error del servidor
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        throw new Error('El servidor devolvió HTML en lugar de JSON. Posible error del servidor.');
      } else {
        throw new Error(`Error parsing JSON: ${parseError.message}. Response: ${responseText}`);
      }
    }
    
    if (!res.ok) {
      console.error('❌ DEBUG Model - Request failed with status:', res.status);
      console.error('❌ DEBUG Model - Error data:', data);
      throw new Error(data?.message || data?.error || `HTTP ${res.status}: ${responseText}`);
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ DEBUG Model - Error completo en crearInsignia:', error);
    console.error('❌ DEBUG Model - Error stack:', error.stack);
    
    // Re-throw con más contexto
    if (error.message.includes('Network request failed')) {
      throw new Error('Error de red. Verifica tu conexión a internet.');
    } else if (error.message.includes('JSON')) {
      throw new Error(`Error de formato en la respuesta del servidor: ${error.message}`);
    } else {
      throw error; // Re-throw el error original
    }
  }
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
