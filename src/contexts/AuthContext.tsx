import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi, type User, type OnboardingData } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  completeOnboarding: (data: OnboardingData) => Promise<boolean>;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedUser = localStorage.getItem('loveyou_user');
      const token = localStorage.getItem('loveyou_token');
      
      if (savedUser && token) {
        try {
          // Verify token is still valid by fetching current user
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          localStorage.setItem('loveyou_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Session expired or invalid:', error);
          localStorage.removeItem('loveyou_user');
          localStorage.removeItem('loveyou_token');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login({ email, password });
      
      localStorage.setItem('loveyou_token', response.token);
      localStorage.setItem('loveyou_user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const apiError = error as { response?: { data?: { error?: string } } };
      return { 
        success: false, 
        error: apiError.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.register({ email, password, name });
      
      localStorage.setItem('loveyou_token', response.token);
      localStorage.setItem('loveyou_user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const apiError = error as { response?: { data?: { error?: string } } };
      return { 
        success: false, 
        error: apiError.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      localStorage.removeItem('loveyou_user');
      localStorage.removeItem('loveyou_token');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('loveyou_user', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = async (data: OnboardingData): Promise<boolean> => {
    try {
      const updatedUser = await authApi.updateProfile({ onboardingData: data });
      setUser(updatedUser);
      localStorage.setItem('loveyou_user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Onboarding error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
