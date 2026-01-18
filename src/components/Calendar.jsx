import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, HeartCrack, Star, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const Calendar = ({ user }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const data = await api.getCalendarData();
      if (data.calendarData) {
        setCalendarData(data.calendarData);
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    }
    setLoading(false);
  };

  const trackPill = async (date, taken) => {
    try {
      const result = await api.trackPill(format(date, 'yyyy-MM-dd'), taken);
      if (result.success) {
        toast.success(taken ? 'Pill marked as taken! 🦫💕' : 'Pill unmarked');
        fetchCalendarData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to update pill tracking');
    }
  };

  const getDayData = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return calendarData.find(day => day.date === dateStr);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDayColor = (date) => {
    const dayData = getDayData(date);
    const today = new Date();
    
    if (!dayData) return 'bg-gray-100 text-gray-400';
    
    if (dayData.isActiveDay) {
      if (dayData.taken) {
        return 'bg-gradient-to-br from-pink-400 to-pink-500 text-white';
      } else if (date < today) {
        // Missed pill - reddish color
        return 'bg-gradient-to-br from-red-200 to-red-300 text-red-700 border-2 border-red-400';
      } else if (date <= today) {
        return 'bg-pink-100 text-pink-600 border-2 border-pink-300';
      } else {
        return 'bg-pink-50 text-pink-400';
      }
    } else {
      // Rest day
      return 'bg-gradient-to-br from-purple-200 to-purple-300 text-purple-700';
    }
  };

  const getDayIcon = (date) => {
    const dayData = getDayData(date);
    const today = new Date();
    
    if (!dayData) return null;
    
    if (dayData.isActiveDay) {
      if (dayData.taken) {
        // Capybara for taken pills
        return '🦫';
      } else if (date < today) {
        // Broken heart for missed pills (past dates only)
        return '�';
      } else {
        // Regular pill for future dates
        return '💊';
      }
    } else {
      // Rest day
      return '🌸';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-300 border-t-pink-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ bounce: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mr-3"
            >
              🦫
            </motion.div>
            <h1 className="text-3xl font-bold text-pink-800">Your Pill Calendar</h1>
          </div>
          <p className="text-pink-600">Track your daily pills with love and care! 💕</p>
        </motion.div>

        {/* Calendar Navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={previousMonth}
              className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            
            <h2 className="text-2xl font-bold text-pink-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-pink-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((date) => {
              const dayData = getDayData(date);
              const isToday = isSameDay(date, new Date());
              const canToggle = dayData?.isActiveDay && date <= new Date();
              
              return (
                <motion.div
                  key={date.toString()}
                  whileHover={canToggle ? { scale: 1.05 } : {}}
                  whileTap={canToggle ? { scale: 0.95 } : {}}
                  className={`
                    relative h-16 rounded-xl flex flex-col items-center justify-center
                    cursor-pointer transition-all duration-200
                    ${getDayColor(date)}
                    ${isToday ? 'ring-4 ring-pink-400 ring-opacity-50' : ''}
                    ${canToggle ? 'hover:shadow-lg' : 'cursor-default'}
                  `}
                  onClick={() => canToggle && trackPill(date, !dayData.taken)}
                >
                  <div className="text-sm font-semibold">
                    {format(date, 'd')}
                  </div>
                  <div className="text-lg">
                    {getDayIcon(date)}
                  </div>
                  
                  {isToday && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-pink-800 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                🦫
              </div>
              <span className="text-pink-700">Pill taken</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-pink-100 border-2 border-pink-300 rounded-lg mr-3 flex items-center justify-center">
                💊
              </div>
              <span className="text-pink-700">Pill due</span>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 border-2 border-red-300 rounded-lg mr-3 flex items-center justify-center">
                💔
              </div>
              <span className="text-red-700">Missed pill</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg mr-3 flex items-center justify-center">
                🌸
              </div>
              <span className="text-pink-700">Rest day</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-pink-50 rounded-xl">
            <p className="text-pink-700 text-sm">
              💡 <strong>Tip:</strong> Click on any active pill day to mark it as taken or not taken. 
              Your capybara friend {user?.capybaraName} is cheering you on! 🦫✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;
