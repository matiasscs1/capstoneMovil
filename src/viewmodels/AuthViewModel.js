import { useState } from 'react';
import { loginUser, verify2FACode } from '../models/usuario.model.js';

export const useAuthViewModel = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      return await loginUser(correo, contrasenia);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (correoInput) => {
    setLoading(true);
    try {
      return await verify2FACode(correoInput, codigo);
    } finally {
      setLoading(false);
    }
  };

  return {
    correo,
    setCorreo,
    contrasenia,
    setContrasenia,
    codigo,
    setCodigo,
    login,
    verify,
    loading,
  };
};
