import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Setup from './components/Setup';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import CapybaraMascot from './components/CapybaraMascot';
import PWAStatus from './components/PWAStatus';
import DatabaseStatus from './components/DatabaseStatus';
import ReactBitsDemo from './components/MiladyDemo';
import BasicOfflineDemo from './components/BasicOfflineDemo';
import { ErrorBoundary } from './utils/errorHandling.jsx';
import { PageLoading } from './components/LoadingComponents';
// import './utils/createDemoAdmin.js'; // Auto-create demo admin for localStorage mode

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

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
              success: {
                iconTheme: {
                  primary: '#ec4899',
                  secondary: '#fce7f3',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fef2f2',
                },
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '2px solid #fca5a5',
                },
              },
            }}
          />

        {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
        
        <main className={isAuthenticated ? 'pt-16' : ''}>
          <Routes>
            <Route 
              path="/" 
              element={
                !isAuthenticated ? 
                <Landing /> : 
                <Navigate to="/dashboard" />
              } 
            />
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" />
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? 
                <Register onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" />
              } 
            />
            <Route 
              path="/setup" 
              element={
                isAuthenticated ? 
                <Setup user={user} onComplete={() => setShowSetup(false)} /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                <Dashboard user={user} /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/calendar" 
              element={
                isAuthenticated ? 
                <Calendar user={user} /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/settings" 
              element={
                isAuthenticated ? 
                <Settings user={user} /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/demo" 
              element={<ReactBitsDemo />} 
            />
            <Route 
              path="/offline-demo" 
              element={<BasicOfflineDemo />} 
            />
          </Routes>
        </main>

        {isAuthenticated && <CapybaraMascot />}
        <PWAStatus />
        <DatabaseStatus />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
