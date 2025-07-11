import { useState } from 'react';
import {
    canjearRecompensa,
    obtenerRecompensasUsuario,
    verCanjesUsuarios,
    verCanjesPorUsuario, 
} from '../models/recompensas.model.js';

export const useRecompensaViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recompensas, setRecompensas] = useState([]);
    const [canjes, setCanjes] = useState([]);
    const [canjesUsuario, setCanjesUsuario] = useState([]); // Nuevo estado para canjes específicos del usuario

    const cargarRecompensas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerRecompensasUsuario();
            setRecompensas(data.recompensas || []);
            return data;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const canjear = async (recompensaId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await canjearRecompensa(recompensaId);
            await cargarRecompensas(); // Recargar recompensas después del canje
            return data;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const cargarCanjes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await verCanjesUsuarios();
            setCanjes(data);
            return data;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const cargarCanjesPorUsuario = async (usuarioId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await verCanjesPorUsuario(usuarioId);
            setCanjesUsuario(data);
            return data;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    // Limpiar canjes del usuario (función auxiliar)
    const limpiarCanjesUsuario = () => {
        setCanjesUsuario([]);
    };

    // Limpiar errores (función auxiliar)
    const limpiarError = () => {
        setError(null);
    };

    return {
        // Estados
        loading,
        error,
        recompensas,
        canjes,
        canjesUsuario, // Nuevo estado

        // Funciones
        cargarRecompensas,
        canjear,
        cargarCanjes,
        cargarCanjesPorUsuario, // Nueva función
        
        // Funciones auxiliares
        limpiarCanjesUsuario,
        limpiarError,
    };
};