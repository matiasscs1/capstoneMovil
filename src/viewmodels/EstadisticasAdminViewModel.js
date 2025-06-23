import { useState, useEffect } from 'react';
import {
  obtenerUsuarios,
  obtenerPublicaciones,
  obtenerRecompensas,
  obtenerRanking,
  obtenerCanjes,
  obtenerUsuarioPorId,
} from '../models/estadisticasAdmin.model.js';

export const useEstadisticas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [canjes, setCanjes] = useState([]);
  const [autorPublicacion, setAutorPublicacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        usuariosData,
        publicacionesData,
        recompensasData,
        rankingData,
        canjesData,
      ] = await Promise.all([
        obtenerUsuarios(),
        obtenerPublicaciones(),
        obtenerRecompensas(),
        obtenerRanking(),
        obtenerCanjes(),
      ]);

      setUsuarios(usuariosData);
      setPublicaciones(publicacionesData);
      setRecompensas(recompensasData);
      setRanking(rankingData);
      setCanjes(canjesData);

      // Obtener autor de la publicación con más likes
      if (publicacionesData.length > 0) {
        const publicacionConMasLikes = publicacionesData.reduce(
          (prev, current) => (prev.likes > current.likes ? prev : current),
          { likes: 0 }
        );

        if (publicacionConMasLikes.autorId) {
          const autor = await obtenerUsuarioPorId(publicacionConMasLikes.autorId);
          setAutorPublicacion(autor);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Procesar datos para estadísticas - Solo Top 3
  const recompensasRanking = recompensas
    .map((rec) => ({
      ...rec,
      totalReclamada:
        rec.historialReclamos?.reduce(
          (sum, reclamo) => sum + (reclamo.cantidadReclamada || 0),
          0
        ) || 0,
    }))
    .sort((a, b) => b.totalReclamada - a.totalReclamada)
    .slice(0, 3); // Solo top 3

  const conteoPorUsuario = canjes.reduce((acc, canje) => {
    const nombreCompleto = `${canje.nombre} ${canje.apellido}`;
    acc[nombreCompleto] = (acc[nombreCompleto] || 0) + 1;
    return acc;
  }, {});

  const usuariosCanjeosRanking = Object.entries(conteoPorUsuario)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3); // Solo top 3

  const usuariosConSesiones = usuarios
    .map((usuario) => {
      const totalSesiones = usuario.sesionesIniciadas?.reduce(
        (sum, sesion) => sum + (sesion.contador || 0),
        0
      );
      return { ...usuario, totalSesiones };
    })
    .sort((a, b) => b.totalSesiones - a.totalSesiones)
    .slice(0, 3); // Solo top 3

  const publicacionConMasLikes = publicaciones.reduce(
    (prev, current) => (prev.likes > current.likes ? prev : current),
    { likes: 0 }
  );

  return {
    loading,
    error,
    ranking: ranking.slice(0, 3), // Solo top 3
    recompensasRanking,
    usuariosCanjeosRanking,
    usuariosConSesiones,
    publicacionConMasLikes,
    autorPublicacion,
    refrescar: cargarDatos,
  };
};