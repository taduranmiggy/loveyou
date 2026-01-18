import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Pill,
  Droplets,
  Heart,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  pillStatus: 'taken' | 'missed' | 'upcoming' | 'none';
  cycleDay?: number;
  cyclePhase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  symptoms?: string[];
  mood?: string;
  notes?: string;
}

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  className?: string;
}

const Calendar = ({ onDateSelect, selectedDate, className = '' }: CalendarProps) => {
  const { user } = useAuth();
  const { handlePillTaken, handleMissedPill } = useNotificationIntegration();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pillIntakes, setPillIntakes] = useState<Record<string, any>>({});
  const [cycleData] = useState<Record<string, any>>({});
  const [showDayDetails, setShowDayDetails] = useState<CalendarDay | null>(null);
  const [justLoggedPill, setJustLoggedPill] = useState<string | null>(null);

  // Get user's onboarding data
  const onboardingData = user?.onboardingData;
  const cycleLength = onboardingData?.cycleLength || 28;
  const lastPeriodDate = onboardingData?.lastPeriodDate ? new Date(onboardingData.lastPeriodDate) : null;

  // Calculate cycle predictions
  const calculateCyclePhase = (date: Date): { phase: CalendarDay['cyclePhase'], day: number } => {
    if (!lastPeriodDate) return { phase: undefined, day: 0 };

    const diffTime = date.getTime() - lastPeriodDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;

    let phase: CalendarDay['cyclePhase'];
    if (cycleDay <= 5) {
      phase = 'menstrual';
    } else if (cycleDay <= 13) {
      phase = 'follicular';
    } else if (cycleDay <= 16) {
      phase = 'ovulation';
    } else {
      phase = 'luteal';
    }

    return { phase, day: cycleDay };
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateKey = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate ? date.getTime() === selectedDate.getTime() : false;

      // Calculate cycle info
      const { phase, day } = calculateCyclePhase(date);

      // Determine pill status with smarter logic
      let pillStatus: CalendarDay['pillStatus'] = 'none';
      if (isCurrentMonth) {
        const intake = pillIntakes[dateKey];
        if (intake) {
          pillStatus = intake.status;
        } else if (date <= today) {
          // Only mark as missed if it's a pill day (not during period)
          if (phase !== 'menstrual' || (phase === 'menstrual' && day > 3)) {
            pillStatus = 'missed';
          }
        } else {
          // Future dates - show as upcoming if it's a pill day
          if (phase !== 'menstrual' || (phase === 'menstrual' && day > 5)) {
            pillStatus = 'upcoming';
          }
        }
      }

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        pillStatus,
        cycleDay: day,
        cyclePhase: phase,
        symptoms: cycleData[dateKey]?.symptoms || [],
        mood: cycleData[dateKey]?.mood,
        notes: cycleData[dateKey]?.notes
      });
    }

    return days;
  }, [currentDate, selectedDate, pillIntakes, cycleData, lastPeriodDate, cycleLength]);

  // Navigation handlers
  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Day selection handler
  const handleDayClick = (day: CalendarDay) => {
    if (onDateSelect) {
      onDateSelect(day.date);
    }
    setShowDayDetails(day);
  };

  // Quick pill logging
  const handleQuickPillLog = (date: Date, status: 'taken' | 'missed') => {
    const dateKey = date.toISOString().split('T')[0];
    setPillIntakes(prev => ({
      ...prev,
      [dateKey]: {
        status,
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        loggedAt: new Date().toISOString()
      }
    }));
    
    // Integrate with notification system
    if (status === 'taken') {
      handlePillTaken(date);
    } else if (status === 'missed') {
      handleMissedPill(date);
    }
    
    // Show cute animation feedback
    setJustLoggedPill(dateKey);
    setTimeout(() => setJustLoggedPill(null), 2000);
    
    setShowDayDetails(null);
  };

  // Get phase color with enhanced visuals
  const getPhaseColor = (phase?: CalendarDay['cyclePhase']) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'follicular': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'ovulation': return 'bg-pink-50 border-pink-200 hover:bg-pink-100';
      case 'luteal': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  // Get pill status icon
  const getPillStatusIcon = (status: CalendarDay['pillStatus']) => {
    switch (status) {
      case 'taken': return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      case 'missed': return <X className="w-3 h-3 text-red-600" />;
      case 'upcoming': return <Pill className="w-3 h-3 text-blue-600" />;
      default: return null;
    }
  };

  // Mock data for development (replace with API calls)
  useEffect(() => {
    // Simulate some pill intake data
    const today = new Date();
    const mockIntakes: Record<string, any> = {};
    
    for (let i = -7; i <= 0; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      if (Math.random() > 0.2) { // 80% chance of taking pill
        mockIntakes[dateKey] = {
          status: 'taken',
          time: '08:30',
          mood: ['happy', 'good', 'okay'][Math.floor(Math.random() * 3)]
        };
      } else {
        mockIntakes[dateKey] = {
          status: 'missed'
        };
      }
    }
    
    setPillIntakes(mockIntakes);
  }, []);

  // Calculate stats
  const calculateStats = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let takenThisMonth = 0;
    let missedThisMonth = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current month stats
    Object.entries(pillIntakes).forEach(([dateKey, intake]) => {
      const date = new Date(dateKey);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (intake.status === 'taken') {
          takenThisMonth++;
        } else if (intake.status === 'missed') {
          missedThisMonth++;
        }
      }
    });
    
    // Calculate streaks (simplified - check last 30 days)
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const intake = pillIntakes[dateKey];
      
      if (intake?.status === 'taken') {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak; // Current streak only counts if today or recent
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        if (i < 7) tempStreak = 0; // Reset current streak if missed in last week
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      takenThisMonth,
      missedThisMonth,
      currentStreak,
      longestStreak,
      adherenceRate: takenThisMonth + missedThisMonth > 0 
        ? Math.round((takenThisMonth / (takenThisMonth + missedThisMonth)) * 100) 
        : 0
    };
  }, [pillIntakes]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-pink-100 overflow-hidden ${className}`}>
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={previousMonth}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <motion.button
              onClick={goToToday}
              className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors mt-1"
              whileHover={{ scale: 1.05 }}
            >
              Today
            </motion.button>
          </div>

          <motion.button
            onClick={nextMonth}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Legend & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              <span>Period</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>Fertile</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Taken</span>
            </div>
            <div className="flex items-center gap-1">
              <X className="w-3 h-3" />
              <span>Missed</span>
            </div>
          </div>
          
          <div className="flex gap-3 text-white/90">
            <div className="text-center">
              <div className="font-bold">{calculateStats.adherenceRate}%</div>
              <div className="text-xs opacity-80">This month</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{calculateStats.currentStreak}🔥</div>
              <div className="text-xs opacity-80">Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2 w-12 mx-auto">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dateKey = day.date.toISOString().split('T')[0];
            const isJustLogged = justLoggedPill === dateKey;
            
            return (
              <motion.button
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  relative w-12 h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                  ${day.isToday ? 'ring-2 ring-pink-400' : ''}
                  ${day.isSelected ? 'ring-2 ring-purple-400' : ''}
                  ${getPhaseColor(day.cyclePhase)}
                  hover:scale-105 hover:shadow-md
                  ${isJustLogged ? 'ring-4 ring-green-300 bg-green-50' : ''}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isJustLogged ? { 
                  scale: [1, 1.15, 1], 
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 0.6 }}
                disabled={!day.isCurrentMonth}
              >
                {/* Date number */}
                <span className={`text-sm font-semibold leading-none ${day.isToday ? 'font-bold' : ''}`}>
                  {day.date.getDate()}
                </span>

                {/* Pill status indicator */}
                {day.isCurrentMonth && (
                  <motion.div 
                    className="absolute -top-1 -right-1"
                    animate={isJustLogged ? { scale: [1, 1.3, 1] } : {}}
                  >
                    {getPillStatusIcon(day.pillStatus)}
                    {isJustLogged && day.pillStatus === 'taken' && (
                      <motion.div
                        className="absolute -top-1 -right-1 text-green-500 text-xs"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: [0, 1.5, 0], rotate: [0, 360] }}
                        transition={{ duration: 1 }}
                      >
                        ✨
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Cycle day indicator */}
                {day.isCurrentMonth && day.cycleDay && (
                  <div className="absolute -bottom-1 left-0 right-0">
                    <div className="flex justify-center">
                      {day.cyclePhase === 'menstrual' && <Droplets className="w-2 h-2 text-red-500" />}
                      {day.cyclePhase === 'ovulation' && <Heart className="w-2 h-2 text-pink-500" />}
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Day Details Modal */}
      <AnimatePresence>
        {showDayDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDayDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {showDayDetails.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setShowDayDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Day Details Content */}
              <div className="space-y-4">
                {/* Pill Status */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Pill className="w-5 h-5 text-pink-500" />
                  <div className="flex-1">
                    <div className="font-medium">Pill Status</div>
                    <div className="text-sm text-gray-600 capitalize flex items-center gap-2">
                      {showDayDetails.pillStatus}
                      {showDayDetails.pillStatus === 'taken' && (
                        <span className="text-green-600">✨</span>
                      )}
                      {showDayDetails.pillStatus === 'missed' && (
                        <span className="text-red-600">⚠️</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cycle Info */}
                {showDayDetails.cyclePhase && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CalendarIcon className="w-5 h-5 text-purple-500" />
                    <div className="flex-1">
                      <div className="font-medium">Cycle Info</div>
                      <div className="text-sm text-gray-600">
                        <div className="capitalize flex items-center gap-2">
                          {showDayDetails.cyclePhase} Phase
                          {showDayDetails.cyclePhase === 'menstrual' && '🩸'}
                          {showDayDetails.cyclePhase === 'follicular' && '🌱'}
                          {showDayDetails.cyclePhase === 'ovulation' && '💖'}
                          {showDayDetails.cyclePhase === 'luteal' && '🌙'}
                        </div>
                        <div className="text-xs">Day {showDayDetails.cycleDay} of cycle</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Predictions & Tips */}
                {showDayDetails.cyclePhase && (
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                    <div className="font-medium text-sm mb-1 text-purple-700">
                      {showDayDetails.cyclePhase === 'ovulation' && '💕 Fertile Window'}
                      {showDayDetails.cyclePhase === 'menstrual' && '🤗 Self-Care Time'}
                      {showDayDetails.cyclePhase === 'follicular' && '✨ Energy Rising'}
                      {showDayDetails.cyclePhase === 'luteal' && '🌙 Wind Down Phase'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {showDayDetails.cyclePhase === 'ovulation' && 'Higher chance of pregnancy. Extra contraception care!'}
                      {showDayDetails.cyclePhase === 'menstrual' && 'Stay hydrated and be gentle with yourself.'}
                      {showDayDetails.cyclePhase === 'follicular' && 'Great time for new activities and planning.'}
                      {showDayDetails.cyclePhase === 'luteal' && 'Focus on rest and comfort foods.'}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {showDayDetails.pillStatus !== 'taken' && (
                    <motion.button
                      onClick={() => handleQuickPillLog(showDayDetails.date, 'taken')}
                      className="p-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✨ Mark Pill Taken
                    </motion.button>
                  )}
                  {showDayDetails.pillStatus === 'none' && (
                    <motion.button
                      onClick={() => handleQuickPillLog(showDayDetails.date, 'missed')}
                      className="p-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      💔 Mark Missed
                    </motion.button>
                  )}
                  {showDayDetails.pillStatus === 'taken' && (
                    <motion.div
                      className="col-span-2 p-3 bg-green-50 text-green-700 rounded-xl font-medium text-center border border-green-200"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      💚 Pill taken! Great job! 
                    </motion.div>
                  )}
                  <motion.button
                    className="p-3 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📝 Log Symptoms
                  </motion.button>
                </div>
              </div>

              {/* Cute capybara */}
              <motion.div
                className="flex justify-center mt-4"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img 
                  src="/flowercapybara.png" 
                  alt="Calendar capybara"
                  className="w-16 h-16 opacity-70"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
