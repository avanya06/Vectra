import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check for token in URL (Google Auth Redirect)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      
      let token = localStorage.getItem('token');

      if (urlToken) {
        token = urlToken;
        localStorage.setItem('token', token);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const storedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          // If we have a token but no user (or we just got a new token), fetch profile
          if (!storedUser || urlToken) {
             const response = await api.auth.getProfile();
             const user = response.data;
             localStorage.setItem('user', JSON.stringify(user));
             setUser(user);
          } else {
             setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const refreshUser = async () => {
    const response = await api.auth.getProfile();
    localStorage.setItem('user', JSON.stringify(response.data));
    setUser(response.data);
  };

  const login = async (credentials: any) => {
    try {
      const response = await api.auth.login(credentials);
      const { token, user } = response.data; // Adjust based on actual backend response structure
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await api.auth.register(data);
      // Depending on flow, might auto-login or require separate login
      // Assuming auto-login for now if backend returns token
      if (response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      refreshUser,
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
