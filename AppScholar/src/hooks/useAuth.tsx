// src/hooks/useAuth.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. CORREÇÃO: Adicionada a propriedade 'role' na tipagem do usuário
interface User {
  email: string;
  nome: string;
  role: 'aluno' | 'professor' | 'admin'; 
}

// Tipagem das funções que o contexto vai exportar
interface AuthContextData {
  signed: boolean;
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider que vai envolver o nosso App
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Função simulada de login (Na Parte 2, aqui entrará a chamada real para a API)
  const login = async (email: string, senha: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let simulatedRole: 'aluno' | 'professor' | 'admin' = 'aluno'; 
        let simulatedName = 'Aluno Matriculado';

        // Regra de definição de acesso:
        if (email.toLowerCase().includes('admin')) {
          simulatedRole = 'admin';
          simulatedName = 'Administrador do Sistema';
        } else if (email.toLowerCase().includes('prof')) {
          simulatedRole = 'professor';
          simulatedName = 'Professor Titular';
        }

        setUser({
          email: email,
          nome: simulatedName,
          role: simulatedRole
        });
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nos componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};