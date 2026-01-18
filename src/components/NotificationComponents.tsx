import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, X, Pill } from 'lucide-react';
import { notificationService } from '../services/NotificationService';
import type { PillReminder } from '../services/NotificationService';

interface PillReminderToastProps {
  reminder: PillReminder;
  messages: {
    title: string;
    body: string;
    emoji: string;
  };
  onDismiss: () => void;
  visible: boolean;
}

export const PillReminderToast: React.FC<PillReminderToastProps> = ({
  reminder,
  messages,
  onDismiss,
  visible
}) => {
  const handlePillTaken = () => {
    notificationService.markPillTaken(reminder.id);
    onDismiss();
  };

  const handleSnooze = (minutes: number) => {
    notificationService.snoozeReminder(reminder.id, minutes);
    onDismiss();
  };

  const getStyleClasses = () => {
    switch (reminder.reminderStyle) {
      case 'cute':
        return {
          container: 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200',
          icon: 'from-pink-400 to-rose-400',
          accent: 'text-pink-700'
        };
      case 'gentle':
        return {
          container: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          icon: 'from-green-400 to-emerald-400',
          accent: 'text-green-700'
        };
      case 'urgent':
        return {
          container: 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200',
          icon: 'from-red-400 to-orange-400',
          accent: 'text-red-700'
        };
      default:
        return {
          container: 'bg-white border-gray-200',
          icon: 'from-gray-400 to-gray-500',
          accent: 'text-gray-700'
        };
    }
  };

  const styleClasses = getStyleClasses();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`max-w-md w-full shadow-lg rounded-2xl pointer-events-auto border-2 overflow-hidden ${styleClasses.container}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              {/* Icon */}
              <motion.div 
                className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${styleClasses.icon} rounded-full flex items-center justify-center`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Pill className="w-6 h-6 text-white" />
              </motion.div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <p className={`text-sm font-semibold ${styleClasses.accent} mb-1`}>
                  {messages.title}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {messages.body}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={handlePillTaken}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✨ Taken
                  </motion.button>
                  
                  <div className="flex gap-1">
                    <motion.button
                      onClick={() => handleSnooze(5)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Clock className="w-3 h-3" />
                      5m
                    </motion.button>
                    <motion.button
                      onClick={() => handleSnooze(15)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Clock className="w-3 h-3" />
                      15m
                    </motion.button>
                    <motion.button
                      onClick={() => handleSnooze(60)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Clock className="w-3 h-3" />
                      1h
                    </motion.button>
                  </div>
                </div>

                {/* Snooze indicator */}
                {reminder.snoozeCount > 0 && (
                  <motion.div 
                    className="mt-2 flex items-center gap-1 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Bell className="w-3 h-3" />
                    Snoozed {reminder.snoozeCount} time{reminder.snoozeCount > 1 ? 's' : ''}
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onDismiss}
                className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Progress bar for urgency */}
          {reminder.reminderStyle === 'urgent' && (
            <motion.div 
              className="h-1 bg-gradient-to-r from-red-400 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MissedPillToastProps {
  reminder: PillReminder;
  onTaken: () => void;
  onMissed: () => void;
  onDismiss: () => void;
  visible: boolean;
}

export const MissedPillToast: React.FC<MissedPillToastProps> = ({
  reminder,
  onTaken,
  onMissed,
  onDismiss,
  visible
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="max-w-md w-full bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg rounded-2xl pointer-events-auto border-2 border-orange-200 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start">
              <motion.div 
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-lg">💭</span>
              </motion.div>

              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-orange-900 mb-1">
                  Gentle check-in 🌸
                </p>
                <p className="text-sm text-orange-700 mb-3">
                  Did you take your {reminder.pillType}? No worries if you missed it - your capybara friend is here to support you!
                </p>

                <div className="flex gap-2">
                  <motion.button
                    onClick={onTaken}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✅ Just took it
                  </motion.button>
                  <motion.button
                    onClick={onMissed}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💔 Missed it
                  </motion.button>
                </div>
              </div>

              <motion.button
                onClick={onDismiss}
                className="flex-shrink-0 ml-2 p-1 text-orange-400 hover:text-orange-600 rounded-full hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to set up custom notification renderer
export const useNotificationRenderer = () => {
  React.useEffect(() => {
    // The notification service now handles rendering internally
    console.log('Notification system initialized');
  }, []);
};
