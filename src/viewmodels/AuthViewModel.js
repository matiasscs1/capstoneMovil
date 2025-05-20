import { useState } from 'react';
import {
  loginAdmin,
  loginUser,
  verify2FACode,
  registerTemp,
  verificarCorreo,
  recuperarCodigoAdmin,
} from '../models/auth.model.js';

export const useAuthViewModel = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoAdmin, setCodigoAdmin] = useState('');
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

  const loginUserAdmin = async () => {
    setLoading(true);
    try {
      return await loginAdmin(codigoAdmin);
    } finally {
      setLoading(false);
    }
  };

  const recuperarCodigo = async (correo) => {
    setLoading(true);
    try {
      const data = await recuperarCodigoAdmin(correo);
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
    loginUserAdmin,
    codigoAdmin,
    setCodigoAdmin,
    recuperarCodigo,
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
