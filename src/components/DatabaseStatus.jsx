import React from 'react';
import { api } from '../utils/api.js';

const DatabaseStatus = () => {
  try {
    const databaseMode = api.getDatabaseMode();
    
    return (
      <div className={`fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
        databaseMode === 'realtime' 
          ? 'bg-green-100 text-green-800 border-2 border-green-200' 
          : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200'
      }`}>
        {databaseMode === 'realtime' ? (
          <div className="flex items-center gap-2">
            🔥 <span>Firebase Active</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            💾 <span>Offline Mode</span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('DatabaseStatus error:', error);
    return (
      <div className="fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium shadow-lg bg-red-100 text-red-800 border-2 border-red-200">
        <div className="flex items-center gap-2">
          ⚠️ <span>Status Error</span>
        </div>
      </div>
    );
  }
};

export default DatabaseStatus;
