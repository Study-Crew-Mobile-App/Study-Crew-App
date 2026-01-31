import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  name: string;
  email: string;
  academic_year: number;
  telegram_username?: string;
  bio?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  academic_year: number;
  telegram_username?: string;
  bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // For now, simulate successful login
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: email,
        academic_year: 2,
        role: email.includes('assistant') ? 'assistant' : 'user'
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Store auth data
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      setToken(mockToken);
      setUser(mockUser);
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // For now, simulate successful registration
      const mockUser: User = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        academic_year: userData.academic_year,
        telegram_username: userData.telegram_username,
        bio: userData.bio,
        role: userData.academic_year >= 2 ? 'assistant' : 'user'
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Store auth data
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      setToken(mockToken);
      setUser(mockUser);
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
