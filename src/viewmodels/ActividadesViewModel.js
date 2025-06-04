import {getActividades} from '../models/actividades.model.js'
import React, { useState } from 'react';  

export const useActividadesViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actividades, setActividades] = useState([]);

  // Cargar actividades
  const cargarActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActividades();
      setActividades(data);
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
    actividades,
    cargarActividades,
  };
}