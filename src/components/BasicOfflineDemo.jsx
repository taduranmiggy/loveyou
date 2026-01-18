import React, { useState } from 'react';

const BasicOfflineDemo = () => {
  const [testData, setTestData] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const testLocalStorage = () => {
    try {
      const testKey = 'milady_test';
      const testValue = { message: 'Hello Capybara! 🦫', timestamp: new Date().toISOString() };
      
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      
      alert(`✅ Storage test passed!\nSaved: ${testValue.message}\nRetrieved: ${retrieved.message}`);
    } catch (error) {
      alert(`❌ Storage test failed: ${error.message}`);
    }
  };

  const saveTestData = () => {
    localStorage.setItem('milady_user_test', testData);
    alert('🦫 Data saved to localStorage!');
  };

  const loadTestData = () => {
    const saved = localStorage.getItem('milady_user_test');
    if (saved) {
      setTestData(saved);
      alert('🦫 Data loaded from localStorage!');
    } else {
      alert('🦫 No saved data found');
    }
  };

  const simulateOffline = () => {
    alert('🦫 In a real app, this would show how pill tracking works offline!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-800 mb-4">
            🦫💾 Basic Offline Demo
          </h1>
          <p className="text-pink-600 text-lg">
            Testing data persistence and offline capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
            <h3 className="text-xl font-bold text-pink-800 mb-4">
              📡 Connection Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-pink-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOnline 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isOnline ? '🟢 Online' : '🔴 Offline'}
                </span>
              </div>
              <p className="text-sm text-pink-600">
                Try disabling your internet connection to test offline mode!
              </p>
            </div>
          </div>

          {/* Storage Test */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
            <h3 className="text-xl font-bold text-pink-800 mb-4">
              💾 Storage Test
            </h3>
            <div className="space-y-3">
              <button
                onClick={testLocalStorage}
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Test LocalStorage
              </button>
              <p className="text-sm text-pink-600">
                Click to test if data can be saved and retrieved
              </p>
            </div>
          </div>

          {/* Data Persistence */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200 md:col-span-2">
            <h3 className="text-xl font-bold text-pink-800 mb-4">
              📝 Data Persistence Test
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Test Data (saves automatically):
                </label>
                <input
                  type="text"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  placeholder="Type something here..."
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={saveTestData}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  💾 Save Data
                </button>
                <button
                  onClick={loadTestData}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📂 Load Data
                </button>
                <button
                  onClick={simulateOffline}
                  className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  🦫 Simulate Pill Tracking
                </button>
              </div>
            </div>
          </div>

          {/* Browser Capabilities */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200 md:col-span-2">
            <h3 className="text-xl font-bold text-pink-800 mb-4">
              🔧 Browser Capabilities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {typeof localStorage !== 'undefined' ? '✅' : '❌'}
                </div>
                <div className="text-pink-700">LocalStorage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {'serviceWorker' in navigator ? '✅' : '❌'}
                </div>
                <div className="text-pink-700">Service Worker</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {'Notification' in window ? '✅' : '❌'}
                </div>
                <div className="text-pink-700">Notifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {navigator.onLine ? '🟢' : '🔴'}
                </div>
                <div className="text-pink-700">Online Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-pink-50 rounded-2xl p-6 border-2 border-pink-200">
          <h3 className="text-lg font-bold text-pink-800 mb-3">
            🦫📖 How to Test Offline Features
          </h3>
          <div className="text-sm text-pink-700 space-y-2">
            <p>1. <strong>Type in the data field</strong> - it demonstrates persistent input</p>
            <p>2. <strong>Click "Save Data"</strong> - stores to localStorage</p>
            <p>3. <strong>Click "Load Data"</strong> - retrieves from localStorage</p>
            <p>4. <strong>Disable internet</strong> - watch the status change to offline</p>
            <p>5. <strong>Refresh the page</strong> - saved data should persist!</p>
            <p>6. <strong>Check DevTools → Application → Local Storage</strong> to see stored data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicOfflineDemo;
