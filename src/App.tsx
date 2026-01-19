import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import NotificationRenderer from './components/NotificationRenderer';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import DatabaseViewer from './pages/DatabaseViewer';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Services from './pages/Services';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AIInsightsPage from './pages/AIInsightsPage';

function App() {
  const shouldReduceMotion = useReducedMotion();

  const floatingAnimation = shouldReduceMotion
    ? {} 
    : {
        animate: { y: [-2, 2, -2] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
      };

  const rotatingAnimation = shouldReduceMotion
    ? {}
    : {
        animate: { rotate: 360 },
        transition: { duration: 20, repeat: Infinity, ease: "linear" as const }
      };

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
              <Header />
              
              <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <motion.div
                className="absolute top-20 left-10 text-pink-200 opacity-60"
                {...rotatingAnimation}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <motion.div
                className="absolute top-40 right-20 text-rose-200 opacity-60"
                {...floatingAnimation}
              >
                <Heart className="w-5 h-5" />
              </motion.div>
              <motion.div
                className="absolute bottom-32 left-16 text-pink-300 opacity-50"
                {...floatingAnimation}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            </div>

            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<Services />} />
                
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requireOnboarding>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute requireOnboarding>
                      <CalendarPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute requireOnboarding>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/database" 
                  element={
                    <ProtectedRoute>
                      <DatabaseViewer />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-insights" 
                  element={
                    <ProtectedRoute requireOnboarding>
                      <AIInsightsPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            
            <NotificationRenderer />
            <AccessibilityToolbar />
          </div>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
