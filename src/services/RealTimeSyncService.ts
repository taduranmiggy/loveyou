import React from 'react';

interface SocketLike {
  connected: boolean;
  disconnect(): void;
  emit(event: string, ...args: any[]): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

// Mock socket implementation for now - replace with actual socket.io when available
class MockSocket implements SocketLike {
  connected = false;
  
  disconnect() {
    this.connected = false;
  }
  
  emit(event: string, ...args: any[]) {
    console.log('Mock socket emit:', event, args);
  }
  
  on(event: string, _callback: (...args: any[]) => void) {
    console.log('Mock socket on:', event);
  }
}

interface SyncData {
  userId: string;
  type: 'pill' | 'mood' | 'cycle' | 'insights' | 'settings';
  data: any;
  timestamp: number;
  deviceId: string;
}

interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
}

export class RealTimeSyncService {
  private static instance: RealTimeSyncService;
  private socket: SocketLike | null = null;
  private syncQueue: SyncData[] = [];
  private listeners: Map<string, Function[]> = new Map();
  private syncStatus: SyncStatus = {
    isConnected: false,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false
  };
  private deviceId: string;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    this.deviceId = this.generateDeviceId();
    this.initializeOfflineStorage();
    this.setupNetworkListeners();
  }

  static getInstance(): RealTimeSyncService {
    if (!RealTimeSyncService.instance) {
      RealTimeSyncService.instance = new RealTimeSyncService();
    }
    return RealTimeSyncService.instance;
  }

  // Initialize connection
  async connect(userId: string, _serverUrl?: string): Promise<void> {
    this.userId = userId;
    
    if (this.socket?.connected) {
      await this.disconnect();
    }

    try {
      // For now, use mock socket - replace with actual socket.io implementation
      console.log('Connecting to sync service...');
      this.socket = new MockSocket();
      this.socket.connected = true; // Mock connection

      this.setupSocketListeners();
      
      return new Promise((resolve) => {
        // Mock successful connection
        setTimeout(() => {
          this.syncStatus.isConnected = true;
          this.reconnectAttempts = 0;
          this.processSyncQueue();
          this.emit('connectionStatusChanged', this.syncStatus);
          resolve();
        }, 100);
      });
    } catch (error) {
      console.error('Failed to connect to sync service:', error);
      throw error;
    }
  }

  // Disconnect from service
  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.syncStatus.isConnected = false;
    this.emit('connectionStatusChanged', this.syncStatus);
  }

  // Sync data across devices
  async syncData(type: SyncData['type'], data: any): Promise<void> {
    const syncItem: SyncData = {
      userId: this.userId!,
      type,
      data,
      timestamp: Date.now(),
      deviceId: this.deviceId
    };

    // Add to local queue
    this.syncQueue.push(syncItem);
    this.syncStatus.pendingChanges = this.syncQueue.length;
    
    // Store in IndexedDB for offline persistence
    await this.storeOfflineData(syncItem);

    // Try to sync immediately if connected
    if (this.syncStatus.isConnected && this.socket) {
      await this.sendSyncData(syncItem);
    }

    this.emit('syncStatusChanged', this.syncStatus);
  }

  // Get sync status
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Manual sync trigger
  async forcSync(): Promise<void> {
    if (!this.syncStatus.isConnected || !this.socket) {
      throw new Error('Not connected to sync service');
    }

    this.syncStatus.syncInProgress = true;
    this.emit('syncStatusChanged', this.syncStatus);

    try {
      // Get all offline data
      const offlineData = await this.getOfflineData();
      
      for (const item of offlineData) {
        await this.sendSyncData(item);
      }

      // Request full sync from server
      this.socket.emit('requestFullSync', {
        userId: this.userId,
        deviceId: this.deviceId,
        lastSync: this.syncStatus.lastSync
      });

    } finally {
      this.syncStatus.syncInProgress = false;
      this.emit('syncStatusChanged', this.syncStatus);
    }
  }

  // Subscribe to events
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Setup socket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('disconnect', () => {
      this.syncStatus.isConnected = false;
      this.emit('connectionStatusChanged', this.syncStatus);
      this.handleReconnection();
    });

    this.socket.on('dataSync', (data: SyncData) => {
      // Received data from another device
      this.handleIncomingSync(data);
    });

    this.socket.on('syncComplete', (data: { success: boolean; timestamp: number }) => {
      if (data.success) {
        this.syncStatus.lastSync = new Date(data.timestamp);
        this.syncStatus.pendingChanges = Math.max(0, this.syncStatus.pendingChanges - 1);
        this.emit('syncStatusChanged', this.syncStatus);
      }
    });

    this.socket.on('fullSyncData', (data: SyncData[]) => {
      // Received full sync data from server
      this.handleFullSync(data);
    });

    this.socket.on('syncError', (error: any) => {
      console.error('Sync error:', error);
      this.emit('syncError', error);
    });

    // Ping/pong for connection health
    this.socket.on('ping', () => {
      this.socket!.emit('pong');
    });
  }

  // Handle incoming sync data from other devices
  private async handleIncomingSync(data: SyncData): Promise<void> {
    // Don't sync our own data back to us
    if (data.deviceId === this.deviceId) {
      return;
    }

    // Apply the changes locally
    try {
      await this.applyIncomingData(data);
      this.emit('dataReceived', data);
    } catch (error) {
      console.error('Failed to apply incoming sync data:', error);
    }
  }

  // Handle full sync from server
  private async handleFullSync(data: SyncData[]): Promise<void> {
    try {
      // Filter out our own device data to avoid conflicts
      const externalData = data.filter(item => item.deviceId !== this.deviceId);
      
      for (const item of externalData) {
        await this.applyIncomingData(item);
      }

      this.syncStatus.lastSync = new Date();
      this.emit('fullSyncComplete', externalData);
    } catch (error) {
      console.error('Failed to handle full sync:', error);
    }
  }

  // Apply incoming data to local storage
  private async applyIncomingData(data: SyncData): Promise<void> {
    switch (data.type) {
      case 'pill':
        await this.updateLocalPillData(data.data);
        break;
      case 'mood':
        await this.updateLocalMoodData(data.data);
        break;
      case 'cycle':
        await this.updateLocalCycleData(data.data);
        break;
      case 'insights':
        await this.updateLocalInsightsData(data.data);
        break;
      case 'settings':
        await this.updateLocalSettingsData(data.data);
        break;
    }
  }

  // Send sync data to server
  private async sendSyncData(data: SyncData): Promise<void> {
    if (!this.socket || !this.syncStatus.isConnected) {
      return;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Sync timeout'));
      }, 10000);

      this.socket!.emit('syncData', data, (response: any) => {
        clearTimeout(timeout);
        
        if (response.success) {
          // Remove from local queue
          const index = this.syncQueue.findIndex(item => 
            item.timestamp === data.timestamp && item.type === data.type
          );
          if (index > -1) {
            this.syncQueue.splice(index, 1);
          }
          
          // Remove from offline storage
          this.removeOfflineData(data);
          
          resolve();
        } else {
          reject(new Error(response.error || 'Sync failed'));
        }
      });
    });
  }

  // Process the sync queue
  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    const queueCopy = [...this.syncQueue];
    
    for (const item of queueCopy) {
      try {
        await this.sendSyncData(item);
      } catch (error) {
        console.error('Failed to sync item:', error);
        // Item remains in queue for retry
      }
    }

    this.syncStatus.pendingChanges = this.syncQueue.length;
    this.emit('syncStatusChanged', this.syncStatus);
  }

  // Handle reconnection attempts
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    setTimeout(() => {
      if (this.userId && !this.syncStatus.isConnected) {
        console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect(this.userId).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  // Setup network listeners for offline/online detection
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('Network online - attempting to reconnect');
      if (this.userId && !this.syncStatus.isConnected) {
        this.connect(this.userId).catch(console.error);
      }
    });

    window.addEventListener('offline', () => {
      console.log('Network offline');
      this.syncStatus.isConnected = false;
      this.emit('connectionStatusChanged', this.syncStatus);
    });
  }

  // Generate unique device ID
  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('loveyou_device_id');
    
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('loveyou_device_id', deviceId);
    }
    
    return deviceId;
  }

  // Initialize IndexedDB for offline storage
  private async initializeOfflineStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LoveYouSyncDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          const store = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  // Store data offline
  private async storeOfflineData(data: SyncData): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    await new Promise((resolve, reject) => {
      const request = store.add({ ...data, id: undefined });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Get offline data
  private async getOfflineData(): Promise<SyncData[]> {
    const db = await this.openDB();
    const transaction = db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Remove offline data
  private async removeOfflineData(data: SyncData): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    // Find and delete the matching item
    const index = store.index('timestamp');
    const request = index.openCursor(data.timestamp);
    
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        if (cursor.value.type === data.type && cursor.value.deviceId === data.deviceId) {
          cursor.delete();
        } else {
          cursor.continue();
        }
      }
    };
  }

  // Open IndexedDB
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LoveYouSyncDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Data update methods (these would integrate with your existing data layer)
  private async updateLocalPillData(data: any): Promise<void> {
    // Update local pill data
    console.log('Updating local pill data:', data);
    // Integrate with your pill tracking service
  }

  private async updateLocalMoodData(data: any): Promise<void> {
    // Update local mood data
    console.log('Updating local mood data:', data);
    // Integrate with your mood tracking service
  }

  private async updateLocalCycleData(data: any): Promise<void> {
    // Update local cycle data
    console.log('Updating local cycle data:', data);
    // Integrate with your cycle tracking service
  }

  private async updateLocalInsightsData(data: any): Promise<void> {
    // Update local insights data
    console.log('Updating local insights data:', data);
    // Integrate with your AI insights service
  }

  private async updateLocalSettingsData(data: any): Promise<void> {
    // Update local settings data
    console.log('Updating local settings data:', data);
    // Integrate with your settings service
  }
}

// React hook for using the sync service
export const useRealTimeSync = () => {
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false
  });

  const syncService = RealTimeSyncService.getInstance();

  React.useEffect(() => {
    const handleStatusChange = (status: SyncStatus) => {
      setSyncStatus(status);
    };

    syncService.on('syncStatusChanged', handleStatusChange);
    syncService.on('connectionStatusChanged', handleStatusChange);

    // Get initial status
    setSyncStatus(syncService.getSyncStatus());

    return () => {
      syncService.off('syncStatusChanged', handleStatusChange);
      syncService.off('connectionStatusChanged', handleStatusChange);
    };
  }, [syncService]);

  const syncData = async (type: SyncData['type'], data: any) => {
    await syncService.syncData(type, data);
  };

  const forceSync = async () => {
    await syncService.forcSync();
  };

  const connect = async (userId: string) => {
    await syncService.connect(userId);
  };

  const disconnect = async () => {
    await syncService.disconnect();
  };

  return {
    syncStatus,
    syncData,
    forceSync,
    connect,
    disconnect
  };
};

export default RealTimeSyncService;
