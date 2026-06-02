import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Substitua localhost pelo IP da sua máquina local na rede Wi-Fi (ex: 192.168.1.100)
// O emulador Android e o Expo Go no celular físico não conseguem acessar o localhost do seu PC
const api = axios.create({
  baseURL: 'http://10.68.55.55:3000/api', 
});

// Interceptor para adicionar o Token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@AppScholar:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
