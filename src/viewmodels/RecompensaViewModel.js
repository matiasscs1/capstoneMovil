import { useState } from 'react';
import {
    canjearRecompensa,
    obtenerRecompensasUsuario,
    verCanjesUsuarios,
} from '../models/recompensas.model.js';

export const useRecompensaViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recompensas, setRecompensas] = useState([]);
    const [canjes, setCanjes] = useState([]);

    // Cargar recompensas del usuario
    const cargarRecompensas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerRecompensasUsuario();
            setRecompensas(data.recompensas || []); return data;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    // Canjear una recompensa
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

    // Ver canjes del usuario
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

    return {
        loading,
        error,
        recompensas,
        canjes,
        cargarRecompensas,
        canjear,
        cargarCanjes,
    };
}