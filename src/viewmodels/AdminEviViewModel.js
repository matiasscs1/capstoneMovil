import { useState } from 'react';
import { verEvidencias, modificarEvidencia } from '../models/adminEvi.mode.js';

export const useAdminEviViewModel = () => {
  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null); // Para loading de aprobar
  const [page, setPage] = useState(1);

  const fetchEvidencias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await verEvidencias();
      setEvidencias(data);
    } catch (err) {
      setError(err.message || 'Error al cargar evidencias');
    } finally {
      setLoading(false);
    }
  };

  const updateEvidencia = async (id_evidencia, data) => {
    setLoadingId(id_evidencia);
    try {
      await modificarEvidencia(id_evidencia, data);
      await fetchEvidencias();
      setPage(1);
    } catch (error) {
      console.error('Error al actualizar evidencia:', error);
      alert('Error al actualizar la evidencia');
    } finally {
      setLoadingId(null);
    }
  };

  return {
    evidencias,
    loading,
    error,
    fetchEvidencias,
    updateEvidencia,
    setEvidencias,
    loadingId,
    page,
    setPage,
  };
};
