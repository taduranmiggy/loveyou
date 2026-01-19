import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Pill, Heart, TrendingUp, CheckCircle2, AlertTriangle, Bell, Settings, User, Activity, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';
import Button from '../components/Button';
import EditProfileModal from '../components/EditProfileModal';

const DashboardPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const { 
    handlePillTaken: notifyPillTaken,
    hasPermission: hasNotificationPermission,
    needsPermission: needsNotificationPermission 
  } = useNotificationIntegration();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, task: 'Take morning pill', completed: true, time: '8:00 AM' },
    { id: 2, task: 'Log mood and symptoms', completed: false, time: '6:00 PM' },
    { id: 3, task: 'Update cycle notes', completed: false, time: '9:00 PM' }
  ]);
  const [pillTaken, setPillTaken] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  // Show toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handler functions for buttons
  const handlePillTaken = () => {
    setPillTaken(true);
    // Integrate with notification system
    notifyPillTaken();
    showToastNotification('🎉 Great job! Pill marked as taken. Your capybara friend is proud of you! 🌸');
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    showToastNotification(showNotifications ? '🔔 Notifications hidden' : '🔔 Notifications panel opened!');
  };

  const handleTaskToggle = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      showToastNotification(
        task.completed 
          ? `❌ Task "${task.task}" marked as incomplete` 
          : `✅ Task "${task.task}" completed! Great job! 🌸`
      );
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Mark Pill Taken':
        handlePillTaken();
        break;
      case 'AI Insights':
        navigate('/ai-insights');
        break;
      case 'Log Symptoms':
        showToastNotification('📝 Symptoms logged for today! Great self-care 💕');
        break;
      case 'View Calendar':
        navigate('/calendar');
        break;
      case 'Settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  const animationVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1
        }
      }
    },
    item: {
      hidden: { scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.3 }
      }
    }
  };

  const stats = [
    {
      label: 'Pills This Month',
      value: '26/30',
      percentage: 87,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <Pill className="w-6 h-6 text-green-600" />
    },
    {
      label: 'Current Streak',
      value: '12 days',
      percentage: 100,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />
    },
    {
      label: 'Cycle Health',
      value: 'Good',
      percentage: 85,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: <Heart className="w-6 h-6 text-purple-600" />
    },
    {
      label: 'Next Period',
      value: '18 days',
      percentage: 64,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      icon: <Calendar className="w-6 h-6 text-pink-600" />
    }
  ];

  const recentActivity = [
    { id: 1, type: 'pill', message: 'Pill taken successfully', time: '2 hours ago', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
    { id: 2, type: 'cycle', message: 'Cycle day 10 logged', time: '1 day ago', icon: <Heart className="w-4 h-4 text-purple-500" /> },
    { id: 3, type: 'reminder', message: 'Pill reminder set for tomorrow', time: '2 days ago', icon: <Bell className="w-4 h-4 text-blue-500" /> },
    { id: 4, type: 'warning', message: 'Missed pill yesterday', time: '3 days ago', icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> }
  ];

  const quickActions = [
    { label: 'Mark Pill Taken', icon: <Pill className="w-5 h-5" />, color: 'bg-green-500 hover:bg-green-600' },
    { label: 'AI Insights', icon: <Brain className="w-5 h-5" />, color: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' },
    { label: 'Log Symptoms', icon: <Activity className="w-5 h-5" />, color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'View Calendar', icon: <Calendar className="w-5 h-5" />, color: 'bg-pink-500 hover:bg-pink-600' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, color: 'bg-gray-500 hover:bg-gray-600' }
  ];

  const cycleInsights = [
    { phase: 'Follicular', days: '1-13', status: 'Current', color: 'bg-purple-100 text-purple-700' },
    { phase: 'Ovulation', days: '14-16', status: 'Upcoming', color: 'bg-pink-100 text-pink-700' },
    { phase: 'Luteal', days: '17-28', status: 'Future', color: 'bg-gray-100 text-gray-700' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <motion.section
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-20 pb-8 lg:pt-24 lg:pb-12"
        aria-labelledby="dashboard-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 relative">
            {/* Floating capybara */}
            <motion.img 
              src="/welcomecapybara.png" 
              alt="Welcome capybara"
              className="absolute top-0 -right-4 w-20 h-20 opacity-70"
              animate={shouldReduceMotion ? {} : { 
                y: [-3, 3, -3],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            <div>
              <h1 id="dashboard-heading" className="text-3xl lg:text-4xl font-bold text-gray-900">
                Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                  {user?.nickname || user?.onboardingData?.nickname || user?.name || 'Beautiful'}!
                </span> 🌸
              </h1>
              <p className="text-lg text-gray-600 mt-2">Your capybara companion is here with today's wellness overview</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                size="lg"
                shimmer
                icon={<Pill className="w-5 h-5" />}
                iconPosition="left"
                onClick={handlePillTaken}
                disabled={pillTaken}
              >
                {pillTaken ? '✅ Pill Taken!' : '🌿 Mark Pill Taken'}
              </Button>
              <Button
                variant="glass"
                size="md"
                className={`p-3 relative ${
                  needsNotificationPermission ? 'animate-pulse border-amber-300' : 
                  hasNotificationPermission ? 'border-green-300' : 'border-red-300'
                }`}
                aria-label="Notifications"
                onClick={handleToggleNotifications}
              >
                <Bell className={`w-5 h-5 ${showNotifications ? 'text-pink-500' : ''}`} />
                {needsNotificationPermission && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                )}
                {!hasNotificationPermission && !needsNotificationPermission && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Grid */}
            <motion.div
              variants={animationVariants.container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={animationVariants.item}
                  className="card"
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                    <span className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{stat.label}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stat.color.replace('text-', 'bg-')} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Today's Tasks */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 card"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Tasks</h3>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                        task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                      }`}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    >
                      <motion.button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-pink-500'
                        }`}
                        onClick={() => handleTaskToggle(task.id)}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </motion.button>
                      <div className="flex-1">
                        <div className={`font-medium ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                          {task.task}
                        </div>
                        <div className="text-sm text-gray-500">{task.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-white font-medium transition-colors ${action.color}`}
                        onClick={() => handleQuickAction(action.label)}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      >
                        {action.icon}
                        <span className="text-sm">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Cycle Phase */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Phase</h3>
                  <div className="space-y-3">
                    {cycleInsights.map((phase) => (
                      <div key={phase.phase} className={`p-3 rounded-lg ${phase.color}`}>
                        <div className="font-medium">{phase.phase}</div>
                        <div className="text-sm opacity-80">Days {phase.days}</div>
                        <div className="text-xs mt-1 font-medium">{phase.status}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* AI Insights Preview */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                    <Brain className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">🌟</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Great consistency!</p>
                          <p className="text-xs text-gray-600">You've taken 87% of your pills this month</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">🗓️</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Period prediction</p>
                          <p className="text-xs text-gray-600">Expected in 6 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    onClick={() => navigate('/ai-insights')}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all"
                  >
                    View All Insights
                  </motion.button>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Tab Contents */}
      {activeTab === 'health' && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* AI Health Insights - Full Width */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">AI Health Insights</h3>
                  <Brain className="w-6 h-6 text-pink-500" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">💊</span>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Adherence Pattern</h4>
                        <p className="text-sm text-gray-600 mb-2">You tend to miss pills on weekends. Try setting weekend-specific reminders!</p>
                        <button 
                          onClick={() => navigate('/ai-insights')}
                          className="text-xs bg-pink-500 text-white px-3 py-1 rounded-full hover:bg-pink-600 transition-colors"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🌙</span>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Sleep & Wellness</h4>
                        <p className="text-sm text-gray-600 mb-2">Getting more sleep could improve your hormone balance and energy levels.</p>
                        <button 
                          onClick={() => navigate('/ai-insights')}
                          className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                        >
                          Get Tips
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🌸</span>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Cycle Prediction</h4>
                        <p className="text-sm text-gray-600 mb-2">Your cycle shows great regularity! Next period expected March 15th.</p>
                        <button 
                          onClick={() => navigate('/ai-insights')}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Metrics Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
              {/* Health Metrics */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Health Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="font-medium">Mood Today</span>
                    <div className="flex space-x-1">
                      {['😢', '😐', '😊', '😍', '🥰'].map((emoji, index) => (
                        <button
                          key={index}
                          className="text-2xl hover:scale-110 transition-transform"
                          onClick={() => showToastNotification(`Mood logged: ${emoji} Thanks for sharing!`)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Energy Level</span>
                      <span className="text-pink-600 font-bold">7/10</span>
                    </div>
                    <div className="w-full bg-pink-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                  
                  <button 
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    onClick={() => showToastNotification('📊 Generating your detailed health report... ✨')}
                  >
                    View Detailed Report
                  </button>
                </div>
              </div>

              {/* Side Effects Tracker */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Side Effects Tracker</h3>
                <div className="space-y-3">
                  {['Nausea', 'Headache', 'Mood Changes', 'Breast Tenderness', 'Spotting'].map((symptom) => (
                    <motion.button
                      key={symptom}
                      className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => showToastNotification(`${symptom} logged for today 📝`)}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    >
                      <span>{symptom}</span>
                      <span className="text-gray-400">+</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {activeTab === 'schedule' && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Pill Schedule */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Pill Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div>
                      <div className="font-medium">Morning Pill</div>
                      <div className="text-sm text-gray-600">8:00 AM daily</div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      onClick={() => showToastNotification('⏰ Pill reminder set for 8:00 AM daily! 🔔')}
                    >
                      Edit Time
                    </button>
                  </div>
                  
                  <button 
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-colors"
                    onClick={() => showToastNotification('➕ New reminder added! You\'ll get a notification at your chosen time 🔔')}
                  >
                    + Add New Reminder
                  </button>
                </div>
              </div>

              {/* Calendar Integration */}
              <div className="card text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Calendar Integration</h3>
                <motion.img 
                  src="/bookcapy.png" 
                  alt="Book capybara"
                  className="w-24 h-24 mx-auto mb-4"
                  animate={shouldReduceMotion ? {} : { 
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                <p className="text-gray-600 mb-6">
                  Sync your pill schedule with your favorite calendar app
                </p>
                <button 
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  onClick={() => navigate('/calendar')}
                >
                  Open Calendar
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {activeTab === 'profile' && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              {/* Profile Info */}
              <div className="card">
                <div className="flex items-center space-x-4 mb-6">
                  <motion.img 
                    src="/ribboncapy.png" 
                    alt="Ribbon capybara"
                    className="w-16 h-16"
                    animate={shouldReduceMotion ? {} : { 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{user?.name || 'Wellness Warrior'}</h3>
                    <p className="text-gray-600">Capybara lover & wellness warrior 🌸</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <div className="text-sm text-gray-600">Pill Type</div>
                      <div className="font-medium">{user?.pillType || 'Not set'}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Cycle Length</div>
                      <div className="font-medium">{user?.cycleLength || 28} days</div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Achievements 🏆</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Perfect Week', emoji: '🌟', desc: '7 days streak' },
                    { name: 'Capybara Friend', emoji: '🥰', desc: 'Love capybaras' },
                    { name: 'Health Tracker', emoji: '📊', desc: 'Regular logging' },
                    { name: 'Early Bird', emoji: '🌅', desc: 'Morning pills' }
                  ].map((badge) => (
                    <motion.div
                      key={badge.name}
                      className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-center"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    >
                      <div className="text-2xl mb-2">{badge.emoji}</div>
                      <div className="font-medium text-gray-900">{badge.name}</div>
                      <div className="text-xs text-gray-600">{badge.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {activeTab !== 'overview' && activeTab !== 'health' && activeTab !== 'schedule' && activeTab !== 'profile' && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card text-center py-12"
            >
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Coming Soon
              </h3>
              <p className="text-gray-600">
                This section is under development. Check back soon for more features!
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 bg-white border border-pink-200 rounded-2xl shadow-2xl p-4 max-w-sm z-50"
        >
          <div className="flex items-center space-x-3">
            <motion.img 
              src="/cutesycapy.png" 
              alt="Cute capybara"
              className="w-12 h-12"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">
                {toastMessage}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
