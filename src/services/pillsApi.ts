import api from './api';

// Types
export interface Pill {
  id: string;
  userId: string;
  name: string;
  type: string;
  dosage?: string;
  color?: string;
  manufacturer?: string;
  instructions?: string;
  reminderTime: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  daysInCycle: number;
  activePillDays: number;
  placeboDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface PillIntake {
  id: string;
  pillId: string;
  userId: string;
  takenAt: string;
  scheduledFor: string;
  status: 'taken' | 'missed' | 'late' | 'skipped';
  notes?: string;
  sideEffects?: string[];
  mood?: number;
  createdAt: string;
}

export interface CreatePillData {
  name: string;
  type: string;
  dosage?: string;
  reminderTime: string;
  startDate: string;
  daysInCycle?: number;
  activePillDays?: number;
  placeboDays?: number;
}

export interface PillType {
  id: string;
  name: string;
  type: string;
  description?: string;
  manufacturer?: string;
}

export interface RecordIntakeData {
  pillId: string;
  takenAt?: string;
  scheduledFor: string;
  status?: 'taken' | 'missed' | 'late' | 'skipped';
  notes?: string;
  sideEffects?: string[];
  mood?: number;
}

// Pills API Functions
export const pillsApi = {
  // Get available pill types
  async getPillTypes(): Promise<PillType[]> {
    try {
      const response = await api.get<{ pillTypes: PillType[] }>('/api/pills/types');
      return response.data.pillTypes;
    } catch {
      // Return fallback pill types if API fails
      return [
        { id: '1', name: 'Diane-35', type: 'Combined Oral Contraceptive' },
        { id: '2', name: 'Althea', type: 'Combined Oral Contraceptive' },
        { id: '3', name: 'Yasmin', type: 'Combined Oral Contraceptive' },
        { id: '4', name: 'Marvelon', type: 'Combined Oral Contraceptive' },
        { id: '5', name: 'Levora', type: 'Combined Oral Contraceptive' },
        { id: '6', name: 'Microgestin', type: 'Combined Oral Contraceptive' },
      ];
    }
  },

  // Get all pills for current user
  async getPills(): Promise<Pill[]> {
    const response = await api.get<{ pills: Pill[] }>('/api/pills');
    return response.data.pills;
  },

  // Get single pill
  async getPill(id: string): Promise<Pill> {
    const response = await api.get<{ pill: Pill }>(`/api/pills/${id}`);
    return response.data.pill;
  },

  // Create new pill
  async createPill(data: CreatePillData): Promise<Pill> {
    const response = await api.post<{ pill: Pill; message: string }>('/api/pills', data);
    return response.data.pill;
  },

  // Update pill
  async updatePill(id: string, data: Partial<CreatePillData>): Promise<Pill> {
    const response = await api.put<{ pill: Pill; message: string }>(`/api/pills/${id}`, data);
    return response.data.pill;
  },

  // Delete pill
  async deletePill(id: string): Promise<void> {
    await api.delete(`/api/pills/${id}`);
  },

  // Get pill intakes
  async getIntakes(params?: { startDate?: string; endDate?: string; pillId?: string }): Promise<PillIntake[]> {
    const response = await api.get<{ intakes: PillIntake[] }>('/api/intakes', { params });
    return response.data.intakes;
  },

  // Record pill intake
  async recordIntake(data: RecordIntakeData): Promise<PillIntake> {
    const response = await api.post<{ intake: PillIntake; message: string }>('/api/intakes', data);
    return response.data.intake;
  },

  // Update intake
  async updateIntake(id: string, data: Partial<RecordIntakeData>): Promise<PillIntake> {
    const response = await api.put<{ intake: PillIntake; message: string }>(`/api/intakes/${id}`, data);
    return response.data.intake;
  },

  // Get today's intake status
  async getTodayStatus(): Promise<{ taken: boolean; scheduledTime: string; pill?: Pill }> {
    const response = await api.get<{ taken: boolean; scheduledTime: string; pill?: Pill }>('/api/intakes/today');
    return response.data;
  },

  // Get streak information
  async getStreak(): Promise<{ currentStreak: number; longestStreak: number; totalTaken: number }> {
    const response = await api.get<{ currentStreak: number; longestStreak: number; totalTaken: number }>('/api/intakes/streak');
    return response.data;
  },
};

export default pillsApi;
