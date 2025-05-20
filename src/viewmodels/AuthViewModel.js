import { useState } from 'react';
import {
  loginUser,
  verify2FACode,
  registerTemp,
  verificarCorreo,
} from '../models/usuario.model.js';

export const useAuthViewModel = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const registrarTemporal = async (formData) => {
    setLoading(true);
    try {
      const data = await registerTemp(formData);
      setModalVisible(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verificarCodigoRegistro = async () => {
    setLoading(true);
    try {

      const data = await verificarCorreo(correo, codigo);
      setModalVisible(false);
      return data;
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
    modalVisible,
    setModalVisible,
    registrarTemporal,
    verificarCodigoRegistro,
  };
};
