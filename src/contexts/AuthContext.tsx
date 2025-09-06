import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          initials: userData.name.slice(0, 2).toUpperCase(),
        });
      } catch (error) {
        // No valid session, user will need to login
        console.log('No valid session found');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        initials: response.user.name.slice(0, 2).toUpperCase(),
      });
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await apiService.register(name, email, password);
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        initials: response.user.name.slice(0, 2).toUpperCase(),
      });
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};