import { useState } from "react";
import {
  obtenerInsignias,
  reclamarInsignia,
  obtenerInsigniasReclamadas,
} from "../models/insiniga.model.js";

export const useInsigniasViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insignias, setInsignias] = useState([]);
  const [insigniasReclamadas, setInsigniasReclamadas] = useState([]);

  // Cargar todas las insignias disponibles
  const cargarInsignias = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await obtenerInsignias();
    setInsignias(data || []); 
    return data;
  } catch (e) {
    setError(e.message);
    throw e;
  } finally {
    setLoading(false);
  }
};

  // Cargar insignias reclamadas por el usuario
  const cargarInsigniasReclamadas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerInsigniasReclamadas();
      setInsigniasReclamadas(data || []);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Reclamar una insignia por id
  const reclamar = async (id_insignia) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reclamarInsignia(id_insignia);
      // Recargar insignias y reclamadas después de reclamar
      await cargarInsignias();
      await cargarInsigniasReclamadas();
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
    insignias,
    insigniasReclamadas,
    cargarInsignias,
    cargarInsigniasReclamadas,
    reclamar,
  };
};