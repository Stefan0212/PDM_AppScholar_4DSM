import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@AppScholar:user');
      const storageToken = await AsyncStorage.getItem('@AppScholar:token');

      if (storageUser && storageToken) {
        // api.defaults.headers.Authorization is handled by interceptor, but we set user here
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token } = response.data;

      setUser(usuario);
      
      await AsyncStorage.setItem('@AppScholar:user', JSON.stringify(usuario));
      await AsyncStorage.setItem('@AppScholar:token', token);
      
      return { success: true };
    } catch (error) {
      console.error('Erro de login:', error);
      return { success: false, message: error.response?.data?.error || 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
