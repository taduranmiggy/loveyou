import React from 'react';

const DebugApp = () => {
  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-pink-800 mb-4">
          Debug Mode 🦫
        </h1>
        <p className="text-pink-600">
          If you can see this, React is working fine!
        </p>
      </div>
    </div>
  );
};

export default DebugApp;
