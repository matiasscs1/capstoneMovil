import { useState } from "react";
import {
  obtenerEstadisticasCanjes,
  obtenerEstadisticasMisiones,
  obtenerPuntosAcumulados,
  obtenerEstadisticasInsigniasReclamadas,
  obtenerRankingUsuarios,
} from "../models/estadisticas.model.js"; 


export const useEstadisticasViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para cada pieza de datos de estadísticas
  const [estadisticasCanjes, setEstadisticasCanjes] = useState(null);
  const [estadisticasMisiones, setEstadisticasMisiones] = useState(null);
  const [puntos, setPuntos] = useState(null);
  const [estadisticasInsignias, setEstadisticasInsignias] = useState(null);
  const [ranking, setRanking] = useState([]);

  // --- Funciones para cargar cada estadística individualmente ---

  const cargarEstadisticasCanjes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerEstadisticasCanjes();
      setEstadisticasCanjes(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticasMisiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerEstadisticasMisiones();
      setEstadisticasMisiones(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cargarPuntosAcumulados = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerPuntosAcumulados();
      setPuntos(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticasInsignias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerEstadisticasInsigniasReclamadas();
      setEstadisticasInsignias(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cargarRanking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerRankingUsuarios();
      setRanking(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };


  const cargarTodasLasEstadisticas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ejecuta todas las cargas en paralelo para mayor eficiencia
      await Promise.all([
        obtenerEstadisticasCanjes().then(setEstadisticasCanjes),
        obtenerEstadisticasMisiones().then(setEstadisticasMisiones),
        obtenerPuntosAcumulados().then(setPuntos),
        obtenerEstadisticasInsigniasReclamadas().then(setEstadisticasInsignias),
        obtenerRankingUsuarios().then(setRanking),
      ]);
    } catch (e) {
      setError(e.message);
      // No es necesario lanzar el error aquí, ya que la UI reaccionará al estado de error
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados
    loading,
    error,
    estadisticasCanjes,
    estadisticasMisiones,
    puntos,
    estadisticasInsignias,
    ranking,

    // Funciones
    cargarEstadisticasCanjes,
    cargarEstadisticasMisiones,
    cargarPuntosAcumulados,
    cargarEstadisticasInsignias,
    cargarRanking,
    cargarTodasLasEstadisticas, 
  };
};