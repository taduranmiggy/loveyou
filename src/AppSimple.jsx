import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './utils/errorHandling.jsx';
import { PageLoading } from './components/LoadingComponents';

// Simple landing page for testing
const TestLanding = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-pink-800 mb-4">🦫 Welcome to Milady!</h1>
      <p className="text-pink-600 mb-6">Your capybara pill tracker</p>
      <div className="space-x-4">
        <a href="/login" className="bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-all">Login</a>
        <a href="/register" className="bg-pink-100 text-pink-800 px-6 py-3 rounded-full font-semibold hover:bg-pink-200 transition-all">Register</a>
      </div>
    </div>
  </div>
);

function App() {
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
            <Route path="/" element={<TestLanding />} />
            <Route path="/login" element={<div className="p-8 text-center">Login page coming soon 🦫</div>} />
            <Route path="/register" element={<div className="p-8 text-center">Register page coming soon 🦫</div>} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
