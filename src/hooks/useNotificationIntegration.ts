import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/NotificationService';

interface UseNotificationIntegrationOptions {
  enabled?: boolean;
  reminderStyle?: 'cute' | 'gentle' | 'urgent';
}

export const useNotificationIntegration = (options: UseNotificationIntegrationOptions = {}) => {
  const { user } = useAuth();
  const { enabled = true, reminderStyle = 'cute' } = options;
  const [isInitialized, setIsInitialized] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Initialize notifications on mount
  useEffect(() => {
    const initializeNotifications = async () => {
      if (!enabled) return;

      try {
        const hasPermission = await notificationService.initializeNotifications();
        setNotificationPermission(Notification.permission);
        setIsInitialized(hasPermission);
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, [enabled]);

  // Schedule daily pill reminders based on user's onboarding data
  useEffect(() => {
    if (!isInitialized || !user?.onboardingData?.pillTime) {
      return;
    }

    try {
      // Parse the pill time from user's onboarding data
      const pillTime = user.onboardingData.pillTime;
      let hours: number, minutes: number;

      if (typeof pillTime === 'string') {
        // Handle format like "08:30" or "8:30 AM"
        const timeMatch = pillTime.match(/(\d{1,2}):(\d{2})(\s*[AP]M)?/i);
        if (timeMatch) {
          hours = parseInt(timeMatch[1]);
          minutes = parseInt(timeMatch[2]);
          
          // Handle AM/PM format
          if (timeMatch[3]) {
            const isPM = timeMatch[3].toUpperCase().includes('PM');
            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
          }
        } else {
          // Fallback to 8:00 AM if parsing fails
          hours = 8;
          minutes = 0;
        }
      } else {
        // Fallback to 8:00 AM
        hours = 8;
        minutes = 0;
      }

      // Schedule the daily reminder
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      // Schedule the reminder
      const reminderId = notificationService.schedulePillReminder({
        pillTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        pillType: 'Daily Pill',
        userId: user.id,
        isActive: true,
        reminderStyle: reminderStyle
      });

      console.log(`Pill reminder scheduled with ID: ${reminderId}`);

    } catch (error) {
      console.error('Failed to schedule pill reminder:', error);
    }
  }, [isInitialized, user, reminderStyle]);

  // Handle pill intake logging
  const handlePillTaken = (date: Date = new Date()) => {
    try {
      // Cancel any active reminders for today
      const today = date.toISOString().split('T')[0];
      
      // This would typically make an API call to log the pill intake
      // For now, we'll just show a success notification
      console.log(`Pill intake logged for ${today}`);
      
      // Optionally show a success notification
      if (isInitialized) {
        notificationService.showSuccessNotification(
          '🎉 Great job!',
          'Pill taken successfully. Your capybara friend is proud! 🌸'
        );
      }

      return true;
    } catch (error) {
      console.error('Failed to log pill intake:', error);
      return false;
    }
  };

  // Handle missed pill detection
  const handleMissedPill = (date: Date) => {
    try {
      // Show gentle missed pill notification using the service
      notificationService.handleMissedPill({
        type: 'missed-pill',
        title: 'Gentle reminder 🌿',
        message: 'No worries if you missed your pill. What would you like to do?',
        date,
        userId: user?.id || '',
        style: 'gentle'
      });

      return true;
    } catch (error) {
      console.error('Failed to handle missed pill:', error);
      return false;
    }
  };

  // Schedule a custom reminder
  const scheduleReminder = (
    pillTime: string,
    pillType: string,
    style: 'cute' | 'gentle' | 'urgent' = 'cute'
  ) => {
    if (!isInitialized) return false;

    try {
      notificationService.schedulePillReminder({
        pillTime,
        pillType,
        userId: user?.id || '',
        isActive: true,
        reminderStyle: style
      });
      return true;
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
      return false;
    }
  };

  // Cancel a reminder
  const cancelReminder = (id: string) => {
    try {
      notificationService.cancelReminder(id);
      return true;
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
      return false;
    }
  };

  // Test notification
  const testNotification = (style: 'cute' | 'gentle' | 'urgent' = reminderStyle) => {
    if (!isInitialized) return false;

    try {
      notificationService.testNotification(style);
      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  };

  return {
    isInitialized,
    notificationPermission,
    handlePillTaken,
    handleMissedPill,
    scheduleReminder,
    cancelReminder,
    testNotification,
    // Helper functions
    hasPermission: notificationPermission === 'granted',
    isBlocked: notificationPermission === 'denied',
    needsPermission: notificationPermission === 'default'
  };
};
