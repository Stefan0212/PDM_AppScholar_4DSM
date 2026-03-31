// src/services/api.ts
import axios from 'axios';

/* Configuração Base da API
  Quando o seu backend Node.js estiver pronto, você alterará a baseURL.
  Dica: Se testar no Expo Go pelo celular físico, use o IP da sua rede (ex: http://192.168.1.10:3000)
  Se usar Emulador Android, use http://10.0.2.2:3000
*/
export const api = axios.create({
  baseURL: 'http://localhost:3000', 
  timeout: 10000, // Cancela a requisição se demorar mais de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de Requisição (Preparando terreno para autenticação JWT)
api.interceptors.request.use(
  async (config) => {
    // Na Parte 2: Lógica para buscar o token no AsyncStorage (armazenamento local)
    // const token = await AsyncStorage.getItem('@AppScholar:token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Tratamento global de erros, como token expirado)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Não autorizado. O usuário precisa fazer login novamente.');
      // Lógica de deslogar usuário aqui futuramente
    }
    return Promise.reject(error);
  }
);