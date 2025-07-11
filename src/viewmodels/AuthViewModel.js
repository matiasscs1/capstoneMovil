import { useState } from 'react';
import {
  loginAdmin,
  loginUser,
  verify2FACode,
  registerTemp,
  verificarCorreo,
  recuperarCodigoAdmin,
  solicitarCambioContrasenia,
  cambiarContrasenia,
} from '../models/auth.model.js';

export const useAuthViewModel = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoAdmin, setCodigoAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // ===== NUEVOS ESTADOS PARA RECUPERACIÓN DE CONTRASEÑA =====
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [codigoRecuperacion, setCodigoRecuperacion] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [modalRecuperacionVisible, setModalRecuperacionVisible] = useState(false);

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

  // ===== NUEVAS FUNCIONES PARA RECUPERACIÓN DE CONTRASEÑA =====
  
  const solicitarRecuperacionContrasenia = async () => {
    setLoading(true);
    try {
      const data = await solicitarCambioContrasenia(correoRecuperacion);
      setModalRecuperacionVisible(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const cambiarContraseniaRecuperacion = async () => {
    setLoading(true);
    try {
      const data = await cambiarContrasenia(correoRecuperacion, codigoRecuperacion, nuevaContrasenia);
      setModalRecuperacionVisible(false);
      // Limpiar los campos después de cambiar la contraseña
      setCorreoRecuperacion('');
      setCodigoRecuperacion('');
      setNuevaContrasenia('');
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados existentes
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
    
    // ===== NUEVOS ESTADOS Y FUNCIONES PARA RECUPERACIÓN =====
    correoRecuperacion,
    setCorreoRecuperacion,
    codigoRecuperacion,
    setCodigoRecuperacion,
    nuevaContrasenia,
    setNuevaContrasenia,
    modalRecuperacionVisible,
    setModalRecuperacionVisible,
    solicitarRecuperacionContrasenia,
    cambiarContraseniaRecuperacion,
  };
};