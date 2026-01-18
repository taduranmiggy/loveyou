import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './utils/errorHandling.jsx';
import { PageLoading } from './components/LoadingComponents';

// Minimal test component
const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-pink-800 mb-4">
          🦫 Milady Test Mode
        </h1>
        <p className="text-pink-600 text-lg">
          Basic app structure is working!
        </p>
      </div>
    </div>
  );
};

function AppTest() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <PageLoading message="Loading your capybara companion..." />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200">
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#fce7f3',
                color: '#831843',
                border: '2px solid #f9a8d4',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '500'
              },
              duration: 4000,
            }}
          />
          <Routes>
            <Route path="*" element={<TestComponent />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default AppTest;
