import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Pill, 
  Heart, 
  Brain, 
  TrendingUp, 
  Target,
  Clock,
  Award,
  Sparkles,
  Moon,
  Sun,
  Droplets,
  Activity,
  Lock,
  Trophy,
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';
import { AIInsightsService } from '../../services/AIInsightsService';

interface WidgetProps {
  className?: string;
}

interface AdherenceData {
  weekly: number;
  monthly: number;
  streak: number;
  lastTaken: string;
}

interface CycleData {
  currentDay: number;
  phase: 'follicular' | 'ovulation' | 'luteal' | 'menstrual';
  nextPeriod: string;
  fertility: 'low' | 'medium' | 'high';
}

interface MoodData {
  current: string;
  trend: 'improving' | 'stable' | 'declining';
  weeklyAverage: number;
}

// Adherence Tracker Widget
export const AdherenceWidget: React.FC<WidgetProps> = ({ className }) => {
  const [adherenceData] = useState<AdherenceData>({
    weekly: 95,
    monthly: 92,
    streak: 14,
    lastTaken: '2 hours ago'
  });

  const getAdherenceEmoji = (percentage: number) => {
    if (percentage >= 95) return '✨';
    if (percentage >= 90) return '💖';
    if (percentage >= 85) return '💕';
    return '💪';
  };

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 30) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (streak >= 14) return 'bg-gradient-to-r from-pink-500 to-rose-500';
    if (streak >= 7) return 'bg-gradient-to-r from-rose-400 to-pink-400';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-3xl p-6 shadow-xl shadow-pink-100/50 border border-pink-100/50 backdrop-blur-sm ${className}`}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.25)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg">
            <Pill className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Pill Adherence</h3>
            <p className="text-xs text-gray-500">Your consistency tracker</p>
          </div>
        </div>
        <motion.span 
          className="text-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3 
          }}
        >
          {getAdherenceEmoji(adherenceData.weekly)}
        </motion.span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">This Week</span>
          <div className="flex items-center gap-3">
            <div className="w-24 h-3 bg-pink-200/60 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${adherenceData.weekly}%` }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            <span className="font-bold text-pink-600 text-sm min-w-[3rem]">{adherenceData.weekly}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">This Month</span>
          <div className="flex items-center gap-3">
            <div className="w-24 h-3 bg-pink-200/60 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${adherenceData.monthly}%` }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
              />
            </div>
            <span className="font-bold text-pink-600 text-sm min-w-[3rem]">{adherenceData.monthly}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-pink-200/60">
          <span className="text-sm font-medium text-gray-600">Current Streak</span>
          <motion.div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStreakBadgeColor(adherenceData.streak)} shadow-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Target className="text-white" size={14} />
            <span className="font-bold text-white text-sm">
              {adherenceData.streak} days
            </span>
          </motion.div>
        </div>

        <motion.div 
          className="text-center mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-xs text-gray-500 mb-1">Last taken</div>
          <div className="text-sm font-semibold text-gray-700">{adherenceData.lastTaken}</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Cycle Tracker Widget
export const CycleWidget: React.FC<WidgetProps> = ({ className }) => {
  const [cycleData] = useState<CycleData>({
    currentDay: 14,
    phase: 'ovulation',
    nextPeriod: '14 days',
    fertility: 'high'
  });

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'from-red-400 via-red-500 to-pink-500';
      case 'follicular': return 'from-pink-400 via-pink-500 to-rose-500';
      case 'ovulation': return 'from-purple-400 via-purple-500 to-pink-500';
      case 'luteal': return 'from-rose-400 via-rose-500 to-pink-600';
      default: return 'from-pink-400 via-pink-500 to-rose-500';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'menstrual': return <Droplets className="text-white drop-shadow-lg" size={24} />;
      case 'follicular': return <Sun className="text-white drop-shadow-lg" size={24} />;
      case 'ovulation': return <Sparkles className="text-white drop-shadow-lg" size={24} />;
      case 'luteal': return <Moon className="text-white drop-shadow-lg" size={24} />;
      default: return <Heart className="text-white drop-shadow-lg" size={24} />;
    }
  };

  const getFertilityEmoji = (fertility: string) => {
    switch (fertility) {
      case 'high': return '🌟';
      case 'medium': return '🌸';
      case 'low': return '🌿';
      default: return '💕';
    }
  };

  const getFertilityColor = (fertility: string) => {
    switch (fertility) {
      case 'high': return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 'medium': return 'bg-gradient-to-r from-pink-400 to-rose-400';
      case 'low': return 'bg-gradient-to-r from-green-400 to-emerald-400';
      default: return 'bg-gradient-to-r from-pink-400 to-rose-400';
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${getPhaseColor(cycleData.phase)} rounded-3xl p-6 text-white shadow-2xl border border-white/20 backdrop-blur-sm ${className}`}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            <Calendar className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-xl">Cycle Day {cycleData.currentDay}</h3>
            <p className="text-white/80 text-sm">Your cycle journey</p>
          </div>
        </div>
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatDelay: 2 
          }}
        >
          {getPhaseIcon(cycleData.phase)}
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <motion.div 
            className="text-xl font-bold capitalize mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {cycleData.phase} Phase
          </motion.div>
          <motion.div 
            className="text-white/90 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Next period in {cycleData.nextPeriod}
          </motion.div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <svg className="w-28 h-28 transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - cycleData.currentDay / 28)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - cycleData.currentDay / 28) }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-2xl font-bold text-white drop-shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 400 }}
              >
                {cycleData.currentDay}
              </motion.span>
            </div>
          </div>
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-white/80 text-sm mb-2">Fertility Window</div>
          <motion.div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getFertilityColor(cycleData.fertility)} backdrop-blur-sm border border-white/30 shadow-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="capitalize font-bold text-white text-sm">{cycleData.fertility}</span>
            <motion.span 
              className="text-lg"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 1 
              }}
            >
              {getFertilityEmoji(cycleData.fertility)}
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Mood Tracker Widget
export const MoodWidget: React.FC<WidgetProps> = ({ className }) => {
  const [moodData, setMoodData] = useState<MoodData>({
    current: 'Happy',
    trend: 'improving',
    weeklyAverage: 8.2
  });

  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const moods = [
    { name: 'Energetic', emoji: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { name: 'Happy', emoji: '😊', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
    { name: 'Calm', emoji: '😌', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { name: 'Stressed', emoji: '😰', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { name: 'Sad', emoji: '😢', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
    { name: 'Irritated', emoji: '😤', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="text-green-500" size={18} />;
      case 'declining': return <TrendingUp className="text-red-500 rotate-180" size={18} />;
      default: return <Activity className="text-blue-500" size={18} />;
    }
  };

  const getCurrentMood = () => moods.find(m => m.name === moodData.current) || moods[1];

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'improving': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'declining': return 'bg-gradient-to-r from-red-500 to-rose-500';
      default: return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-6 shadow-xl shadow-purple-100/50 border border-purple-100/50 backdrop-blur-sm ${className}`}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Mood Tracker</h3>
            <p className="text-xs text-gray-500">How are you feeling?</p>
          </div>
        </div>
        <motion.div
          className={`p-2 rounded-full ${getTrendBadge(moodData.trend)} shadow-lg`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {getTrendIcon(moodData.trend)}
        </motion.div>
      </div>

      <div className="space-y-5">
        <motion.button
          className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
          onClick={() => setShowMoodSelector(!showMoodSelector)}
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
        >
          <div className="flex items-center gap-4">
            <motion.span 
              className="text-4xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
            >
              {getCurrentMood().emoji}
            </motion.span>
            <div className="text-left">
              <div className="font-bold text-gray-800 text-lg">{moodData.current}</div>
              <div className="text-sm text-gray-500">Current mood</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showMoodSelector ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="text-gray-400"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showMoodSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-3 gap-3"
            >
              {moods.map((mood) => (
                <motion.button
                  key={mood.name}
                  className={`p-4 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-2 ${mood.bg} ${mood.border} border backdrop-blur-sm`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMoodData(prev => ({ ...prev, current: mood.name }));
                    setShowMoodSelector(false);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {mood.emoji}
                  </motion.span>
                  <span className={`text-xs font-semibold ${mood.color}`}>{mood.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm font-medium text-gray-600">Weekly Average</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-600 text-lg">{moodData.weeklyAverage}/10</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 2 
              }}
            >
              <Heart className="text-pink-500" size={16} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// AI Insights Widget
export const AIInsightsWidget: React.FC<WidgetProps> = ({ className }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const aiService = AIInsightsService.getInstance();
        const userData = {
          pillIntake: {
            consistency: 95,
            missedDoses: 2,
            totalDays: 30,
            recentPattern: ['taken', 'taken', 'missed', 'taken']
          },
          menstrualCycle: {
            cycleLength: 28,
            regularityScore: 85,
            symptoms: [],
            lastPeriod: new Date()
          },
          lifestyle: {
            sleepHours: 8,
            stressLevel: 3,
            exerciseFrequency: 4,
            waterIntake: 8
          },
          goals: ['pregnancy prevention'],
          preferences: {
            reminderTimes: ['09:00'],
            notificationStyle: 'gentle' as const
          }
        };
        const aiInsights = aiService.generateInsights(userData);
        setInsights(aiInsights.slice(0, 3).map(insight => `${insight.title}`));
      } catch (error) {
        console.error('Failed to load AI insights:', error);
        setInsights([
          'Your adherence is excellent this week!',
          'Consider taking your pill 30 minutes earlier for better consistency',
          'You\'re on track to achieve your health goals'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const insightIcons = ['🔮', '💡', '📊', '🎯', '🌟'];

  return (
    <motion.div
      className={`bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            boxShadow: "0 10px 15px -3px rgba(168, 85, 247, 0.4)"
          }}
          transition={{ duration: 0.3 }}
        >
          <Brain className="text-white" size={24} />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Insights ✨
          </h3>
          <p className="text-sm text-gray-600">Personalized recommendations</p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                className="h-16 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="flex items-start gap-3">
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {insightIcons[index] || '💡'}
                  </motion.span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{insight}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <motion.button
        className="w-full mt-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl py-3 px-4 font-semibold hover:shadow-lg transition-all duration-300"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 10px 15px -3px rgba(168, 85, 247, 0.4)"
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={18} />
          <span>View All Insights</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

// Achievement Widget
export const AchievementWidget: React.FC<WidgetProps> = ({ className }) => {
  const [achievements] = useState([
    { id: 1, title: 'Perfect Week', emoji: '👑', description: '7 days in a row!', unlocked: true, rarity: 'rare' },
    { id: 2, title: 'Early Bird', emoji: '🌅', description: 'Consistent morning routine', unlocked: true, rarity: 'common' },
    { id: 3, title: 'Health Hero', emoji: '💪', description: '30 day streak', unlocked: false, rarity: 'epic' },
    { id: 4, title: 'Cycle Expert', emoji: '🎯', description: 'Track for 3 months', unlocked: false, rarity: 'legendary' }
  ]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const getRarityColor = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return 'bg-gray-50 border-gray-200';
    switch(rarity) {
      case 'common': return 'bg-green-50 border-green-200';
      case 'rare': return 'bg-blue-50 border-blue-200';
      case 'epic': return 'bg-purple-50 border-purple-200';
      case 'legendary': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div
          className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.4)"
          }}
          transition={{ duration: 0.3 }}
        >
          <Award className="text-white" size={24} />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Achievements 🏆
          </h3>
          <p className="text-sm text-gray-600">Your progress milestones</p>
        </div>
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1 border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-sm font-bold text-orange-600">
            {unlockedCount}/{achievements.length}
          </span>
        </motion.div>
      </motion.div>

      <div className="space-y-3">
        {achievements.slice(0, 3).map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`relative p-4 rounded-2xl border backdrop-blur-sm hover:shadow-md transition-all duration-300 ${getRarityColor(achievement.rarity, achievement.unlocked)} ${
              achievement.unlocked ? 'opacity-100' : 'opacity-60'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: achievement.unlocked ? 1 : 0.6, x: 0 }}
            transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
            whileHover={achievement.unlocked ? { scale: 1.02, x: 5 } : {}}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={achievement.unlocked ? { 
                  scale: 1.2,
                  rotate: [0, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <span className="text-3xl">{achievement.emoji}</span>
                {achievement.unlocked && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 500 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                  {achievement.unlocked && (
                    <motion.span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                        achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                        achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                    >
                      {achievement.rarity}
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
            {!achievement.unlocked && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                <motion.div
                  className="text-gray-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock size={20} />
                </motion.div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.button
        className="w-full mt-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl py-3 px-4 font-semibold hover:shadow-lg transition-all duration-300"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.4)"
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Trophy size={18} />
          <span>View All Achievements</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

// Next Reminder Widget
export const NextReminderWidget: React.FC<WidgetProps> = ({ className }) => {
  const [nextReminder] = useState({
    time: '9:00 AM',
    timeUntil: '2 hours 15 minutes',
    type: 'Pill Reminder',
    emoji: '💊',
    priority: 'high'
  });

  const [isPulsing, setIsPulsing] = useState(true);

  return (
    <motion.div
      className={`bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <motion.div
          className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.4)"
          }}
          transition={{ duration: 0.3 }}
        >
          <Clock className="text-white" size={24} />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Next Reminder ⏰
          </h3>
          <p className="text-sm text-gray-600">Upcoming medication alert</p>
        </div>
        <motion.span 
          className="text-3xl"
          animate={{ 
            scale: isPulsing ? [1, 1.1, 1] : [1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 1 
          }}
        >
          {nextReminder.emoji}
        </motion.span>
      </motion.div>

      <motion.div 
        className="text-center space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <motion.div 
          className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatDelay: 2 
          }}
        >
          {nextReminder.time}
        </motion.div>
        
        <div className="space-y-2">
          <div className="font-semibold text-gray-800 text-lg">{nextReminder.type}</div>
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            in {nextReminder.timeUntil}
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <motion.button
          className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl py-3 px-4 font-semibold hover:shadow-lg transition-all duration-300"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Pill size={16} />
            <span className="text-sm">Take Now</span>
          </div>
        </motion.button>

        <motion.button
          className="bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl py-3 px-4 font-semibold hover:shadow-md transition-all duration-300 border border-gray-200"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={() => setIsPulsing(!isPulsing)}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} />
            <span className="text-sm">Adjust</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
