import { Toast } from './toast';

// Data persistence and sync utilities
export class DataSyncManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.storageKeys = {
      USER_DATA: 'loveyou_user_data',
      PILL_TRACKING: 'loveyou_pill_tracking',
      SETTINGS: 'loveyou_settings',
      SYNC_QUEUE: 'loveyou_sync_queue',
      LAST_SYNC: 'loveyou_last_sync'
    };
    
    this.initializeEventListeners();
    this.loadSyncQueue();
  }

  initializeEventListeners() {
    // Online/offline status tracking
    window.addEventListener('online', () => {
      this.isOnline = true;
      Toast.success('🦫✨ Back online! Syncing your data...');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      Toast.info('🦫💭 Offline mode - Your data will sync when reconnected');
    });

    // Auto-sync on visibility change (app focus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.processSyncQueue();
      }
    });
  }

  // Enhanced localStorage with error handling and compression
  setLocalData(key, data) {
    try {
      const timestamp = new Date().toISOString();
      const dataWithMeta = {
        data,
        timestamp,
        version: '1.0',
        capybara: '🦫'
      };
      
      const serialized = JSON.stringify(dataWithMeta);
      localStorage.setItem(key, serialized);
      
      // Log storage usage
      this.logStorageUsage();
      
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        Toast.error('🦫💾 Storage full! Cleaning old data...');
        this.cleanOldData();
        return this.setLocalData(key, data); // Retry after cleanup
      }
      
      Toast.error('🦫❌ Failed to save data locally');
      console.error('LocalStorage error:', error);
      return false;
    }
  }

  getLocalData(key) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return parsed.data || parsed; // Handle both old and new format
    } catch (error) {
      console.error('Error reading local data:', error);
      return null;
    }
  }

  // Clean old data to free up storage space
  cleanOldData() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Clean old pill tracking entries
      const pillData = this.getLocalData(this.storageKeys.PILL_TRACKING) || {};
      const cleanedPillData = {};
      
      Object.keys(pillData).forEach(date => {
        if (new Date(date) > oneWeekAgo) {
          cleanedPillData[date] = pillData[date];
        }
      });
      
      this.setLocalData(this.storageKeys.PILL_TRACKING, cleanedPillData);
      Toast.info('🦫🧹 Cleaned old data to free up space');
    } catch (error) {
      console.error('Error cleaning old data:', error);
    }
  }

  logStorageUsage() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      
      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      console.log(`🦫💾 LocalStorage usage: ${sizeInMB}MB`);
      
      // Warn if approaching 5MB limit
      if (totalSize > 4 * 1024 * 1024) {
        Toast.warning('🦫⚠️ Storage almost full - consider syncing data');
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  }

  // Add actions to sync queue for offline processing
  addToSyncQueue(action) {
    const queueItem = {
      id: Date.now() + Math.random(),
      action,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    
    this.syncQueue.push(queueItem);
    this.saveSyncQueue();
    
    if (this.isOnline) {
      this.processSyncQueue();
    } else {
      Toast.info('🦫📝 Action saved for later sync');
    }
  }

  loadSyncQueue() {
    try {
      const stored = localStorage.getItem(this.storageKeys.SYNC_QUEUE);
      this.syncQueue = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }

  saveSyncQueue() {
    try {
      localStorage.setItem(this.storageKeys.SYNC_QUEUE, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  // Process queued actions when online
  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    const queue = [...this.syncQueue];
    this.syncQueue = [];
    this.saveSyncQueue();

    for (const item of queue) {
      try {
        await this.executeAction(item.action);
        Toast.success(`🦫✅ Synced: ${item.action.type}`);
      } catch (error) {
        item.retryCount++;
        
        if (item.retryCount < 3) {
          this.syncQueue.push(item);
          Toast.warning(`🦫🔄 Retry ${item.retryCount}/3: ${item.action.type}`);
        } else {
          Toast.error(`🦫❌ Failed to sync: ${item.action.type}`);
        }
      }
    }

    this.saveSyncQueue();
    this.setLocalData(this.storageKeys.LAST_SYNC, new Date().toISOString());
  }

  async executeAction(action) {
    // Simulate API calls - replace with actual API endpoints
    switch (action.type) {
      case 'PILL_TAKEN':
        return await this.syncPillTaken(action.data);
      case 'USER_UPDATE':
        return await this.syncUserUpdate(action.data);
      case 'SETTINGS_UPDATE':
        return await this.syncSettingsUpdate(action.data);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  async syncPillTaken(data) {
    // Replace with actual API call
    const response = await fetch('/api/track-pill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to sync pill tracking');
    return response.json();
  }

  async syncUserUpdate(data) {
    // Replace with actual API call
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to sync user data');
    return response.json();
  }

  async syncSettingsUpdate(data) {
    // Replace with actual API call
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to sync settings');
    return response.json();
  }

  // Backup all user data
  createBackup() {
    try {
      const backup = {
        userData: this.getLocalData(this.storageKeys.USER_DATA),
        pillTracking: this.getLocalData(this.storageKeys.PILL_TRACKING),
        settings: this.getLocalData(this.storageKeys.SETTINGS),
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      const backupString = JSON.stringify(backup, null, 2);
      const blob = new Blob([backupString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `loveyou-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      Toast.success('🦫💾 Backup downloaded successfully!');
    } catch (error) {
      Toast.error('🦫❌ Failed to create backup');
      console.error('Backup error:', error);
    }
  }

  // Restore from backup
  async restoreBackup(file) {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      if (backup.userData) {
        this.setLocalData(this.storageKeys.USER_DATA, backup.userData);
      }
      if (backup.pillTracking) {
        this.setLocalData(this.storageKeys.PILL_TRACKING, backup.pillTracking);
      }
      if (backup.settings) {
        this.setLocalData(this.storageKeys.SETTINGS, backup.settings);
      }
      
      Toast.success('🦫✨ Backup restored successfully!');
      return true;
    } catch (error) {
      Toast.error('🦫❌ Failed to restore backup');
      console.error('Restore error:', error);
      return false;
    }
  }

  // Get sync status for UI display
  getSyncStatus() {
    const lastSync = this.getLocalData(this.storageKeys.LAST_SYNC);
    const queueLength = this.syncQueue.length;
    
    return {
      isOnline: this.isOnline,
      lastSync: lastSync ? new Date(lastSync) : null,
      pendingActions: queueLength,
      status: this.isOnline 
        ? (queueLength > 0 ? 'syncing' : 'synced')
        : 'offline'
    };
  }
}

// Create singleton instance
export const dataSync = new DataSyncManager();
