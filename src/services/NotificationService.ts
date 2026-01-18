import { toast } from 'react-hot-toast';

interface PillReminder {
  id: string;
  pillTime: string;
  pillType: string;
  userId: string;
  isActive: boolean;
  reminderStyle: 'cute' | 'gentle' | 'urgent';
  snoozeCount: number;
  lastSnoozed?: Date;
}

interface ReminderData {
  type: 'pill' | 'missed-pill';
  title: string;
  message: string;
  scheduledTime?: Date;
  date?: Date;
  userId: string;
  style: 'cute' | 'gentle' | 'urgent';
}

interface NotificationOptions {
  style: 'cute' | 'gentle' | 'urgent';
  onSnooze?: (duration: number) => void;
  onTaken?: () => void;
  onDismiss?: () => void;
}

class NotificationService {
  private reminders: Map<string, PillReminder> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  private missedTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private permission: NotificationPermission = 'default';

  constructor() {
    this.initializeNotifications();
  }

  // Initialize notification permissions
  async initializeNotifications(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      } else {
        this.permission = Notification.permission;
      }
      
      return this.permission === 'granted';
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  // Schedule pill reminder
  schedulePillReminder(reminder: Omit<PillReminder, 'id' | 'snoozeCount'>): string {
    const id = `pill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullReminder: PillReminder = {
      ...reminder,
      id,
      snoozeCount: 0
    };

    this.reminders.set(id, fullReminder);
    this.scheduleNotification(fullReminder);
    
    return id;
  }

  // Schedule the actual notification
  private scheduleNotification(reminder: PillReminder): void {
    const now = new Date();
    const [hours, minutes] = reminder.pillTime.split(':').map(Number);
    
    let scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      this.showPillReminder(reminder);
    }, timeUntilReminder);

    this.timeouts.set(reminder.id, timeoutId);
  }

  // Show pill reminder notification
  private showPillReminder(reminder: PillReminder): void {
    const messages = this.getReminderMessages(reminder.reminderStyle, reminder.pillType);
    
    // Browser notification
    if (this.permission === 'granted') {
      const notification = new Notification(messages.title, {
        body: messages.body,
        icon: '/flowercapybara.png',
        badge: '/flowercapybara.png',
        tag: reminder.id,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // Show custom toast notification
    toast.custom(() => (
      `${messages.emoji} ${messages.title}: ${messages.body}`
    ), {
      duration: 30000, // 30 seconds
      id: reminder.id
    });

    // Schedule missed pill check (30 minutes later)
    const missedTimeout = setTimeout(() => {
      this.checkMissedPill(reminder);
    }, 30 * 60 * 1000);

    this.missedTimeouts.set(reminder.id, missedTimeout);
  }

  // Check for missed pill
  private checkMissedPill(reminder: PillReminder): void {
    // If reminder is still active, it means pill wasn't taken
    if (this.reminders.has(reminder.id)) {
      const messages = this.getMissedPillMessages(reminder.reminderStyle);
      
      // Show missed pill notification
      if (this.permission === 'granted') {
        new Notification(messages.title, {
          body: messages.body,
          icon: '/flowercapybara.png',
          tag: `missed-${reminder.id}`,
          requireInteraction: true
        });
      }

      // Show gentle follow-up toast
      toast(messages.body, {
        duration: 10000,
        id: `missed-${reminder.id}`,
        icon: messages.emoji
      });
    }
  }

  // Mark pill as taken
  markPillTaken(reminderId: string): void {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return;

    // Clear any pending timeouts
    this.clearReminderTimeouts(reminderId);

    // Show success toast
    toast.success(`Great job! 💚 ${reminder.pillType} logged successfully`, {
      duration: 3000,
      icon: '✅',
    });

    // Log to backend (implement this based on your API)
    this.logPillIntake(reminder);

    // Schedule next day's reminder
    this.scheduleNextReminder(reminder);
  }

  // Snooze reminder
  snoozeReminder(reminderId: string, minutes: number): void {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return;

    reminder.snoozeCount++;
    reminder.lastSnoozed = new Date();

    // Clear current timeout
    this.clearReminderTimeouts(reminderId);

    // Show snooze confirmation
    toast(`⏰ Snoozed for ${minutes} minute${minutes > 1 ? 's' : ''}`, {
      duration: 2000,
      icon: '😴',
    });

    // Schedule snoozed reminder
    const snoozeTimeout = setTimeout(() => {
      this.showSnoozedReminder(reminder, minutes);
    }, minutes * 60 * 1000);

    this.timeouts.set(reminderId, snoozeTimeout);
  }

  // Show snoozed reminder (slightly more urgent)
  private showSnoozedReminder(reminder: PillReminder, snoozedMinutes: number): void {
    const style = reminder.snoozeCount >= 3 ? 'urgent' : reminder.reminderStyle;
    const messages = this.getReminderMessages(style, reminder.pillType);
    
    // Add snooze context to message
    const snoozeMessage = {
      ...messages,
      body: `${messages.body} (Snoozed ${snoozedMinutes}m ago)`
    };

    if (this.permission === 'granted') {
      new Notification(snoozeMessage.title, {
        body: snoozeMessage.body,
        icon: '/flowercapybara.png',
        tag: reminder.id,
        requireInteraction: true
      });
    }

    toast.custom(() => (
      `${messages.emoji} ${snoozeMessage.title}: ${snoozeMessage.body}`
    ), {
      duration: 30000,
      id: reminder.id
    });
  }

  // Dismiss/cancel a reminder
  dismissReminder(id: string): boolean {
    const reminder = this.reminders.get(id);
    if (!reminder) return false;

    this.clearReminderTimeouts(id);
    this.reminders.delete(id);
    return true;
  }

  // Show success notification
  showSuccessNotification(title: string, message: string): void {
    if (this.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/flowercapybara.png',
        tag: 'success-notification'
      });
    }

    toast.success(`${title}\n${message}`, {
      duration: 3000,
      id: 'success-toast'
    });
  }

  // Handle missed pill (public method)
  handleMissedPill(reminderData: ReminderData): void {
    const messages = this.getMissedPillMessages(reminderData.style || 'gentle');
    
    // Show missed pill notification
    if (this.permission === 'granted') {
      new Notification(messages.title, {
        body: messages.body,
        icon: '/flowercapybara.png',
        tag: `missed-pill-${reminderData.userId}`,
        requireInteraction: true
      });
    }

    // Show simple toast for missed pill
    toast(messages.body, {
      duration: 10000,
      id: `missed-pill-${reminderData.userId}`,
      icon: '🌿'
    });
  }

  // Clear reminder timeouts
  private clearReminderTimeouts(reminderId: string): void {
    const timeout = this.timeouts.get(reminderId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(reminderId);
    }

    const missedTimeout = this.missedTimeouts.get(reminderId);
    if (missedTimeout) {
      clearTimeout(missedTimeout);
      this.missedTimeouts.delete(reminderId);
    }
  }

  // Schedule next day's reminder
  private scheduleNextReminder(reminder: PillReminder): void {
    const nextReminder: PillReminder = {
      ...reminder,
      id: `pill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      snoozeCount: 0,
      lastSnoozed: undefined
    };

    this.reminders.set(nextReminder.id, nextReminder);
    this.scheduleNotification(nextReminder);
  }

  // Log pill intake (implement with your API)
  private async logPillIntake(reminder: PillReminder): Promise<void> {
    try {
      console.log('Logging pill intake:', {
        userId: reminder.userId,
        pillType: reminder.pillType,
        takenAt: new Date(),
        scheduledTime: reminder.pillTime
      });
    } catch (error) {
      console.error('Failed to log pill intake:', error);
    }
  }

  // Log missed pill (implement with your API)
  logMissedPill(reminder: PillReminder): void {
    try {
      console.log('Logging missed pill:', {
        userId: reminder.userId,
        pillType: reminder.pillType,
        missedAt: new Date(),
        scheduledTime: reminder.pillTime
      });
      
      toast('No worries! 💕 Your capybara friend believes in you. Tomorrow is a fresh start!', {
        duration: 4000,
        icon: '🌸',
      });
    } catch (error) {
      console.error('Failed to log missed pill:', error);
    }
  }

  // Update reminder style
  updateReminderStyle(reminderId: string, style: 'cute' | 'gentle' | 'urgent'): void {
    const reminder = this.reminders.get(reminderId);
    if (reminder) {
      reminder.reminderStyle = style;
      this.reminders.set(reminderId, reminder);
    }
  }

  // Cancel reminder
  cancelReminder(reminderId: string): void {
    this.clearReminderTimeouts(reminderId);
    this.reminders.delete(reminderId);
  }

  // Get all active reminders
  getActiveReminders(): PillReminder[] {
    return Array.from(this.reminders.values()).filter(r => r.isActive);
  }

  // Get messages based on reminder style
  private getReminderMessages(style: 'cute' | 'gentle' | 'urgent', pillType: string): { title: string; body: string; emoji: string } {
    const messages = {
      cute: {
        title: `Time for your ${pillType}! 💊`,
        body: `💕 Your capybara friend gently reminds you it's wellness time! Taking care of yourself is an act of self-love 🌸`,
        emoji: '🥰'
      },
      gentle: {
        title: `Gentle reminder 🌿`,
        body: `✨ A peaceful moment to take your ${pillType}. Your health journey is important and you're doing wonderfully`,
        emoji: '🕊️'
      },
      urgent: {
        title: `Important: Medication Time ⚠️`,
        body: `Please take your ${pillType} now to maintain your routine and health`,
        emoji: '🚨'
      }
    };

    return messages[style];
  }

  // Get missed pill messages
  private getMissedPillMessages(style: 'cute' | 'gentle' | 'urgent'): { title: string; body: string; emoji: string } {
    const messages = {
      cute: {
        title: `Oops! Missed pill reminder 💕`,
        body: `No worries! Your capybara friend is here to help. What would you like to do?`,
        emoji: '🌸'
      },
      gentle: {
        title: `Gentle check-in 🌿`,
        body: `It looks like you might have missed your pill. No judgment - what feels right for you today?`,
        emoji: '✨'
      },
      urgent: {
        title: `Missed medication alert ⚠️`,
        body: `Please review your medication status and take appropriate action.`,
        emoji: '🚨'
      }
    };

    return messages[style];
  }

  // Test notification (for settings)
  testNotification(style: 'cute' | 'gentle' | 'urgent'): void {
    const testMessages = this.getReminderMessages(style, 'Test Pill');
    
    if (this.permission === 'granted') {
      new Notification(testMessages.title, {
        body: testMessages.body,
        icon: '/flowercapybara.png',
      });
    }

    toast.success(`${testMessages.emoji} Test notification sent!`, {
      duration: 2000,
    });
  }
}

export const notificationService = new NotificationService();
export type { PillReminder, ReminderData, NotificationOptions };
