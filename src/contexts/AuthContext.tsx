'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const register = (name: string, email: string, password: string): boolean => {
    try {
      // Verificar se já existe usuário com este email
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.find((u: any) => u.email === email);

      if (userExists) {
        return false;
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Em produção, use hash!
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Fazer login automático
      const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  const login = (email: string, password: string): boolean => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        const userWithoutPassword = { id: user.id, name: user.name, email: user.email };
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
