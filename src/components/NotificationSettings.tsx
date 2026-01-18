import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Volume2, Smartphone, TestTube, Settings } from 'lucide-react';
import { notificationService } from '../services/NotificationService';
import Button from './Button';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const [reminderStyle, setReminderStyle] = useState<'cute' | 'gentle' | 'urgent'>('cute');
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.initializeNotifications();
    setIsEnabled(granted);
    setPermission(Notification.permission);
  };

  const handleTestNotification = () => {
    notificationService.testNotification(reminderStyle);
  };

  const reminderStyles = [
    {
      id: 'cute' as const,
      name: 'Cute & Friendly',
      description: 'Sweet capybara reminders with emojis',
      emoji: '🥰',
      example: '💕 Time for your pill! Your capybara friend says it\'s wellness time! 🌸'
    },
    {
      id: 'gentle' as const,
      name: 'Gentle & Peaceful',
      description: 'Calm, mindful reminders',
      emoji: '🕊️',
      example: '🌿 Gentle reminder: A peaceful moment to take your medication ✨'
    },
    {
      id: 'urgent' as const,
      name: 'Clear & Important',
      description: 'Direct reminders for consistent routine',
      emoji: '🚨',
      example: '⚠️ Important: Please take your medication now.'
    }
  ];

  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-pink-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Notification Settings</h2>
            <p className="text-pink-100 text-sm">Customize your pill reminders</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enable Notifications */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-pink-600" />
            Push Notifications
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Enable Notifications</p>
              <p className="text-sm text-gray-600">
                Get timely reminders for your medication
              </p>
              {permission === 'denied' && (
                <p className="text-xs text-red-600 mt-1">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              )}
            </div>
            <motion.button
              onClick={handleEnableNotifications}
              disabled={permission === 'denied'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-green-500' : 'bg-gray-300'
              } ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                animate={{ x: isEnabled ? 24 : 4 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Reminder Style */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-pink-600" />
            Reminder Style
          </h3>
          
          <div className="grid gap-3">
            {reminderStyles.map((style) => (
              <motion.div
                key={style.id}
                onClick={() => setReminderStyle(style.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  reminderStyle === style.id
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-gray-200 bg-white hover:border-pink-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{style.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{style.name}</h4>
                      {reminderStyle === style.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-pink-500 rounded-full"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{style.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2 italic">
                      "{style.example}"
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Snooze Options */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-600" />
            Snooze Options
          </h3>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Available Snooze Times</span>
            </div>
            <div className="flex gap-2 mb-3">
              {[5, 15, 60].map((minutes) => (
                <div
                  key={minutes}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}
                </div>
              ))}
            </div>
            <p className="text-sm text-blue-700">
              After 3 snoozes, reminders become more urgent to help maintain your routine.
            </p>
          </div>
        </div>

        {/* Test Notification */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-pink-600" />
            Test Notification
          </h3>
          
          <div className="flex gap-4">
            <Button
              onClick={handleTestNotification}
              disabled={!isEnabled}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Send Test Notification
            </Button>
          </div>
          
          {!isEnabled && (
            <p className="text-sm text-gray-500">
              Enable notifications first to test them
            </p>
          )}
        </div>

        {/* Missed Pill Handling */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-pink-600" />
            Missed Pill Detection
          </h3>
          
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-orange-900">
                  Gentle follow-up after 30 minutes if no response
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-orange-900">
                  Supportive messaging with no judgment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-orange-900">
                  Option to log late intake or mark as missed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Capybara Wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-100"
        >
          <div className="flex items-start gap-3">
            <motion.img
              src="/flowercapybara.png"
              alt="Capybara wisdom"
              className="w-12 h-12 rounded-full"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div>
              <p className="text-sm font-medium text-pink-800 mb-1">
                Capybara Wisdom 🌸
              </p>
              <p className="text-sm text-pink-700">
                "The best reminder is one that feels like a gentle friend checking in. 
                Choose the style that brings you peace, not stress."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationSettings;
