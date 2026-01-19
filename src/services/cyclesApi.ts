import api from './api';

// Types
export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  length?: number;
  periodLength?: number;
  ovulationDate?: string;
  notes?: string;
  symptoms?: string[];
  mood?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CycleDay {
  id: string;
  cycleId: string;
  date: string;
  dayNumber: number;
  flow?: 'light' | 'medium' | 'heavy' | 'spotting' | 'none';
  symptoms?: string[];
  mood?: number;
  notes?: string;
  temperature?: number;
  cervicalMucus?: string;
  createdAt: string;
}

export interface CreateCycleData {
  startDate: string;
  notes?: string;
}

export interface LogCycleDayData {
  cycleId: string;
  date: string;
  flow?: 'light' | 'medium' | 'heavy' | 'spotting' | 'none';
  symptoms?: string[];
  mood?: number;
  notes?: string;
  temperature?: number;
  cervicalMucus?: string;
}

export interface CyclePrediction {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  averageCycleLength: number;
  averagePeriodLength: number;
}

// Cycles API Functions
export const cyclesApi = {
  // Get all cycles
  async getCycles(): Promise<Cycle[]> {
    const response = await api.get<{ cycles: Cycle[] }>('/api/cycles');
    return response.data.cycles;
  },

  // Get current/active cycle
  async getCurrentCycle(): Promise<Cycle | null> {
    const response = await api.get<{ cycle: Cycle | null }>('/api/cycles/current');
    return response.data.cycle;
  },

  // Get single cycle with days
  async getCycle(id: string): Promise<{ cycle: Cycle; days: CycleDay[] }> {
    const response = await api.get<{ cycle: Cycle; days: CycleDay[] }>(`/api/cycles/${id}`);
    return response.data;
  },

  // Start new cycle
  async startCycle(data: CreateCycleData): Promise<Cycle> {
    const response = await api.post<{ cycle: Cycle; message: string }>('/api/cycles', data);
    return response.data.cycle;
  },

  // End current cycle
  async endCycle(id: string, endDate: string): Promise<Cycle> {
    const response = await api.put<{ cycle: Cycle; message: string }>(`/api/cycles/${id}/end`, { endDate });
    return response.data.cycle;
  },

  // Log cycle day
  async logCycleDay(data: LogCycleDayData): Promise<CycleDay> {
    const response = await api.post<{ day: CycleDay; message: string }>('/api/cycles/days', data);
    return response.data.day;
  },

  // Get cycle predictions
  async getPredictions(): Promise<CyclePrediction> {
    const response = await api.get<CyclePrediction>('/api/cycles/predictions');
    return response.data;
  },

  // Get calendar data for date range
  async getCalendarData(startDate: string, endDate: string): Promise<{
    cycles: Cycle[];
    days: CycleDay[];
    intakes: unknown[];
  }> {
    const response = await api.get('/api/cycles/calendar', {
      params: { startDate, endDate }
    });
    return response.data;
  },
};

export default cyclesApi;
