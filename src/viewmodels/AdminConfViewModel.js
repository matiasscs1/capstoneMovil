import { useState } from 'react';
import {
  crearActividad,
  obtenerActividades,
  actualizarActividad,
  eliminarActividad,
  crearMision,
  verMisiones,
  editarMision,
  eliminarMision,
  obtenerUsuarios,
  actualizarUsuarioAdmin,
  eliminarUsuario,
  crearUsuarioAdministrador,
  verRecompensas,
  crearRecompensa,
  actualizarRecompensa,
  eliminarRecompensa,
  obtenerInsignias,
  crearInsignia,
  actualizarInsignia,
  eliminarInsignia,
} from '../models/adminConf.model.js';

export const useAdminConfViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [actividades, setActividades] = useState([]);
  const [misiones, setMisiones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [insignias, setInsignias] = useState([]);

  // Cargar listas
  const cargarActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerActividades();
      setActividades(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

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

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cargarRecompensas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await verRecompensas();
      setRecompensas(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cargarInsignias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerInsignias();
      setInsignias(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Crear / editar / eliminar

  // ACTIVIDAD
  const agregarActividad = async (actividadData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await crearActividad(actividadData);
      await cargarActividades();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const modificarActividad = async (id, actividadData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await actualizarActividad(id, actividadData);
      await cargarActividades();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const borrarActividad = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eliminarActividad(id);
      await cargarActividades();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // MISION
  const crearNuevaMision = async (misionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await crearMision(misionData);
      await cargarMisiones();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const editarMisionPorId = async (id, misionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await editarMision(id, misionData);
      await cargarMisiones();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const eliminarMisionPorId = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eliminarMision(id);
      await cargarMisiones();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // USUARIO (sin foto)
  const crearAdminUsuario = async (adminData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await crearUsuarioAdministrador(adminData);
      await cargarUsuarios();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const editarUsuario = async (id, usuarioData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await actualizarUsuarioAdmin(id, usuarioData);
      await cargarUsuarios();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const eliminarUsuarioPorId = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eliminarUsuario(id);
      await cargarUsuarios();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // RECOMPENSA
  const crearNuevaRecompensa = async (recompensaData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await crearRecompensa(recompensaData);
      await cargarRecompensas();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const editarRecompensaPorId = async (id, recompensaData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await actualizarRecompensa(id, recompensaData);
      await cargarRecompensas();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const eliminarRecompensaPorId = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eliminarRecompensa(id);
      await cargarRecompensas();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // INSIGNIA (con foto y FormData)
  const crearNuevaInsignia = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await crearInsignia(formData);
      await cargarInsignias();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const editarInsigniaPorId = async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await actualizarInsignia(id, formData);
      await cargarInsignias();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const eliminarInsigniaPorId = async (id_insignia) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eliminarInsignia(id_insignia);
      await cargarInsignias();
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
    misiones,
    usuarios,
    recompensas,
    insignias,

    cargarActividades,
    agregarActividad,
    modificarActividad,
    borrarActividad,

    cargarMisiones,
    crearNuevaMision,
    editarMisionPorId,
    eliminarMisionPorId,

    cargarUsuarios,
    crearAdminUsuario,
    editarUsuario,
    eliminarUsuarioPorId,

    cargarRecompensas,
    crearNuevaRecompensa,
    editarRecompensaPorId,
    eliminarRecompensaPorId,

    cargarInsignias,
    crearNuevaInsignia,
    editarInsigniaPorId,
    eliminarInsigniaPorId,
  };
};
