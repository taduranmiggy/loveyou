import React from 'react';

const SimpleOfflineDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-800 mb-4">
          🦫💾 Offline Demo - Simple Version
        </h1>
        <p className="text-pink-600 mb-8">
          Testing if the component renders...
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Basic Test</h2>
          <p className="text-pink-600">
            If you can see this, the component is working! 🎉
          </p>
          
          <div className="mt-4">
            <button 
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
              onClick={() => alert('Button clicked! 🦫')}
            >
              Test Button
            </button>
          </div>
          
          <div className="mt-4 text-sm text-pink-500">
            <p>• Navigator online: {navigator.onLine ? '✅ Online' : '❌ Offline'}</p>
            <p>• LocalStorage available: {typeof localStorage !== 'undefined' ? '✅ Yes' : '❌ No'}</p>
            <p>• Service Worker supported: {'serviceWorker' in navigator ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleOfflineDemo;
