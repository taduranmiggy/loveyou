import api from './api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  pillType?: string;
  cycleLength?: number;
  role: 'admin' | 'user' | 'viewer';
  hasCompletedOnboarding: boolean;
  onboardingData?: OnboardingData;
  preferences?: UserPreferences;
  profilePicture?: string;
  dateOfBirth?: string;
  timezone?: string;
}

export interface OnboardingData {
  nickname: string;
  pillType: string;
  pillTime: string;
  cycleLength: number;
  lastPeriodDate: string;
  cycleRegularity: 'regular' | 'irregular' | 'not-sure';
  previousContraception: string;
  healthConditions: string[];
  goals: string[];
  completed?: boolean;
}

export interface UserPreferences {
  notifications?: {
    pillReminders: boolean;
    cycleUpdates: boolean;
    healthInsights: boolean;
  };
  privacy?: {
    shareData: boolean;
    publicProfile: boolean;
  };
  ui?: {
    theme: string;
    animations: boolean;
  };
  onboarding?: OnboardingData;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Auth API Functions
export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn('Logout API call failed, clearing local data anyway');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/api/auth/me');
    return response.data.user;
  },

  // Update profile
  async updateProfile(data: Partial<User> & { onboardingData?: OnboardingData }): Promise<User> {
    const response = await api.put<{ user: User; message: string }>('/api/auth/me', data);
    return response.data.user;
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/api/auth/change-password', { currentPassword, newPassword });
  },
};

export default authApi;
