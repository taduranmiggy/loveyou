import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Activity, Heart, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar';
import Button from '../components/Button';

const CalendarPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'calendar' | 'insights' | 'trends'>('calendar');

  const onboardingData = user?.onboardingData;
  const userName = user?.nickname || onboardingData?.nickname || 'there';

  // Sample stats data (replace with real API data)
  const stats = {
    pillStreak: 7,
    nextPeriod: '5 days',
    cycleDay: 14,
    currentPhase: 'Ovulation'
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-20 pb-8 lg:pt-24 lg:pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Your Calendar
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your pills and cycle, {userName}! 🌸
                </p>
              </div>
            </div>

            {/* Floating capybara */}
            <motion.img 
              src="/flowercapybara.png" 
              alt="Calendar capybara"
              className="w-20 h-20 opacity-70"
              animate={{ 
                y: [-3, 3, -3],
                rotate: [-1, 1, -1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.pillStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.nextPeriod}</div>
                  <div className="text-sm text-gray-600">Next Period</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.cycleDay}</div>
                  <div className="text-sm text-gray-600">Cycle Day</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{stats.currentPhase}</div>
                  <div className="text-sm text-gray-600">Current Phase</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'calendar', label: 'Calendar View', icon: <CalendarIcon className="w-4 h-4" /> },
              { id: 'insights', label: 'Insights', icon: <Activity className="w-4 h-4" /> },
              { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveView(tab.id as any)}
                className="flex items-center gap-2"
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeView === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Calendar Component */}
              <div className="lg:col-span-2">
                <Calendar 
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  className="w-full"
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Selected Date Info */}
                <motion.div
                  className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6"
                  whileHover={{ y: -2 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                      <CalendarIcon className="w-5 h-5 text-pink-500" />
                      <div>
                        <div className="font-medium">Pill Status</div>
                        <div className="text-sm text-gray-600">Taken at 8:30 AM</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                      <Heart className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium">Cycle Phase</div>
                        <div className="text-sm text-gray-600">Ovulation (Day 14)</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-2">
                    <Button size="sm" className="w-full">
                      Log Symptoms
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Add Notes
                    </Button>
                  </div>
                </motion.div>

                {/* Upcoming Reminders */}
                <motion.div
                  className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6"
                  whileHover={{ y: -2 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Upcoming
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Tomorrow's Pill</div>
                        <div className="text-xs text-gray-600">8:00 AM</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Expected Period</div>
                        <div className="text-xs text-gray-600">Aug 5-9</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Cute motivational capybara */}
                <motion.div
                  className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-6 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.img 
                    src="/ribboncapybara.png" 
                    alt="Motivational capybara"
                    className="w-16 h-16 mx-auto mb-3"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <p className="text-sm text-gray-700 font-medium">
                    "You're doing amazing! Keep up the great tracking! 🌸"
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeView === 'insights' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-lg border border-pink-100 p-8 text-center"
            >
              <Activity className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Health Insights</h3>
              <p className="text-gray-600 mb-6">
                Detailed insights and analytics coming soon! We're working on personalized health insights based on your tracking data.
              </p>
              <img 
                src="/smartcapybara.png" 
                alt="Smart capybara"
                className="w-20 h-20 mx-auto opacity-70"
              />
            </motion.div>
          )}

          {activeView === 'trends' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-lg border border-pink-100 p-8 text-center"
            >
              <TrendingUp className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cycle Trends</h3>
              <p className="text-gray-600 mb-6">
                Beautiful charts and trend analysis coming soon! Track your patterns over time with intuitive visualizations.
              </p>
              <img 
                src="/bookcapybara.png" 
                alt="Book capybara"
                className="w-20 h-20 mx-auto opacity-70"
              />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CalendarPage;
