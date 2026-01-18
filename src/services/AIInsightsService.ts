// AI-powered insights and recommendations service
export interface UserData {
  pillIntake: {
    consistency: number; // 0-100
    missedDoses: number;
    totalDays: number;
    recentPattern: string[];
  };
  menstrualCycle: {
    cycleLength: number;
    regularityScore: number; // 0-100
    symptoms: string[];
    lastPeriod: Date;
  };
  lifestyle: {
    sleepHours: number;
    stressLevel: number; // 1-10
    exerciseFrequency: number; // days per week
    waterIntake: number; // glasses per day
  };
  goals: string[];
  preferences: {
    reminderTimes: string[];
    notificationStyle: 'gentle' | 'standard' | 'persistent';
  };
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'celebration' | 'tip';
  title: string;
  message: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'pill' | 'cycle' | 'lifestyle' | 'wellness' | 'general';
  actionable: boolean;
  actions?: Array<{
    label: string;
    action: string;
    type: 'button' | 'link' | 'reminder';
  }>;
  icon: string;
  color: string;
  timestamp: Date;
  expiresAt?: Date;
}

export class AIInsightsService {
  private static instance: AIInsightsService;
  
  public static getInstance(): AIInsightsService {
    if (!AIInsightsService.instance) {
      AIInsightsService.instance = new AIInsightsService();
    }
    return AIInsightsService.instance;
  }

  // Generate personalized insights based on user data
  public generateInsights(userData: UserData): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Pill adherence insights
    insights.push(...this.analyzePillAdherence(userData));
    
    // Cycle predictions and insights
    insights.push(...this.analyzeMenstrualCycle(userData));
    
    // Lifestyle recommendations
    insights.push(...this.analyzeLifestyle(userData));
    
    // Wellness tips
    insights.push(...this.generateWellnessTips(userData));
    
    // Sort by priority and confidence
    return insights.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  }

  private analyzePillAdherence(userData: UserData): AIInsight[] {
    const insights: AIInsight[] = [];
    const { pillIntake } = userData;

    // High adherence celebration
    if (pillIntake.consistency >= 95) {
      insights.push({
        id: `adherence_excellent_${Date.now()}`,
        type: 'celebration',
        title: '🌟 Incredible Consistency!',
        message: `You've maintained ${pillIntake.consistency}% pill consistency! Your commitment to your health is inspiring.`,
        confidence: 100,
        priority: 'medium',
        category: 'pill',
        actionable: false,
        icon: '🏆',
        color: 'text-green-600',
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    }

    // Consistency improvement needed
    if (pillIntake.consistency < 80) {
      const missedDosesText = pillIntake.missedDoses === 1 ? 'dose' : 'doses';
      insights.push({
        id: `adherence_improvement_${Date.now()}`,
        type: 'recommendation',
        title: '💊 Let\'s Improve Your Routine',
        message: `You've missed ${pillIntake.missedDoses} ${missedDosesText} recently. Small tweaks to your routine can make a big difference!`,
        confidence: 85,
        priority: 'high',
        category: 'pill',
        actionable: true,
        actions: [
          {
            label: 'Set Smart Reminders',
            action: 'setup_reminders',
            type: 'button'
          },
          {
            label: 'View Tips',
            action: 'adherence_tips',
            type: 'link'
          }
        ],
        icon: '⏰',
        color: 'text-pink-600',
        timestamp: new Date()
      });
    }

    // Pattern-based insights
    const recentPattern = pillIntake.recentPattern;
    if (recentPattern.length >= 7) {
      const weekendMisses = recentPattern.slice(-7).filter((day, index) => 
        (index === 5 || index === 6) && day === 'missed'
      ).length;
      
      if (weekendMisses >= 2) {
        insights.push({
          id: `weekend_pattern_${Date.now()}`,
          type: 'tip',
          title: '📅 Weekend Reminder Strategy',
          message: 'I notice you tend to miss pills on weekends. Try setting a phone alarm or using a different reminder strategy for your days off!',
          confidence: 78,
          priority: 'medium',
          category: 'pill',
          actionable: true,
          actions: [
            {
              label: 'Setup Weekend Alerts',
              action: 'weekend_reminders',
              type: 'button'
            }
          ],
          icon: '🏖️',
          color: 'text-blue-600',
          timestamp: new Date()
        });
      }
    }

    return insights;
  }

  private analyzeMenstrualCycle(userData: UserData): AIInsight[] {
    const insights: AIInsight[] = [];
    const { menstrualCycle } = userData;

    // Cycle regularity insights
    if (menstrualCycle.regularityScore >= 85) {
      insights.push({
        id: `cycle_regular_${Date.now()}`,
        type: 'celebration',
        title: '🌸 Your Cycle is Beautifully Regular',
        message: `Your ${menstrualCycle.cycleLength}-day cycle shows excellent regularity! This is a great sign of hormonal balance.`,
        confidence: 90,
        priority: 'low',
        category: 'cycle',
        actionable: false,
        icon: '🌺',
        color: 'text-pink-500',
        timestamp: new Date()
      });
    }

    // Upcoming period prediction
    const daysSinceLastPeriod = Math.floor(
      (Date.now() - menstrualCycle.lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysUntilNext = menstrualCycle.cycleLength - daysSinceLastPeriod;

    if (daysUntilNext <= 3 && daysUntilNext > 0) {
      insights.push({
        id: `period_prediction_${Date.now()}`,
        type: 'tip',
        title: '🗓️ Period Approaching',
        message: `Your period is likely to start in ${daysUntilNext} day${daysUntilNext > 1 ? 's' : ''}. Time to prepare with self-care essentials!`,
        confidence: 82,
        priority: 'medium',
        category: 'cycle',
        actionable: true,
        actions: [
          {
            label: 'View Self-Care Tips',
            action: 'period_prep',
            type: 'link'
          },
          {
            label: 'Set Comfort Reminders',
            action: 'comfort_reminders',
            type: 'button'
          }
        ],
        icon: '🌙',
        color: 'text-purple-600',
        timestamp: new Date()
      });
    }

    // Symptom patterns
    if (menstrualCycle.symptoms.includes('cramps') && menstrualCycle.symptoms.includes('mood_changes')) {
      insights.push({
        id: `symptom_management_${Date.now()}`,
        type: 'recommendation',
        title: '💆‍♀️ Holistic Comfort Approach',
        message: 'Since you experience both cramps and mood changes, try combining gentle exercise with relaxation techniques for better management.',
        confidence: 75,
        priority: 'medium',
        category: 'wellness',
        actionable: true,
        actions: [
          {
            label: 'Browse Exercises',
            action: 'gentle_exercises',
            type: 'link'
          },
          {
            label: 'Meditation Guide',
            action: 'meditation_guide',
            type: 'link'
          }
        ],
        icon: '🧘‍♀️',
        color: 'text-indigo-600',
        timestamp: new Date()
      });
    }

    return insights;
  }

  private analyzeLifestyle(userData: UserData): AIInsight[] {
    const insights: AIInsight[] = [];
    const { lifestyle } = userData;

    // Sleep analysis
    if (lifestyle.sleepHours < 7) {
      insights.push({
        id: `sleep_improvement_${Date.now()}`,
        type: 'recommendation',
        title: '😴 Sweet Dreams Matter',
        message: `Getting ${lifestyle.sleepHours} hours might be affecting your hormone balance. Aim for 7-9 hours for optimal wellness!`,
        confidence: 88,
        priority: 'high',
        category: 'lifestyle',
        actionable: true,
        actions: [
          {
            label: 'Sleep Tips',
            action: 'sleep_hygiene',
            type: 'link'
          },
          {
            label: 'Bedtime Reminder',
            action: 'bedtime_reminder',
            type: 'button'
          }
        ],
        icon: '🌙',
        color: 'text-indigo-600',
        timestamp: new Date()
      });
    }

    // Stress management
    if (lifestyle.stressLevel >= 7) {
      insights.push({
        id: `stress_management_${Date.now()}`,
        type: 'recommendation',
        title: '🌿 Time for Some Self-Care',
        message: 'High stress levels can impact your cycle and overall well-being. Let\'s explore some gentle stress-relief techniques!',
        confidence: 85,
        priority: 'high',
        category: 'wellness',
        actionable: true,
        actions: [
          {
            label: 'Breathing Exercises',
            action: 'breathing_exercises',
            type: 'link'
          },
          {
            label: 'Stress Relief Plan',
            action: 'stress_plan',
            type: 'button'
          }
        ],
        icon: '🌱',
        color: 'text-green-600',
        timestamp: new Date()
      });
    }

    // Hydration insights
    if (lifestyle.waterIntake < 6) {
      insights.push({
        id: `hydration_tip_${Date.now()}`,
        type: 'tip',
        title: '💧 Hydration Station',
        message: `You're drinking ${lifestyle.waterIntake} glasses of water daily. Boosting to 8+ glasses can help with energy and skin health!`,
        confidence: 70,
        priority: 'low',
        category: 'lifestyle',
        actionable: true,
        actions: [
          {
            label: 'Water Reminders',
            action: 'water_reminders',
            type: 'button'
          }
        ],
        icon: '💦',
        color: 'text-blue-500',
        timestamp: new Date()
      });
    }

    // Exercise encouragement
    if (lifestyle.exerciseFrequency < 2) {
      insights.push({
        id: `exercise_motivation_${Date.now()}`,
        type: 'recommendation',
        title: '🏃‍♀️ Movement is Medicine',
        message: 'Even gentle movement 2-3 times a week can help regulate hormones and boost mood. Start small and build up!',
        confidence: 80,
        priority: 'medium',
        category: 'lifestyle',
        actionable: true,
        actions: [
          {
            label: 'Beginner Workouts',
            action: 'beginner_workouts',
            type: 'link'
          },
          {
            label: 'Set Exercise Goals',
            action: 'exercise_goals',
            type: 'button'
          }
        ],
        icon: '💪',
        color: 'text-orange-600',
        timestamp: new Date()
      });
    }

    return insights;
  }

  private generateWellnessTips(_userData: UserData): AIInsight[] {
    const tips: AIInsight[] = [];
    
    // Daily wellness tip rotation
    const dailyTips = [
      {
        title: '🌸 Mindful Moment',
        message: 'Take 3 deep breaths and notice something beautiful around you. Your mental health matters!',
        icon: '🧘‍♀️',
        color: 'text-pink-500'
      },
      {
        title: '🥗 Nourish Your Body',
        message: 'Include iron-rich foods like spinach and lentils in your diet to support your energy levels.',
        icon: '🌿',
        color: 'text-green-500'
      },
      {
        title: '💆‍♀️ Self-Care Sunday',
        message: 'Schedule some \'me time\' this week. Even 15 minutes of self-care can make a difference!',
        icon: '✨',
        color: 'text-purple-500'
      },
      {
        title: '📱 Digital Detox',
        message: 'Try putting your phone in another room 1 hour before bedtime for better sleep quality.',
        icon: '🌙',
        color: 'text-indigo-500'
      }
    ];

    const today = new Date().getDay();
    const todaysTip = dailyTips[today % dailyTips.length];

    tips.push({
      id: `daily_tip_${today}`,
      type: 'tip',
      title: todaysTip.title,
      message: todaysTip.message,
      confidence: 60,
      priority: 'low',
      category: 'wellness',
      actionable: false,
      icon: todaysTip.icon,
      color: todaysTip.color,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    return tips;
  }

  // Get sample user data for demonstration
  public getSampleUserData(): UserData {
    return {
      pillIntake: {
        consistency: 87,
        missedDoses: 3,
        totalDays: 30,
        recentPattern: ['taken', 'taken', 'missed', 'taken', 'taken', 'missed', 'taken']
      },
      menstrualCycle: {
        cycleLength: 28,
        regularityScore: 89,
        symptoms: ['cramps', 'mood_changes', 'bloating'],
        lastPeriod: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) // 22 days ago
      },
      lifestyle: {
        sleepHours: 6.5,
        stressLevel: 7,
        exerciseFrequency: 1,
        waterIntake: 5
      },
      goals: ['better_consistency', 'stress_management', 'regular_exercise'],
      preferences: {
        reminderTimes: ['08:00', '20:00'],
        notificationStyle: 'gentle'
      }
    };
  }
}
