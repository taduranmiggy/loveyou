import { useState, useEffect } from 'react';
import { Toast } from '../utils/toast';
import { dataSync } from '../utils/dataSync';

// PWA utilities hook
export const usePWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState(dataSync.getSyncStatus());
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      Toast.info('🦫📱 LoveYou can be installed as an app!');
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      Toast.success('🦫✨ LoveYou installed successfully!');
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus(dataSync.getSyncStatus());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(dataSync.getSyncStatus());
    };

    // Listen for service worker updates
    const handleServiceWorkerUpdate = () => {
      setUpdateAvailable(true);
      Toast.info('🦫🔄 App update available! Refresh to update.');
    };

    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service worker registration and update detection
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Periodic sync status updates
    const statusInterval = setInterval(() => {
      setSyncStatus(dataSync.getSyncStatus());
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(statusInterval);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('🦫✅ Service Worker registered:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
          }
        });
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, message } = event.data;
        
        switch (type) {
          case 'BACKGROUND_SYNC':
            dataSync.processSyncQueue();
            break;
          case 'PILL_TAKEN':
            // Handle pill taken from notification
            handlePillTakenFromNotification(event.data.timestamp);
            break;
          default:
            console.log('🦫📬 Service Worker message:', event.data);
        }
      });

    } catch (error) {
      console.error('🦫❌ Service Worker registration failed:', error);
    }
  };

  const handlePillTakenFromNotification = (timestamp) => {
    // Add pill taken action to sync queue
    dataSync.addToSyncQueue({
      type: 'PILL_TAKEN',
      data: {
        date: timestamp.split('T')[0],
        time: timestamp,
        source: 'notification'
      }
    });
    
    Toast.success('🦫💊 Pill marked as taken from notification!');
  };

  const installApp = async () => {
    if (!installPrompt) {
      Toast.warning('🦫📱 Installation not available');
      return;
    }

    try {
      const result = await installPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        Toast.success('🦫🎉 Installing LoveYou...');
      } else {
        Toast.info('🦫💭 Installation cancelled');
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('🦫❌ Installation error:', error);
      Toast.error('🦫❌ Installation failed');
    }
  };

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
      
      // Reload page to activate new service worker
      window.location.reload();
    }
  };

  const shareApp = async () => {
    const shareData = {
        title: 'LoveYou - Contraceptive Pill Tracker',
      text: 'Track your contraceptive pills with a cute capybara companion! 🦫💕',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        Toast.success('🦫📋 Thanks for sharing LoveYou!');
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        Toast.success('🦫📋 Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('🦫❌ Share error:', error);
        Toast.error('🦫❌ Sharing failed');
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      Toast.warning('🦫📢 Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      Toast.warning('🦫🚫 Notifications are blocked. Enable in browser settings.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        Toast.success('🦫🔔 Notifications enabled!');
        
        // Show test notification
        new Notification('LoveYou Notifications Ready! 🦫', {
          body: 'You\'ll receive pill reminders and streak celebrations!',
          icon: '/icon-192.png',
          badge: '/badge-72.png'
        });
        
        return true;
      } else {
        Toast.info('🦫💭 Notifications not enabled');
        return false;
      }
    } catch (error) {
      console.error('🦫❌ Notification permission error:', error);
      Toast.error('🦫❌ Failed to enable notifications');
      return false;
    }
  };

  const createBackup = () => {
    dataSync.createBackup();
  };

  const restoreBackup = (file) => {
    return dataSync.restoreBackup(file);
  };

  return {
    // Installation
    canInstall: !!installPrompt,
    isInstalled,
    installApp,
    
    // Updates
    updateAvailable,
    updateApp,
    
    // Connectivity
    isOnline,
    syncStatus,
    
    // Sharing
    shareApp,
    
    // Notifications
    requestNotificationPermission,
    
    // Backup/Restore
    createBackup,
    restoreBackup,
    
    // PWA capabilities
    hasPWAFeatures: 'serviceWorker' in navigator && 'PushManager' in window
  };
};

// Offline storage hook for components
export const useOfflineStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return dataSync.getLocalData(key) || initialValue;
  });

  const updateValue = (newValue) => {
    setValue(newValue);
    dataSync.setLocalData(key, newValue);
  };

  return [value, updateValue];
};

// Pill tracking with offline support
export const useOfflinePillTracking = () => {
  const [pillData, setPillData] = useOfflineStorage(dataSync.storageKeys.PILL_TRACKING, {});
  
  const markPillTaken = (date = new Date().toISOString().split('T')[0]) => {
    const newData = {
      ...pillData,
      [date]: {
        taken: true,
        timestamp: new Date().toISOString(),
        synced: false
      }
    };
    
    setPillData(newData);
    
    // Add to sync queue
    dataSync.addToSyncQueue({
      type: 'PILL_TAKEN',
      data: {
        date,
        timestamp: new Date().toISOString()
      }
    });
    
    Toast.success('🦫💊 Pill tracked! Will sync when online.');
  };

  const getStreak = () => {
    const dates = Object.keys(pillData)
      .filter(date => pillData[date].taken)
      .sort()
      .reverse();
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);
    
    for (const date of dates) {
      const checkDate = currentDate.toISOString().split('T')[0];
      
      if (date === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    pillData,
    markPillTaken,
    getStreak: getStreak(),
    totalTaken: Object.keys(pillData).filter(date => pillData[date].taken).length
  };
};
