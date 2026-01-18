import { toast } from 'react-hot-toast';

export interface SmartReminder {
  id: string;
  userId: string;
  type: 'pill' | 'cycle' | 'mood' | 'wellness';
  scheduledTime: Date;
  message: string;
  emoji: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: ReminderAction[];
  isRecurring: boolean;
  completed: boolean;
}

export interface ReminderAction {
  id: string;
  label: string;
  type: 'complete' | 'snooze' | 'skip';
  value?: any;
}

export interface UserProfile {
  id: string;
  pillTimes: string[];
  timeZone: string;
  sleepSchedule: {
    bedtime: string;
    wakeup: string;
  };
  preferences: {
    reminderStyle: 'gentle' | 'persistent' | 'urgent';
    snoozeInterval: number;
    maxSnoozes: number;
  };
}

export class SmartNotificationService {
  private static instance: SmartNotificationService;
  private reminders: Map<string, SmartReminder> = new Map();
  private notificationQueue: SmartReminder[] = [];

  static getInstance(): SmartNotificationService {
    if (!SmartNotificationService.instance) {
      SmartNotificationService.instance = new SmartNotificationService();
    }
    return SmartNotificationService.instance;
  }

  // AI-powered optimal reminder timing
  static async calculateOptimalReminderTime(userProfile: UserProfile): Promise<Date> {
    const now = new Date();
    
    // Analyze user's historical engagement patterns
    const historicalData = await this.getUserEngagementData(userProfile.id);
    
    // AI algorithm to find best time based on:
    // 1. User's sleep schedule
    // 2. Historical pill-taking patterns
    // 3. Phone usage patterns
    // 4. Adherence success rates by time
    
    const optimalHour = this.calculateOptimalHour(historicalData, userProfile);
    const optimalDate = new Date(now);
    optimalDate.setHours(optimalHour, 0, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (optimalDate < now) {
      optimalDate.setDate(optimalDate.getDate() + 1);
    }
    
    return optimalDate;
  }

  static async scheduleSmartReminders(userProfile: UserProfile): Promise<void> {
    const service = this.getInstance();
    
    // Calculate optimal timing
    const optimalTime = await this.calculateOptimalReminderTime(userProfile);
    
    // Create progressive reminder sequence
    const reminders: SmartReminder[] = [
      {
        id: `pill-gentle-${Date.now()}`,
        userId: userProfile.id,
        type: 'pill',
        scheduledTime: optimalTime,
        message: 'Time for your daily wellness moment! 🌸',
        emoji: '🌸',
        priority: 'medium',
        actions: [
          { id: 'take', label: 'Take Pill', type: 'complete' },
          { id: 'snooze', label: 'Snooze 15min', type: 'snooze', value: 15 },
          { id: 'skip', label: 'Skip Today', type: 'skip' }
        ],
        isRecurring: true,
        completed: false
      },
      {
        id: `pill-reminder-${Date.now() + 1}`,
        userId: userProfile.id,
        type: 'pill',
        scheduledTime: new Date(optimalTime.getTime() + 15 * 60 * 1000), // 15 min later
        message: 'Gentle reminder: Your capybara friend is waiting! 🦫💕',
        emoji: '🦫',
        priority: 'high',
        actions: [
          { id: 'take', label: 'Take Now', type: 'complete' },
          { id: 'snooze', label: 'Snooze 10min', type: 'snooze', value: 10 },
          { id: 'skip', label: 'Mark as Missed', type: 'skip' }
        ],
        isRecurring: false,
        completed: false
      }
    ];

    // Schedule reminders
    for (const reminder of reminders) {
      await service.scheduleReminder(reminder);
    }
  }

  static async sendCycleInsights(cycleData: any): Promise<any> {
    // AI-powered cycle analysis
    const insights = await this.analyzeCyclePatterns(cycleData);
    
    return {
      prediction: insights.nextPeriod 
        ? `Your period is likely to start in ${insights.daysUntilPeriod} days 🌸`
        : 'Analyzing your cycle patterns... 📊',
      
      recommendations: [
        'Stock up on supplies 🩹',
        'Plan lighter workouts 🧘‍♀️',
        'Prepare comfort foods 🍫',
        'Schedule self-care time 💆‍♀️'
      ],
      
      moodTips: this.generateMoodTips(insights.phase),
      
      symptoms: insights.predictedSymptoms,
      
      confidence: insights.confidence
    };
  }

  private async scheduleReminder(reminder: SmartReminder): Promise<void> {
    this.reminders.set(reminder.id, reminder);
    
    // Schedule browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const delay = reminder.scheduledTime.getTime() - Date.now();
      
      if (delay > 0) {
        setTimeout(() => {
          this.showCuteNotification(reminder);
        }, delay);
      }
    }
    
    // Add to notification queue for immediate display if time has passed
    if (reminder.scheduledTime <= new Date()) {
      this.notificationQueue.push(reminder);
      this.processNotificationQueue();
    }
  }

  private showCuteNotification(reminder: SmartReminder): void {
    // Browser notification
    const notification = new Notification(`${reminder.emoji} LoveYou`, {
      body: reminder.message,
      icon: '/flowercapybara.png',
      tag: reminder.id,
      requireInteraction: reminder.priority === 'urgent'
    });

    // Handle notification actions
    notification.onclick = () => {
      this.handleReminderAction(reminder.id, 'complete');
      notification.close();
    };

    // Show cute toast notification
    toast.custom(() => (
      `${reminder.emoji} ${reminder.message}`
    ), {
      duration: reminder.priority === 'urgent' ? 60000 : 30000,
      id: reminder.id,
      position: 'top-right'
    });
  }

  private async handleReminderAction(reminderId: string, actionType: string, value?: any): Promise<void> {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return;

    switch (actionType) {
      case 'complete':
        reminder.completed = true;
        await this.logPillTaken(reminder.userId);
        toast.success('🎉 Pill taken! You\'re amazing!', { duration: 5000 });
        break;
        
      case 'snooze':
        const snoozeMinutes = value || 15;
        const newTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);
        await this.scheduleReminder({
          ...reminder,
          id: `${reminder.id}-snooze-${Date.now()}`,
          scheduledTime: newTime,
          message: `Snooze time is up! ${reminder.emoji}`,
          priority: 'high'
        });
        toast(`⏰ Snoozed for ${snoozeMinutes} minutes`, { duration: 3000 });
        break;
        
      case 'skip':
        reminder.completed = true;
        await this.logPillSkipped(reminder.userId);
        toast('📝 Marked as skipped. Tomorrow is a new day! 💕', { duration: 5000 });
        break;
    }

    this.reminders.set(reminderId, reminder);
  }

  private processNotificationQueue(): void {
    while (this.notificationQueue.length > 0) {
      const reminder = this.notificationQueue.shift();
      if (reminder && !reminder.completed) {
        this.showCuteNotification(reminder);
      }
    }
  }

  private static async getUserEngagementData(_userId: string): Promise<{
    averagePillTime: string;
    bestAdherenceTimes: string[];
    phoneUsagePatterns: string[];
    adherenceByHour: Record<string, number>;
  }> {
    // Simulate API call to get user engagement patterns
    return {
      averagePillTime: '09:00',
      bestAdherenceTimes: ['08:30', '09:00', '09:30'],
      phoneUsagePatterns: ['07:00-09:00', '18:00-21:00'],
      adherenceByHour: {
        '08': 0.95,
        '09': 0.98,
        '10': 0.92,
        '11': 0.85
      }
    };
  }

  private static calculateOptimalHour(
    historicalData: { bestAdherenceTimes: string[] }, 
    userProfile: UserProfile
  ): number {
    // AI algorithm to calculate best hour
    const wakeupHour = parseInt(userProfile.sleepSchedule.wakeup.split(':')[0]);
    const bestHours = historicalData.bestAdherenceTimes.map((time: string) => parseInt(time.split(':')[0]));
    
    // Find optimal hour (simplified algorithm)
    const optimalHour = Math.round(
      bestHours.reduce((sum: number, hour: number) => sum + hour, 0) / bestHours.length
    );
    
    // Ensure it's after wake-up time
    return Math.max(optimalHour, wakeupHour + 1);
  }

  private static async analyzeCyclePatterns(cycleData: any): Promise<any> {
    // AI cycle analysis (simplified)
    const averageCycleLength = 28; // This would be calculated from user data
    const lastPeriodDate = new Date(cycleData.lastPeriod);
    const daysSinceLastPeriod = Math.floor((Date.now() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilPeriod = averageCycleLength - daysSinceLastPeriod;
    
    return {
      nextPeriod: daysUntilPeriod > 0,
      daysUntilPeriod: Math.max(0, daysUntilPeriod),
      phase: this.getCurrentPhase(daysSinceLastPeriod),
      confidence: 0.85,
      predictedSymptoms: this.predictSymptoms(daysSinceLastPeriod)
    };
  }

  private static getCurrentPhase(daysSinceLastPeriod: number): string {
    if (daysSinceLastPeriod <= 5) return 'menstrual';
    if (daysSinceLastPeriod <= 13) return 'follicular';
    if (daysSinceLastPeriod <= 17) return 'ovulation';
    return 'luteal';
  }

  private static generateMoodTips(phase: string): string {
    const tips = {
      menstrual: 'Try gentle yoga and herbal tea for comfort 🧘‍♀️🍵',
      follicular: 'Great time for new activities and exercise! 💪✨',
      ovulation: 'You might feel extra social and energetic! 🌟💃',
      luteal: 'Focus on self-care and stress management 🛁🕯️'
    };
    
    return tips[phase as keyof typeof tips] || 'Listen to your body and be kind to yourself 💕';
  }

  private static predictSymptoms(daysSinceLastPeriod: number): string[] {
    if (daysSinceLastPeriod > 21) {
      return ['Mild cramping possible', 'Mood changes', 'Breast tenderness', 'Fatigue'];
    }
    return [];
  }

  private async logPillTaken(userId: string): Promise<void> {
    // API call to log pill taken
    console.log(`Logging pill taken for user ${userId}`);
  }

  private async logPillSkipped(userId: string): Promise<void> {
    // API call to log pill skipped
    console.log(`Logging pill skipped for user ${userId}`);
  }
}

export default SmartNotificationService;
