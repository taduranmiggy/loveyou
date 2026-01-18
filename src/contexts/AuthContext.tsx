import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  hasCompletedOnboarding: boolean;
  onboardingData?: {
    nickname: string;
    pillType: string;
    pillTime: string;
    cycleLength: number;
    lastPeriodDate: string;
    cycleRegularity: 'regular' | 'irregular' | 'not-sure';
    previousContraception: string;
    healthConditions: string[];
    goals: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('loveyou_user');
      const token = localStorage.getItem('loveyou_token');
      
      if (savedUser && token) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('loveyou_user');
          localStorage.removeItem('loveyou_token');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        hasCompletedOnboarding: false
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('loveyou_user', JSON.stringify(mockUser));
      localStorage.setItem('loveyou_token', mockToken);
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration - new users need onboarding
      const mockUser: User = {
        id: '1',
        email,
        name,
        hasCompletedOnboarding: false // Always false for new registrations
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('loveyou_user', JSON.stringify(mockUser));
      localStorage.setItem('loveyou_token', mockToken);
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('loveyou_user');
    localStorage.removeItem('loveyou_token');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('loveyou_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
