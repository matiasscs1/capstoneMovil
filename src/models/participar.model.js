import { getAuthToken } from './tokenService';

const BASE_URL = 'https://kong-7df170cea7usbksss.kongcloud.dev';

export const obtenerInscripcionesActivas = async () => {
    
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/activas`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener las inscripciones activas');
    }
    const data = await response.json();
    return data;
};

export const subirEvidencia = async (id_inscripcion, formData) => {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/evidencia/${id_inscripcion}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Error al subir la evidencia');
    }
    return response.json();
};



export const verProgreso = async (id_inscripcion) => {
    let token;

    if (!id_inscripcion) {
        throw new Error('ID de inscripción no proporcionado para ver el progreso.');
    }

    try {
        token = await getAuthToken();
        if (!token) {
            throw new Error('Token de autenticación no disponible.');
        }
    } catch (error) {
        throw new Error(`Fallo al obtener token: ${error.message}`);
    }

    const url = `${BASE_URL}/ver-progreso/${id_inscripcion}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorJson = {};
            try {
                if (responseText) errorJson = JSON.parse(responseText);
            } catch (e) {
                // Silenciosamente ignorar si el cuerpo del error no es JSON
            }

            if (response.status === 400 && errorJson.message === "La evidencia aún no ha sido revisada.") {
                return { 
                    status: 'pendiente',
                    message: errorJson.message 
                }; 
            }

            const errorMessage = errorJson.message || responseText || `Error HTTP ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        if (!responseText) {
            throw new Error('Respuesta exitosa del servidor pero cuerpo vacío.');
        }
        
        const data = JSON.parse(responseText);
        return { status: 'otorgado', ...data };

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al obtener el progreso.');
    }
};
export const verMisiones = async () => {
    const token = await getAuthToken();

    const response = await fetch(`${BASE_URL}/misiones`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }); 
    if (!response.ok) {
        throw new Error('Error al obtener las misiones');
    }
    const data = await response.json();
    return data;
}

export const inscribirseAMision = async (id_mision) => {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/subir`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_mision }),
    });
    if (!response.ok) {
        throw new Error('Error al inscribirse a la misión');
    }
    return response.json();
};
