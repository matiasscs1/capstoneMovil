// src/viewmodels/useProfileViewModel.js
import { useState, useEffect } from 'react';
import { getPerfil } from '../models/api';

export default function useProfileViewModel() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (err) {
        console.error('Error cargando perfil:', err.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return { perfil, loading };
}
