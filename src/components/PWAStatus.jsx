import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, RefreshCw, Share2, Bell, Save, Upload, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { MiladyButton, MiladyCard, MiladyBadge } from './MiladyComponents';
import { Toast } from '../utils/toast';

const PWAStatus = () => {
  const {
    canInstall,
    isInstalled,
    installApp,
    updateAvailable,
    updateApp,
    isOnline,
    syncStatus,
    shareApp,
    requestNotificationPermission,
    createBackup,
    restoreBackup
  } = usePWA();

  const [showDetails, setShowDetails] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);

  const handleRestoreFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRestoreFile(file);
    }
  };

  const handleRestore = async () => {
    if (restoreFile) {
      const success = await restoreBackup(restoreFile);
      if (success) {
        setRestoreFile(null);
        // Reset file input
        document.getElementById('restore-input').value = '';
      }
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'danger';
    if (syncStatus.pendingActions > 0) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus.pendingActions > 0) return `${syncStatus.pendingActions} pending`;
    return 'Synced';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (syncStatus.pendingActions > 0) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return <Wifi className="w-4 h-4" />;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Status Badge */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Main Status */}
        <motion.button
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
            transition-all duration-300 cursor-pointer
            ${isOnline 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
            }
          `}
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </motion.button>

        {/* Install Badge */}
        <AnimatePresence>
          {canInstall && !isInstalled && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <MiladyBadge
                variant="primary"
                className="cursor-pointer animate-pulse"
                onClick={installApp}
              >
                📱 Install App
              </MiladyBadge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Update Badge */}
        <AnimatePresence>
          {updateAvailable && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <MiladyBadge
                variant="warning"
                className="cursor-pointer animate-bounce"
                onClick={updateApp}
              >
                🔄 Update
              </MiladyBadge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Detailed PWA Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed bottom-20 right-4 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <MiladyCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-pink-800 flex items-center gap-2">
                  🦫 PWA Status
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-pink-600 hover:text-pink-800 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Connection Status */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pink-700">Connection</span>
                  <MiladyBadge variant={isOnline ? 'success' : 'danger'}>
                    {isOnline ? '🟢 Online' : '🔴 Offline'}
                  </MiladyBadge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-pink-700">Sync Status</span>
                  <MiladyBadge variant={getStatusColor()}>
                    {getStatusText()}
                  </MiladyBadge>
                </div>

                {syncStatus.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pink-700">Last Sync</span>
                    <span className="text-xs text-pink-600">
                      {new Date(syncStatus.lastSync).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              {/* PWA Actions */}
              <div className="space-y-2">
                {/* Install App */}
                {canInstall && !isInstalled && (
                  <MiladyButton
                    variant="primary"
                    size="small"
                    className="w-full"
                    leftIcon={<Smartphone className="w-4 h-4" />}
                    onClick={installApp}
                  >
                    Install as App
                  </MiladyButton>
                )}

                {/* Update App */}
                {updateAvailable && (
                  <MiladyButton
                    variant="success"
                    size="small"
                    className="w-full"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={updateApp}
                  >
                    Update Available
                  </MiladyButton>
                )}

                {/* Enable Notifications */}
                <MiladyButton
                  variant="secondary"
                  size="small"
                  className="w-full"
                  leftIcon={<Bell className="w-4 h-4" />}
                  onClick={requestNotificationPermission}
                >
                  Enable Notifications
                </MiladyButton>

                {/* Share App */}
                <MiladyButton
                  variant="ghost"
                  size="small"
                  className="w-full"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  onClick={shareApp}
                >
                  Share Milady
                </MiladyButton>

                {/* Backup Section */}
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-pink-600 mb-2">Data Backup</p>
                  
                  <div className="flex gap-2">
                    <MiladyButton
                      variant="secondary"
                      size="small"
                      leftIcon={<Save className="w-4 h-4" />}
                      onClick={createBackup}
                      className="flex-1"
                    >
                      Backup
                    </MiladyButton>
                    
                    <div className="flex-1">
                      <input
                        id="restore-input"
                        type="file"
                        accept=".json"
                        onChange={handleRestoreFile}
                        className="hidden"
                      />
                      <MiladyButton
                        variant="ghost"
                        size="small"
                        leftIcon={<Upload className="w-4 h-4" />}
                        onClick={() => document.getElementById('restore-input').click()}
                        className="w-full"
                      >
                        Restore
                      </MiladyButton>
                    </div>
                  </div>

                  {restoreFile && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <div className="text-xs text-pink-600 mb-1">
                        Selected: {restoreFile.name}
                      </div>
                      <MiladyButton
                        variant="success"
                        size="small"
                        onClick={handleRestore}
                        className="w-full"
                      >
                        Restore Backup
                      </MiladyButton>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* PWA Info */}
              <div className="mt-4 pt-3 border-t">
                <div className="text-xs text-pink-600 space-y-1">
                  <p>• Data syncs automatically when online</p>
                  <p>• App works offline with cached data</p>
                  <p>• Notifications require permission</p>
                  <p>• Regular backups recommended 🦫</p>
                </div>
              </div>
            </MiladyCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PWAStatus;
