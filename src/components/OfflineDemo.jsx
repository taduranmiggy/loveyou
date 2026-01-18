import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudOff, Download, Database, Sync } from 'lucide-react';
import { LoveYouButton, LoveYouCard, LoveYouInput, LoveYouProgress, LoveYouBadge } from './LoveYouComponents';
import { useOfflineStorage, useOfflinePillTracking } from '../hooks/usePWA';
import { dataSync } from '../utils/dataSync';
import { Toast } from '../utils/toast';

const OfflineDemo = () => {
  const [testData, setTestData] = useOfflineStorage('demo_test_data', '');
  const [syncCounter, setSyncCounter] = useState(0);
  const pillTracking = useOfflinePillTracking();
  
  const simulateOffline = () => {
    // Temporarily override navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    // Trigger offline event
    window.dispatchEvent(new Event('offline'));
    Toast.info('🦫📡 Simulating offline mode');
    
    // Restore online after 5 seconds
    setTimeout(() => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      });
      window.dispatchEvent(new Event('online'));
    }, 5000);
  };

  const testLocalStorage = () => {
    const testKey = 'loveyou_storage_test';
    const testValue = { 
      message: 'Hello from offline storage! 🦫',
      timestamp: new Date().toISOString(),
      random: Math.random()
    };
    
    const success = dataSync.setLocalData(testKey, testValue);
    
    if (success) {
      const retrieved = dataSync.getLocalData(testKey);
      Toast.success(`🦫💾 Storage test passed! Retrieved: ${retrieved.message}`);
    } else {
      Toast.error('🦫❌ Storage test failed');
    }
  };

  const addTestSyncAction = () => {
    setSyncCounter(prev => prev + 1);
    
    dataSync.addToSyncQueue({
      type: 'TEST_ACTION',
      data: {
        counter: syncCounter + 1,
        timestamp: new Date().toISOString(),
        message: `Test sync action #${syncCounter + 1}`
      }
    });
    
    Toast.info(`🦫📝 Added test action #${syncCounter + 1} to sync queue`);
  };

  const testPillTracking = () => {
    pillTracking.markPillTaken();
    Toast.success('🦫💊 Test pill marked as taken (offline capable)!');
  };

  const clearAllData = () => {
    localStorage.clear();
    Toast.success('🦫🧹 All local data cleared!');
    window.location.reload();
  };

  const downloadStorageReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      storageUsage: {},
      syncQueue: dataSync.syncQueue,
      pillData: pillTracking.pillData,
      totalLocalStorage: 0
    };

    // Calculate storage usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage[key].length;
        report.storageUsage[key] = {
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        };
        report.totalLocalStorage += size;
      }
    }

    report.totalLocalStorageMB = (report.totalLocalStorage / 1024 / 1024).toFixed(2);

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loveyou-storage-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    Toast.success('🦫📊 Storage report downloaded!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-pink-800 mb-4">
          🦫💾 Offline & Data Persistence Demo
        </h2>
        <p className="text-pink-600">
          Test offline capabilities, data sync, and local storage features
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connectivity Testing */}
        <MiladyCard>
          <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Connectivity Testing
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-pink-700">Status:</span>
              <MiladyBadge variant={navigator.onLine ? 'success' : 'danger'}>
                {navigator.onLine ? (
                  <>🟢 Online</>
                ) : (
                  <>🔴 Offline</>
                )}
              </MiladyBadge>
            </div>
            
            <MiladyButton
              variant="secondary"
              onClick={simulateOffline}
              leftIcon={<CloudOff className="w-4 h-4" />}
              className="w-full"
            >
              Simulate Offline (5s)
            </MiladyButton>
          </div>
        </MiladyCard>

        {/* Local Storage Testing */}
        <MiladyCard>
          <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Local Storage
          </h3>
          
          <div className="space-y-3">
            <MiladyInput
              label="Test Data"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder="Type something to test storage..."
            />
            
            <div className="flex gap-2">
              <MiladyButton
                variant="primary"
                onClick={testLocalStorage}
                size="small"
                className="flex-1"
              >
                Test Storage
              </MiladyButton>
              
              <MiladyButton
                variant="ghost"
                onClick={downloadStorageReport}
                size="small"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Report
              </MiladyButton>
            </div>
          </div>
        </MiladyCard>

        {/* Sync Queue Testing */}
        <MiladyCard>
          <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
            <Sync className="w-5 h-5" />
            Sync Queue
          </h3>
          
          <div className="space-y-3">
            <div className="bg-pink-50 rounded-lg p-3">
              <p className="text-sm text-pink-700">
                <strong>Queued Actions:</strong> {dataSync.syncQueue.length}
              </p>
              <p className="text-sm text-pink-700">
                <strong>Test Counter:</strong> {syncCounter}
              </p>
            </div>
            
            <MiladyButton
              variant="warning"
              onClick={addTestSyncAction}
              className="w-full"
            >
              Add Test Sync Action
            </MiladyButton>
          </div>
        </MiladyCard>

        {/* Pill Tracking Demo */}
        <MiladyCard>
          <h3 className="text-xl font-bold text-pink-800 mb-4">
            💊 Offline Pill Tracking
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-pink-700">Current Streak:</span>
                <span className="font-bold text-pink-800">{pillTracking.getStreak} days</span>
              </div>
              
              <MiladyProgress 
                value={pillTracking.getStreak} 
                max={21} 
                label="3-Week Goal"
              />
              
              <div className="flex justify-between text-xs text-pink-600">
                <span>Total Pills: {pillTracking.totalTaken}</span>
                <span>Offline Ready: ✅</span>
              </div>
            </div>
            
            <MiladyButton
              variant="success"
              onClick={testPillTracking}
              className="w-full"
            >
              🦫💊 Mark Test Pill Taken
            </MiladyButton>
          </div>
        </MiladyCard>
      </div>

      {/* Storage Statistics */}
      <MiladyCard>
        <h3 className="text-xl font-bold text-pink-800 mb-4">📊 Storage Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {Object.keys(localStorage).length}
            </div>
            <div className="text-sm text-pink-700">Stored Items</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {dataSync.syncQueue.length}
            </div>
            <div className="text-sm text-pink-700">Sync Queue</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {Object.keys(pillTracking.pillData).length}
            </div>
            <div className="text-sm text-pink-700">Pill Records</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {navigator.onLine ? '🟢' : '🔴'}
            </div>
            <div className="text-sm text-pink-700">Connection</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-pink-200">
          <MiladyButton
            variant="danger"
            onClick={clearAllData}
            className="w-full"
          >
            🗑️ Clear All Local Data (Reset Demo)
          </MiladyButton>
        </div>
      </MiladyCard>

      {/* Instructions */}
      <MiladyCard className="bg-pink-50">
        <h3 className="text-lg font-bold text-pink-800 mb-3">🦫📖 How to Test Offline Features</h3>
        <div className="text-sm text-pink-700 space-y-2">
          <p>1. <strong>Type in the test data field</strong> - it automatically saves to localStorage</p>
          <p>2. <strong>Click "Simulate Offline"</strong> - watch the status change and try actions</p>
          <p>3. <strong>Add sync actions</strong> - they queue up when offline and sync when online</p>
          <p>4. <strong>Mark pills taken</strong> - works offline and syncs later</p>
          <p>5. <strong>Open DevTools → Application → Local Storage</strong> to see data</p>
          <p>6. <strong>Try refreshing</strong> - all data persists!</p>
        </div>
      </MiladyCard>
    </div>
  );
};

export default OfflineDemo;
