import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Star, Sparkles, TrendingUp } from 'lucide-react';
import { SkeletonStats, SkeletonCard } from './LoadingComponents';
import { showErrorToast, showSuccessToast, handleApiError } from '../utils/errorHandling.jsx';
import api from '../utils/api.js';

const Dashboard = ({ user }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [quote, setQuote] = useState('');
  const [stats, setStats] = useState({
    streak: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch calendar data
      const calendarResult = await api.getCalendarData();

      if (calendarResult.success && calendarResult.calendarData) {
        setCalendarData(calendarResult.calendarData);
        calculateStats(calendarResult.calendarData);
      } else {
        setError('Unable to load calendar data');
      }

      // Set a random motivational quote
      const quotes = [
        "You're doing amazing! Keep it up! 🌸",
        "Every pill taken is self-care in action! 💕",
        "Your capybara friend is proud of you! 🦫",
        "Consistency is key, and you're nailing it! ✨",
        "Taking care of yourself is beautiful! 🌺"
      ];
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Unable to load calendar data');
    }

    setLoading(false);
  };

  const calculateStats = (data) => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let streak = 0;
    let thisWeek = 0;
    let thisMonth = 0;

    // Calculate current streak (from today backwards)
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const day of sortedData) {
      const dayDate = new Date(day.date);
      if (dayDate <= today && day.isActiveDay && day.taken) {
        streak++;
      } else if (day.isActiveDay) {
        break;
      }
    }

    // Calculate weekly and monthly stats
    data.forEach(day => {
      const dayDate = new Date(day.date);
      if (day.isActiveDay && day.taken) {
        if (dayDate >= weekAgo) thisWeek++;
        if (dayDate >= monthAgo) thisMonth++;
      }
    });

    setStats({ streak, thisWeek, thisMonth });
  };

  const getTodayData = () => {
    const today = new Date().toISOString().split('T')[0];
    return calendarData.find(day => day.date === today);
  };

  const todayData = getTodayData();
  const isRestDay = todayData && !todayData.isActiveDay;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block text-6xl mb-4 cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const dashboardMessages = [
                `${user?.capybaraName} is so proud of your progress! 🦫✨`,
                "Look at those amazing stats! You're crushing it! 📊💕",
                "Your consistency makes me so happy! Keep going! 🌟",
                "Dashboard looking good! Just like your health routine! 💖",
                `${user?.capybaraName} believes in you! Check your calendar! 📅🦫`
              ];
              const randomMessage = dashboardMessages[Math.floor(Math.random() * dashboardMessages.length)];
              
              toast.success(randomMessage, {
                duration: 3500,
                style: {
                  background: '#fce7f3',
                  color: '#831843',
                  border: '2px solid #f9a8d4',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500'
                },
                icon: '🦫'
              });
            }}
          >
            <img 
              src="/src/assets/smartcapybara.png" 
              alt="Smart Capybara" 
              className="w-20 h-20 object-contain"
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-pink-800 mb-2">
            Hello, {user?.nickname}! 💕
          </h1>
          <p className="text-pink-600 text-lg">
            {user?.capybaraName} is here to cheer you on!
          </p>
        </motion.div>

        {/* Today's Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass rounded-3xl p-6 text-center">
            {isRestDay ? (
              <>
                <div className="text-4xl mb-4">🌸</div>
                <h2 className="text-2xl font-bold text-pink-800 mb-2">Rest Day!</h2>
                <p className="text-pink-600">
                  Take a break and relax, just like a capybara by the water! 🦫💙
                </p>
                <div className="mt-4 text-lg">
                  "{quote}"
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">💊</div>
                <h2 className="text-2xl font-bold text-pink-800 mb-2">
                  {todayData?.taken ? 'Pill Taken! ✨' : 'Time for your pill!'}
                </h2>
                <p className="text-pink-600">
                  {todayData?.taken 
                    ? 'Great job! You\'re taking amazing care of yourself!' 
                    : 'Don\'t forget your daily pill! Your health matters! 💕'
                  }
                </p>
                {!todayData?.taken && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-4"
                  >
                    <Link
                      to="/calendar"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:from-pink-600 hover:to-pink-700 transition-colors"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Mark as taken
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {loading ? (
            <>
              <SkeletonStats />
              <SkeletonStats />
              <SkeletonStats />
            </>
          ) : (
            <>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="text-2xl font-bold text-pink-800">{stats.streak}</h3>
                <p className="text-pink-600">Day Streak</p>
              </div>
              
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="text-2xl font-bold text-pink-800">{stats.thisWeek}/7</h3>
                <p className="text-pink-600">This Week</p>
              </div>
              
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="text-2xl font-bold text-pink-800">{stats.thisMonth}</h3>
                <p className="text-pink-600">This Month</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Link
            to="/calendar"
            className="glass rounded-2xl p-6 hover:bg-pink-100/50 transition-colors group"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-pink-500 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-pink-800">View Calendar</h3>
                <p className="text-pink-600">Track your pills and see your progress</p>
              </div>
            </div>
          </Link>

          <Link
            to="/settings"
            className="glass rounded-2xl p-6 hover:bg-pink-100/50 transition-colors group"
          >
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-pink-500 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-pink-800">Customize</h3>
                <p className="text-pink-600">Update your pill type and preferences</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="glass rounded-2xl p-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              🌟
            </motion.div>
            <h3 className="text-xl font-semibold text-pink-800 mb-2">Daily Motivation</h3>
            <p className="text-pink-600 italic">"{quote}"</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
