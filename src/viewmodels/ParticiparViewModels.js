// hooks/useMisionViewModel.js
import { useState } from 'react';
import {
  obtenerInscripcionesActivas,
  subirEvidencia,
  verProgreso,
  verMisiones,
  inscribirseAMision,
} from '../models/participar.model.js';

export const useMisionViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [misiones, setMisiones] = useState([]);
  const [progreso, setProgreso] = useState(null);

  // Cargar inscripciones activas
  const cargarInscripciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerInscripcionesActivas();
      setInscripciones(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Cargar misiones
  const cargarMisiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await verMisiones();
      setMisiones(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Consultar progreso de una inscripción
  const cargarProgreso = async (id_inscripcion) => {
    setLoading(true);
    setError(null);
    try {
      const data = await verProgreso(id_inscripcion);
      setProgreso(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Subir evidencia para inscripción
  const enviarEvidencia = async (id_inscripcion, formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await subirEvidencia(id_inscripcion, formData);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Inscribirse a una misión
  const participarMision = async (id_mision) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inscribirseAMision(id_mision);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    inscripciones,
    misiones,
    progreso,
    cargarInscripciones,
    cargarMisiones,
    cargarProgreso,
    enviarEvidencia,
    participarMision,
  };
};
